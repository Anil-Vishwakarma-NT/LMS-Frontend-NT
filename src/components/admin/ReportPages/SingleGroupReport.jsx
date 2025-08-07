import React, { useEffect, useState } from 'react';
import { Table, Typography, Select, Tag, Input, Button, Divider } from 'antd';
import { getSingleGroupReport } from "../../../service/ReportingService";
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


const adherenceOrder = [
    'Overdue',
    'Not Due Yet',
    'Behind Schedule',
    'On Track',
    'Late',
    'On Time'
]; 

const LEARNER_COLUMNS = [
  { title: 'Learner', dataIndex: 'displayTitle', key: 'displayTitle' },
  { title: 'Progress', dataIndex: 'progress', key: 'progress' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Adherence', dataIndex: 'adherence', key: 'adherence' }
];

const SUB_TYPE_OPTIONS = [
  { value: 'ALL', label: 'All' },
  { value: 'COURSE', label: 'Individual Courses' },
  { value: 'BUNDLE', label: 'Curriculums' }
];

// Helper Functions
const formatDate = val => val ? new Date(val).toLocaleDateString() : '-';

const getStatusTag = (status) => (
  <Tag color={status === 'Completed' ? 'green' : status === 'In Progress' ? 'blue' : 'red'}>
    {status}
  </Tag>
);

const getUniqueValues = (data, sourceFilter, field) => [
  ...new Set(data.filter(e => e.enrollmentSource === sourceFilter).map(e => e[field]))
];

const transformLearnerData = (learners) => 
  learners.map(l => ({
    ...l,
    displayTitle: l.fullName,
    progress: `${l.courseCompletionPercentage || 0}%`,
    status: STATUS_MAP[l.status] || l.status
  }));

const filterLearners = (userCourses, courseId, bundleId, selectedUser) => 
  userCourses.filter(e => {
    const courseMatch = courseId ? e.courseId === courseId : true;
    const bundleMatch = bundleId ? e.bundleId === bundleId : true;
    const userMatch = !selectedUser || e.fullName === selectedUser;
    return courseMatch && bundleMatch && userMatch;
  });

const calculateAverageProgress = (items, progressField = 'courseCompletionPercentage') => {
  if (!items || items.length === 0) return 0;
  const validItems = items.filter(item => item[progressField] != null);
  if (validItems.length === 0) return 0;
  const sum = validItems.reduce((acc, item) => acc + (item[progressField] || 0), 0);
  return Math.round(sum / validItems.length);
};

const calculateBundleProgress = (data, bundleId) => {
  const coursesInBundle = [...new Map(
    data.userCourses
      .filter(e => e.bundleId === bundleId)
      .map(e => [e.courseId, e])
  ).values()];
  
  const courseAverages = coursesInBundle.map(course => {
    const courseUsers = data.userCourses.filter(e => 
      e.bundleId === bundleId && e.courseId === course.courseId
    );
    return calculateAverageProgress(courseUsers);
  });
  
  return calculateAverageProgress(courseAverages.map(avg => ({ courseCompletionPercentage: avg })));
};

const calculateCourseProgress = (data, courseId) => {
  const courseUsers = data.userCourses.filter(e => e.courseId === courseId);
  return calculateAverageProgress(courseUsers);
};

const getUniqueEnrollments = (filtered, subType) => {
  if (subType === 'COURSE') {
    return [...new Map(filtered.map(e => [e.courseId, e])).values()];
  } else if (subType === 'BUNDLE') {
    return [...new Map(filtered.map(e => [e.bundleId, e])).values()];
  } else {
    const courseMap = new Map();
    const bundleMap = new Map();
    filtered.forEach(e => {
      if (e.enrollmentSource === 'GROUP') courseMap.set(e.courseId, e);
      if (e.enrollmentSource === 'GROUP_BUNDLE') bundleMap.set(e.bundleId, e);
    });
    return [...courseMap.values(), ...bundleMap.values()];
  }
};

// Reusable Components
const FilterSelect = ({ value, onChange, options, placeholder, style }) => (
  <Select value={value} onChange={onChange} style={style}>
    <Option value="ALL">{placeholder}</Option>
    {options.map(option => (
      <Option key={option} value={option}>{option}</Option>
    ))}
  </Select>
);

const LearnerTable = ({ learners, rowKeyPrefix = '' }) => {
  if (learners.length === 0) {
    return <Text type="secondary">No learners enrolled.</Text>;
  }

  return (
    <Table
      dataSource={transformLearnerData(learners)}
      columns={LEARNER_COLUMNS}
      pagination={false}
      rowKey={record => `${rowKeyPrefix}${record.userId}-${record.courseId}`}
    />
  );
};

const SingleGroupReport = () => {
  const { groupId } = useParams();
  const [data, setData] = useState(null);
  const [subType, setSubType] = useState('COURSE');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedCourseInBundle, setExpandedCourseInBundle] = useState(null);

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      const groupData = await getSingleGroupReport(groupId);
      setData({
        ...groupData,
        userCourses: groupData?.userCourses || []
      });
      // Reset filters
      setSubType('ALL');
      setSelectedCourse(null);
      setSelectedBundle(null);
      setSelectedUser(null);
      setSearchText('');
      setExpandedRowKey(null);
      setExpandedCourseInBundle(null);
    };
    fetchData();
  }, [groupId]);

  // Computed values
  const uniqueCourses = data ? getUniqueValues(data.userCourses, 'GROUP', 'courseTitle') : [];
  const uniqueBundles = data ? getUniqueValues(data.userCourses, 'GROUP_BUNDLE', 'bundleName') : [];
  const uniqueUsers = data ? [...new Set(data.userCourses.map(e => e.fullName))] : [];

  // Filtering logic
  const filteredEnrollments = () => {
    if (!data) return [];

    const filtered = data.userCourses.filter(e => {
      const isCourse = e.enrollmentSource === 'GROUP';
      const isBundle = e.enrollmentSource === 'GROUP_BUNDLE';

      // Type filter
      if (subType === 'COURSE' && !isCourse) return false;
      if (subType === 'BUNDLE' && !isBundle) return false;

      // Specific selection filters
      if (subType === 'COURSE' && selectedCourse && e.courseTitle !== selectedCourse) return false;
      if (subType === 'BUNDLE' && selectedBundle && e.bundleName !== selectedBundle) return false;

      // User filter
      if (selectedUser && e.fullName !== selectedUser) return false;

      // Search filter
      if (searchText && !(
        e.courseTitle?.toLowerCase().includes(searchText.toLowerCase()) ||
        e.bundleName?.toLowerCase().includes(searchText.toLowerCase())
      )) return false;

      return true;
    });

    return getUniqueEnrollments(filtered, subType);
  };

  // Column definitions
  const getCommonColumns = () => [
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
      title: 'Progress',
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

  const getDynamicColumns = () => {
    const titleMap = {
      'ALL': 'Title',
      'COURSE': 'Course',
      'BUNDLE': 'Curriculum'
    };

    return [
      {
        title: titleMap[subType],
        dataIndex: 'displayTitle',
        key: 'displayTitle'
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type'
      },
      ...getCommonColumns()
    ];
  };

  // Export functionality
  const handleExport = () => {
    const currentData = expandedRowKey
      ? enrollmentsToRender.filter(e => (e.courseId || e.bundleId) === expandedRowKey)
      : enrollmentsToRender;

    const exportData = currentData.map(row => {
      const formattedRow = {};
      getDynamicColumns().forEach(col => {
        const key = col.dataIndex;
        const title = col.title;
        let value = row[key];

        if (key === 'status') {
          value = STATUS_MAP[value] || value;
        } else if (col.render && typeof col.render === 'function') {
          const rendered = col.render(value, row);
          value = typeof rendered === 'string' ? rendered : String(value);
        }

        formattedRow[title] = typeof value === 'string' ? value : String(value);
      });

      return formattedRow;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Group Report");
    XLSX.writeFile(wb, `${data.groupName}_Report.xlsx`);
  };

  // Event handlers
  const handleSubTypeChange = (v) => {
    setSubType(v);
    setSelectedCourse(null);
    setSelectedBundle(null);
  };

  const handleExpandRow = (expanded, record) => {
    const key = record.courseId || record.bundleId;
    setExpandedRowKey(expanded ? key : null);
  };

  // Early return for loading/empty state
  if (!data || data.userCourses.length === 0) {
    return (
      <div style={{ padding: '75px 0px 0px 53px' }}>
        <Text>No enrollments for this group.</Text>
      </div>
    );
  }

  // Prepare data for rendering
  const enrollmentsToRender = filteredEnrollments().map(e => {
    const isBundle = e.enrollmentSource === 'GROUP_BUNDLE';
    const calculatedProgress = isBundle 
      ? calculateBundleProgress(data, e.bundleId)
      : calculateCourseProgress(data, e.courseId);

    return {
      ...e,
      displayTitle: isBundle ? e.bundleName : e.courseTitle,
      enrollmentType: e.enrollmentSource,
      type: isBundle ? 'Bundle' : 'Course',
      courseCompletionPercentage: calculatedProgress
    };
  });

  // Expandable row render logic
  const renderExpandedRow = (record) => {
    const isBundle = record.enrollmentSource === 'GROUP_BUNDLE';

    if (isBundle) {
      const coursesInBundle = [
        ...new Map(
          data.userCourses
            .filter(e => e.bundleId === record.bundleId)
            .map(e => [e.courseId, e])
        ).values()
      ];

      // Calculate progress for each course in bundle
      const coursesWithProgress = coursesInBundle.map(c => {
        const courseProgress = calculateCourseProgress(data, c.courseId);
        return {
          ...c,
          displayTitle: c.courseTitle,
          type: 'Course',
          courseCompletionPercentage: courseProgress,
          // Add other fields needed for main table structure
          status: STATUS_MAP[c.status] || c.status,
          assignedAt: c.assignedAt,
          deadline: c.deadline,
          adherence: c.adherence
        };
      });

      return (
        <Table
          dataSource={
            expandedCourseInBundle
              ? coursesWithProgress.filter(c => c.courseId === expandedCourseInBundle)
              : coursesWithProgress
          }
          columns={getDynamicColumns().map(col => {
            if (col.dataIndex === 'displayTitle') {
              return { ...col, title: 'Course' };
            }
            return col;
          })}
          expandable={{
            expandedRowRender: courseRecord => {
              const learners = filterLearners(
                data.userCourses,
                courseRecord.courseId,
                record.bundleId,
                selectedUser
              );

              return (
                <LearnerTable
                  learners={learners}
                  rowKeyPrefix={`bundle-${record.bundleId}-`}
                />
              );
            },
            onExpand: (expanded, courseRecord) => {
              setExpandedCourseInBundle(expanded ? courseRecord.courseId : null);
            },
            rowExpandable: () => true
          }}
          pagination={false}
          rowKey={c => c.courseId}
        />
      );
    }

    // Handle individual course enrollment
    const learners = filterLearners(
      data.userCourses,
      record.courseId,
      null,
      selectedUser
    );

    return (
      <LearnerTable
        learners={learners}
        rowKeyPrefix={`course-${record.courseId}-`}
      />
    );
  };

  return (
    <div style={{ padding: '75px 0px 0px 53px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>{data.groupName}</Title>
          <Text>ID: {data.groupId}</Text>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 50 }}>
          <Search
            placeholder="Search courses or bundles"
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
        <Select value={subType} onChange={handleSubTypeChange} style={{ width: 180 }}>
          {SUB_TYPE_OPTIONS.map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
          ))}
        </Select>

        {subType === 'COURSE' && (
          <FilterSelect
            value={selectedCourse || 'ALL'}
            onChange={v => setSelectedCourse(v === 'ALL' ? null : v)}
            options={uniqueCourses}
            placeholder="All Courses"
            style={{ width: 200 }}
          />
        )}

        {subType === 'BUNDLE' && (
          <FilterSelect
            value={selectedBundle || 'ALL'}
            onChange={v => setSelectedBundle(v === 'ALL' ? null : v)}
            options={uniqueBundles}
            placeholder="All Curriculums"
            style={{ width: 200 }}
          />
        )}

        <FilterSelect
          value={selectedUser || 'ALL'}
          onChange={v => setSelectedUser(v === 'ALL' ? null : v)}
          options={uniqueUsers}
          placeholder="All Users"
          style={{ width: 200 }}
        />
      </div>

      {/* Main Table */}
      {filteredEnrollments().length === 0 ? (
        <Text style={{ display: 'block', textAlign: 'center', marginTop: 24 }}>
          No enrollments match the selected filters
        </Text>
      ) : (
        <Table
          columns={getDynamicColumns()}
          dataSource={
            expandedRowKey
              ? enrollmentsToRender.filter(e => (e.courseId || e.bundleId) === expandedRowKey)
              : enrollmentsToRender
          }
          rowKey={record => `${record.courseId || record.bundleId}`}
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: renderExpandedRow,
            onExpand: handleExpandRow,
            rowExpandable: record =>
              record.enrollmentSource === 'GROUP_BUNDLE' || record.enrollmentSource === 'GROUP'
          }}
        />
      )}
    </div>
  );
};

export default AdminHOC(SingleGroupReport);