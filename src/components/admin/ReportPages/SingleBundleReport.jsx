import React, { useEffect, useState, useMemo } from 'react';
import { Table, Typography, Select, Divider, Tag, Input, Button } from 'antd';
import { getSingleBundleReport } from "../../../service/ReportingService";
import { useParams } from 'react-router-dom';
import AdminHOC from "../../shared/HOC/AdminHOC";
import { DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

// Constants
const STATUS_MAP = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  PENDING: 'Pending',
  'Not Started': 'Not Started',
  'In Progress': 'In Progress',
  'Completed': 'Completed'
};

const ADHERENCE_ORDER = [
    'Overdue',
    'Not Due Yet',
    'Behind Schedule',
    'On Track',
    'Late',
    'On Time'
]; 

// Helper Functions
const formatDate = val => val ? new Date(val).toLocaleDateString() : '-';

const getStatusTag = (status) => (
  <Tag color={status === 'Completed' ? 'green' : status === 'In Progress' ? 'blue' : 'red'}>
    {status}
  </Tag>
);

const getEnrollmentType = (enrollmentSource) => {
  switch (enrollmentSource) {
    case 'BUNDLE':
    case 'INDIVIDUAL':
      return 'User';
    case 'GROUP_BUNDLE':
    case 'GROUP':
      return 'Group';
    default:
      return 'User';
  }
};

const calculateUserProgress = (enrollments) => {
  const courseMap = new Map();
  enrollments.forEach(e => {
    if (!courseMap.has(e.courseTitle)) {
      courseMap.set(e.courseTitle, e.courseCompletionPercentage || 0);
    }
  });
  const values = Array.from(courseMap.values());
  return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
};

const calculateGroupProgress = (enrollments) => {
  const userCourseMap = new Map();
  enrollments.forEach(e => {
    const key = `${e.userId}-${e.courseTitle}`;
    if (!userCourseMap.has(key)) {
      userCourseMap.set(key, e.courseCompletionPercentage || 0);
    }
  });
  const values = Array.from(userCourseMap.values());
  return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
};

const calculateWorstAdherence = (users) => {
  if (!users || users.length === 0) return 'Completed';
  
  return users.reduce((worst, user) => {
    const currentIndex = ADHERENCE_ORDER.indexOf(user.adherence || 'Completed');
    const worstIndex = ADHERENCE_ORDER.indexOf(worst || 'Completed');
    return currentIndex > worstIndex ? user.adherence : worst;
  }, 'Completed');
};

const calculateGroupStatus = (users) => {
  if (!users || users.length === 0) return 'Not Started';
  
  const statuses = users.map(u => u.status);
  const completedCount = statuses.filter(s => s === 'Completed').length;
  const inProgressCount = statuses.filter(s => s === 'In Progress').length;

  if (completedCount === statuses.length) return 'Completed';
  if (inProgressCount > 0) return 'In Progress';
  return 'Not Started';
};

// Reusable Components
const FilterSelect = ({ value, onChange, options, placeholder, style }) => (
  <Select value={value} onChange={onChange} style={style}>
    <Option value="ALL">{placeholder}</Option>
    {options.map(option => (
      <Option key={option.value || option} value={option.value || option}>
        {option.label || option}
      </Option>
    ))}
  </Select>
);

const CourseProgressTable = ({ courses, userId, rowKeyPrefix = '' }) => {
  if (!courses || courses.length === 0) {
    return <Text type="secondary">No courses found for this user.</Text>;
  }

  const courseColumns = [
    { title: 'Course', dataIndex: 'courseTitle' },
    { title: 'Level', dataIndex: 'courseLevel' },
    { 
      title: 'Progress', 
      dataIndex: 'courseCompletionPercentage',
      render: val => `${val || 0}%`
    },
    { 
      title: 'Status', 
      dataIndex: 'status',
      render: getStatusTag
    },
    { title: 'Adherence', dataIndex: 'adherence' },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      render: formatDate
    }
  ];

  // Find user's enrollments across all courses
  const userCourseData = courses.map(course => {
    // Check in group enrollments
    const groupEnrollment = course.groupEnrollments?.find(group => 
      group.enrolledUsers.some(user => user.userId === userId)
    );
    
    if (groupEnrollment) {
      const userEnrollment = groupEnrollment.enrolledUsers.find(user => user.userId === userId);
      return {
        ...course,
        ...userEnrollment,
        groupId: groupEnrollment.groupId,
        groupName: groupEnrollment.groupName
      };
    }

    // Check in individual enrollments
    const individualEnrollment = course.individualEnrollments?.find(user => user.userId === userId);
    if (individualEnrollment) {
      return {
        ...course,
        ...individualEnrollment
      };
    }

    return null;
  }).filter(Boolean);

  return (
    <Table
      dataSource={userCourseData}
      columns={courseColumns}
      pagination={false}
      rowKey={record => `${rowKeyPrefix}course-${record.courseId}`}
    />
  );
};

const SingleBundleReport = () => {
  const { bundleId } = useParams();
  const [data, setData] = useState(null);
  const [bundleInfo, setBundleInfo] = useState(null);
  const [enrollmentTypeFilter, setEnrollmentTypeFilter] = useState('ALL'); // Groups or Users
  const [specificFilter, setSpecificFilter] = useState('ALL'); // Specific group/user based on first filter
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [nestedExpandedUserKey, setNestedExpandedUserKey] = useState(null);

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bundleData = await getSingleBundleReport(bundleId);
        
        setData(bundleData);
        setBundleInfo({
          bundleId: bundleData.bundleId,
          bundleName: bundleData.bundleName
        });
      } catch (error) {
        console.error('Error fetching bundle data:', error);
        setData(null);
      }
    };
    
    fetchData();
  }, [bundleId]);

  // Transform API data to flat enrollment structure
  const getBundleEnrollments = () => {
    if (!data || !data.courses) return [];
    
    const enrollments = [];

    data.courses.forEach(course => {
      // Process group enrollments
      course.groupEnrollments?.forEach(group => {
        group.enrolledUsers?.forEach(user => {
          enrollments.push({
            ...user,
            courseId: course.courseId,
            courseTitle: course.courseTitle,
            courseLevel: course.courseLevel,
            groupId: group.groupId,
            groupName: group.groupName,
            bundleId: data.bundleId,
            bundleName: data.bundleName
          });
        });
      });

      // Process individual enrollments
      course.individualEnrollments?.forEach(user => {
        enrollments.push({
          ...user,
          courseId: course.courseId,
          courseTitle: course.courseTitle,
          courseLevel: course.courseLevel,
          bundleId: data.bundleId,
          bundleName: data.bundleName
        });
      });
    });

    return enrollments;
  };

  // Computed values
  const bundleEnrollments = getBundleEnrollments();

  const uniqueGroups = useMemo(() => {
    const groupSet = new Set();
    bundleEnrollments
      .filter(enrollment => enrollment.groupName && enrollment.enrollmentSource === 'GROUP_BUNDLE')
      .forEach(enrollment => {
        groupSet.add(JSON.stringify({
          groupId: enrollment.groupId,
          groupName: enrollment.groupName
        }));
      });
    
    return Array.from(groupSet).map(item => JSON.parse(item));
  }, [bundleEnrollments]);

  const uniqueUsers = useMemo(() => {
    const userSet = new Set();
    bundleEnrollments
      .filter(enrollment => ['BUNDLE', 'INDIVIDUAL'].includes(enrollment.enrollmentSource))
      .forEach(enrollment => {
        userSet.add(JSON.stringify({
          userId: enrollment.userId,
          fullName: enrollment.fullName
        }));
      });
    
    return Array.from(userSet).map(item => JSON.parse(item));
  }, [bundleEnrollments]);

  const bundleCourses = useMemo(() => {
    if (!data || !data.courses) return [];
    return data.courses;
  }, [data]);

  // Get available options for second filter based on first filter
  const getSpecificFilterOptions = () => {
    if (enrollmentTypeFilter === 'GROUPS') {
      return uniqueGroups.map(group => ({
        value: group.groupId,
        label: group.groupName
      }));
    } else if (enrollmentTypeFilter === 'USERS') {
      return uniqueUsers.map(user => ({
        value: user.userId,
        label: user.fullName
      }));
    }
    return [];
  };

  // Filtering logic
  const filteredData = () => {
    let filtered = bundleEnrollments;

    // First filter: Enrollment type (Groups vs Users)
    if (enrollmentTypeFilter === 'GROUPS') {
      filtered = filtered.filter(e => e.enrollmentSource === 'GROUP_BUNDLE');
    } else if (enrollmentTypeFilter === 'USERS') {
      filtered = filtered.filter(e => ['INDIVIDUAL', 'BUNDLE'].includes(e.enrollmentSource));
    }

    // Second filter: Specific group/user
    if (specificFilter !== 'ALL') {
      if (enrollmentTypeFilter === 'GROUPS') {
        filtered = filtered.filter(e => e.groupId === specificFilter);
      } else if (enrollmentTypeFilter === 'USERS') {
        filtered = filtered.filter(e => e.userId === specificFilter);
      }
    }

    // Third filter: Course selection
    if (selectedCourse) {
      filtered = filtered.filter(e => e.courseTitle === selectedCourse);
    }

    // Search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(e => 
        (e.fullName && e.fullName.toLowerCase().includes(searchLower)) ||
        (e.groupName && e.groupName.toLowerCase().includes(searchLower)) ||
        (e.courseTitle && e.courseTitle.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  };

  // Group and aggregate data for display
 const getDisplayData = () => {
  const filtered = filteredData();

  const groupMap = new Map();
  const userMap = new Map();

  filtered.forEach(enrollment => {
    const source = enrollment.enrollmentSource;

    if (source === 'GROUP_BUNDLE') {
      const key = enrollment.groupId;
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          id: `group-${enrollment.groupId}`,
          type: 'Group',
          displayTitle: enrollment.groupName,
          groupId: enrollment.groupId,
          groupName: enrollment.groupName,
          enrollments: [],
          users: new Set(),
          courses: new Set()
        });
      }

      const group = groupMap.get(key);
      group.enrollments.push(enrollment);
      group.users.add(enrollment.userId);
      group.courses.add(enrollment.courseTitle);
    } else if (['BUNDLE', 'INDIVIDUAL'].includes(source)) {
      const key = enrollment.userId;
      if (!userMap.has(key)) {
        userMap.set(key, {
          id: `user-${enrollment.userId}`,
          type: 'User',
          displayTitle: enrollment.fullName,
          userId: enrollment.userId,
          fullName: enrollment.fullName,
          enrollments: [],
          courses: new Set()
        });
      }

      const user = userMap.get(key);
      user.enrollments.push(enrollment);
      user.courses.add(enrollment.courseTitle);
    }
  });

  const groupRows = Array.from(groupMap.values()).map(group => {
    const enrollments = group.enrollments;
    return {
      ...group,
      courseCompletionPercentage: calculateGroupProgress(enrollments),
      status: calculateGroupStatus(enrollments),
      adherence: calculateWorstAdherence(enrollments),
      assignedAt: enrollments[0]?.assignedAt,
      deadline: enrollments[0]?.deadline,
      userCount: group.users.size,
      enrollmentSource: enrollments[0]?.enrollmentSource,
      enrollmentType: getEnrollmentType(enrollments[0]?.enrollmentSource)
    };
  });

  const userRows = Array.from(userMap.values()).map(user => {
    const enrollments = user.enrollments;
    return {
      ...user,
      courseCompletionPercentage: calculateUserProgress(enrollments),
      status: calculateGroupStatus(enrollments),
      adherence: calculateWorstAdherence(enrollments),
      assignedAt: enrollments[0]?.assignedAt,
      deadline: enrollments[0]?.deadline,
      enrollmentSource: enrollments[0]?.enrollmentSource,
      enrollmentType: getEnrollmentType(enrollments[0]?.enrollmentSource),
      groupName: enrollments[0]?.groupName,
      groupId: enrollments[0]?.groupId
    };
  });

  return [...groupRows, ...userRows];
};

  // Column definitions
  const getColumns = () => {
    const baseColumns = [
      {
        title: enrollmentTypeFilter === 'GROUPS' ? 'Group' : 'User',
        dataIndex: 'displayTitle',
        key: 'displayTitle',
        render: (_, record) => (
          <>
            <strong>{record.displayTitle}</strong>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {record.enrollmentSource === 'GROUP_BUNDLE' && record.groupName && record.type === 'User' && (
                <div>Group: {record.groupName}</div>
              )}
              {record.userCount && (
                <div>Users: {record.userCount}</div>
              )}
            </div>
          </>
        )
      },
      {
        title: 'Type',
        dataIndex: 'enrollmentType',
        key: 'enrollmentType',
        render: (type) => (
          <Tag color={type === 'Group' ? 'blue' : 'green'}>
            {type}
          </Tag>
        )
      },
      {
        title: 'Assigned At',
        dataIndex: 'assignedAt',
        render: formatDate,
        sorter: (a, b) => new Date(a.assignedAt) - new Date(b.assignedAt)
      },
      {
        title: 'Deadline',
        dataIndex: 'deadline',
        render: formatDate,
        sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline)
      },
      {
        title: 'Average Progress',
        dataIndex: 'courseCompletionPercentage',
        render: val => `${val || 0}%`,
        sorter: (a, b) => a.courseCompletionPercentage - b.courseCompletionPercentage
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: getStatusTag
      },
      {
        title: 'Adherence',
        dataIndex: 'adherence',
        sorter: (a, b) => (a.adherence || '').localeCompare(b.adherence || '')
      }
    ];

    return baseColumns;
  };

  // Export functionality
  const handleExport = () => {
    const currentData = getDisplayData();
    
    const exportData = currentData.map(row => {
      const formattedRow = {};
      getColumns().forEach(col => {
        const key = col.dataIndex;
        const title = col.title;
        let value = row[key];

        if (key === 'status') {
          value = STATUS_MAP[value] || value;
        } else if (col.render && typeof col.render === 'function' && key !== 'displayTitle') {
          const rendered = col.render(value, row);
          value = typeof rendered === 'string' ? rendered : String(value || '');
        }

        formattedRow[title] = typeof value === 'string' ? value : String(value || '');
      });

      return formattedRow;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bundle Report");
    
    const fileName = `${bundleInfo?.bundleName || 'Bundle'}_${enrollmentTypeFilter}_Report.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Event handlers
  const handleEnrollmentTypeFilterChange = (value) => {
    setEnrollmentTypeFilter(value);
    setSpecificFilter('ALL'); // Reset second filter
    setSelectedCourse(null); // Reset course filter
  };

  const handleSpecificFilterChange = (value) => {
    setSpecificFilter(value);
    setSelectedCourse(null); // Reset course filter
  };

  const handleExpandRow = (expanded, record) => {
    setExpandedRowKey(expanded ? record.id : null);
  };

  // FIXED: Expandable row render logic with proper user progress calculation
  const renderExpandedRow = (record) => {
    if (record.type === 'Group') {
      // Show users in this group
      const groupUsers = bundleEnrollments.filter(e => e.groupId === record.groupId);
      
      // Group by userId and calculate progress for each user
      const userMap = new Map();
      groupUsers.forEach(enrollment => {
        const userId = enrollment.userId;
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            userId: enrollment.userId,
            fullName: enrollment.fullName,
            enrollments: [],
            assignedAt: enrollment.assignedAt,
            deadline: enrollment.deadline
          });
        }
        userMap.get(userId).enrollments.push(enrollment);
      });

      // Calculate aggregated data for each user
      const aggregatedUsers = Array.from(userMap.values()).map(user => {
        const enrollments = user.enrollments;
        return {
          ...user,
          courseCompletionPercentage: calculateUserProgress(enrollments),
          status: calculateGroupStatus(enrollments),
          adherence: calculateWorstAdherence(enrollments)
        };
      });

      return (
        <div>
          <Title level={5}>Users in {record.groupName}</Title>
          <Table
            dataSource={
              nestedExpandedUserKey
                ? aggregatedUsers.filter(user => user.userId === nestedExpandedUserKey)
                : aggregatedUsers
            }
            columns={[
              { title: 'User', dataIndex: 'fullName' },
              { title: 'Progress', dataIndex: 'courseCompletionPercentage', render: val => `${val || 0}%` },
              { title: 'Status', dataIndex: 'status', render: getStatusTag },
              { title: 'Adherence', dataIndex: 'adherence' }
            ]}
            expandable={{
              expandedRowRender: (userRecord) => (
                <CourseProgressTable 
                  courses={selectedCourse 
                    ? bundleCourses.filter(c => c.courseTitle === selectedCourse) 
                    : bundleCourses}
                  userId={userRecord.userId}
                  rowKeyPrefix={`group-${record.groupId}-user-${userRecord.userId}-`}
                />
              ),
              expandedRowKeys: nestedExpandedUserKey ? [nestedExpandedUserKey] : [],
              onExpand: (expanded, userRecord) => {
                setNestedExpandedUserKey(expanded ? userRecord.userId : null);
              }
            }}
            pagination={false}
            rowKey="userId"
          />
        </div>
      );
    }

    if (record.type === 'User') {
      // Show courses for this user
      return (
        <div>
          <Title level={5}>Courses for {record.fullName}</Title>
          <CourseProgressTable 
            courses={selectedCourse 
              ? bundleCourses.filter(c => c.courseTitle === selectedCourse) 
              : bundleCourses}
            userId={record.userId}
            rowKeyPrefix={`user-${record.userId}-`}
          />
        </div>
      );
    }

    return null;
  };

  // Early return for loading/empty state
  if (!data) {
    return (
      <div style={{ padding: '75px 0px 0px 53px' }}>
        <Text>Loading bundle data...</Text>
      </div>
    );
  }

  if (!bundleInfo) {
    return (
      <div style={{ padding: '75px 0px 0px 53px' }}>
        <Text>No bundle information found or no enrollments for this bundle.</Text>
      </div>
    );
  }

  const displayData = getDisplayData();
  const specificFilterOptions = getSpecificFilterOptions();

  return (
    <div style={{ padding: '75px 0px 0px 53px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>{bundleInfo.bundleName}</Title>
          <Text>ID: {bundleInfo.bundleId}</Text><br />
          <Text>Courses: {bundleCourses.length}</Text><br />
          <Text>Total Enrollments: {bundleEnrollments.length}</Text>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 50 }}>
          <Search
            placeholder="Search users, groups, or courses"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
            style={{ width: 250 }}
          />
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            Export
          </Button>
          <Button icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </div>

      <Divider />

      {/* Filter Section */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        {/* First Filter: Enrollment Type (Groups vs Users) */}
        <Select 
          value={enrollmentTypeFilter} 
          onChange={handleEnrollmentTypeFilterChange} 
          style={{ width: 180 }}
        >
          <Option value="ALL">All Enrollments</Option>
          <Option value="GROUPS">Groups</Option>
          <Option value="USERS">Users</Option>
        </Select>

        {/* Second Filter: Specific Group/User (dynamic based on first filter) */}
        {enrollmentTypeFilter !== 'ALL' && specificFilterOptions.length > 0 && (
          <FilterSelect
            value={specificFilter}
            onChange={handleSpecificFilterChange}
            options={specificFilterOptions}
            placeholder={enrollmentTypeFilter === 'GROUPS' ? 'All Groups' : 'All Users'}
            style={{ width: 200 }}
          />
        )}

        {/* Third Filter: Course Selection */}
        <FilterSelect
          value={selectedCourse || 'ALL'}
          onChange={v => setSelectedCourse(v === 'ALL' ? null : v)}
          options={bundleCourses.map(c => c.courseTitle)}
          placeholder="All Courses"
          style={{ width: 200 }}
        />
      </div>

      {/* Main Table */}
      {displayData.length === 0 ? (
        <Text style={{ display: 'block', textAlign: 'center', marginTop: 24 }}>
          No enrollments match the selected filters
        </Text>
      ) : (
        <Table
          columns={getColumns()}
          dataSource={expandedRowKey 
            ? displayData.filter(row => row.id === expandedRowKey) 
            : displayData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: renderExpandedRow,
            expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
            onExpand: handleExpandRow
          }}
        />
      )}
    </div>
  );
};

export default AdminHOC(SingleBundleReport);