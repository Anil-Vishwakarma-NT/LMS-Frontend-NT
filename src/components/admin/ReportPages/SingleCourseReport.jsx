import React, { useEffect, useState, useMemo } from 'react';
import { Table, Typography, Select, Divider, Tag, Input, Button } from 'antd';
import { getSingleCourseReport } from "../../../service/ReportingService";
import { useParams } from 'react-router-dom';
import AdminHOC from "../../shared/HOC/AdminHOC";
import { DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const enrollmentSourceMap = {
  INDIVIDUAL: "Individual Assignment",
  BUNDLE: "Bundle Assignment"
};

const formatDate = val => val ? new Date(val).toLocaleDateString() : '-';

const SingleCourseReport = () => {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [subType, setSubType] = useState('ALL');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [bundleOptions, setBundleOptions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [expandedUserKey, setExpandedUserKey] = useState(null);
  const [selectedUser, setSelectedUser] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      const courseData = await getSingleCourseReport(courseId);
      setData({
        ...courseData,
        enrollments: courseData?.enrolledUsers || []
      });
      
      // Extract unique groups and bundles
      const groupSet = new Set();
      const bundleSet = new Set();
      
      courseData?.enrolledUsers?.forEach(e => {
        if (e.groupName && e.groupName !== 'null') groupSet.add(e.groupName);
        if (e.bundleName && e.bundleName !== 'null') bundleSet.add(e.bundleName);
      });
      
      setGroupOptions([...groupSet]);
      setBundleOptions([...bundleSet]);
    };
    fetchData();
  }, [courseId]);

  const userOptions = useMemo(() => {
  if (!data) return [];
  const users = data.enrollments
    .filter(e => !e.groupId) // Only individual enrollments
    .map(e => e.fullName)
    .filter(Boolean); // Remove undefined/null names
  return [...new Set(users)].sort(); // Unique + sorted
  }, [data]);

  const filteredEnrollments = () => {
  if (!data) return [];

  return data.enrollments.filter(e => {
    const isIndividual = ['INDIVIDUAL', 'BUNDLE'].includes(e.enrollmentSource);
    const isBundle = ['BUNDLE', 'GROUP_BUNDLE'].includes(e.enrollmentSource);
    const isUser = !e.groupId;
    const isGroup = !!e.groupId;

    // Filter by enrollment source
    if (filterType === 'BUNDLE' && !isBundle) return false;
    if (filterType === 'INDIVIDUAL' && !isIndividual) return false;

    // Filter by enrollee type
    if (subType === 'USER' && !isUser) return false;
    if (subType === 'GROUP' && !isGroup) return false;

    // Sub-filters (apply conditionally)
    if (subType === 'GROUP' && selectedGroup !== 'ALL' && e.groupName !== selectedGroup) return false;
    if (subType === 'USER' && selectedUser !== 'ALL' && e.fullName !== selectedUser) return false;

    // Bundle filter
    if (selectedBundle && e.bundleName !== selectedBundle) return false;

    // Search filter
    if (searchText && !(
      (e.fullName && e.fullName.toLowerCase().includes(searchText.toLowerCase())) ||
      (e.groupName && e.groupName.toLowerCase().includes(searchText.toLowerCase())) ||
      (e.bundleName && e.bundleName.toLowerCase().includes(searchText.toLowerCase()))
    )) return false;

    return true;
  });
};

  const getCommonColumns = () => [
    {
      title: 'Enrolled At',
      dataIndex: 'enrolledAt',
      render: formatDate,
      sorter: (a, b) => new Date(a.enrolledAt) - new Date(b.enrolledAt)
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
      render: val => (
        <Tag color={val === 'Completed' ? 'green' : val === 'In Progress' ? 'blue' : 'red'}>
          {val}
        </Tag>
      )
    },
    {
      title: 'Adherence',
      dataIndex: 'adherence',
      sorter: (a, b) => (a.adherence || '').localeCompare(b.adherence || '')
    }
  ];

  const enrolleeColumns = [
    {
      title: 'Name',
      dataIndex: 'displayTitle',
      sorter: (a, b) => a.displayTitle.localeCompare(b.displayTitle),
      render: (_, record) => (
        <>
          <strong>{record.displayTitle}</strong>
          <div style={{ fontSize: '12px', color: '#888' }}>
            Enrollment: {enrollmentSourceMap[record.enrollmentSource] || record.enrollmentSource}
            {record.groupName && record.groupName !== 'null' && record.enrolleeType === 'USER' && (
              <div>Group: {record.groupName}</div>
            )}
            {record.bundleName && record.bundleName !== 'null' && (
              <div>Bundle: {record.bundleName}</div>
            )}
          </div>
        </>
      )
    },
    {
      title: 'Type',
      dataIndex: 'enrolleeType',
      filters: [
        { text: 'User', value: 'USER' },
        { text: 'Group', value: 'GROUP' }
      ],
      onFilter: (value, record) => record.enrolleeType === value,
      render: val => val === 'USER' ? 'User' : 'Group'
    },
    ...getCommonColumns()
  ];

  const handleExport = () => {
    const currentData = expandedRowKey
      ? topLevelEnrollments.filter(e => e.enrollmentId === expandedRowKey)
      : topLevelEnrollments;

    const exportData = currentData.map(row => {
      const formattedRow = {};
      enrolleeColumns.forEach(col => {
        const key = col.dataIndex;
        const title = col.title;
        let value = row[key];

        if (key === 'status') {
          const statusMap = {
            COMPLETED: 'Completed',
            IN_PROGRESS: 'In Progress',
            PENDING: 'Pending'
          };
          value = statusMap[value] || value;
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
    XLSX.utils.book_append_sheet(wb, ws, "Course Report");
    XLSX.writeFile(wb, `${data.courseTitle}_Enrollees.xlsx`);
  };

  if (!data || data.enrollments.length === 0) {
    return (
      <div style={{ padding: '75px 0px 0px 53px' }}>
        <Text>No enrollments for this course.</Text>
      </div>
    );
  }

  // Group enrollments by group for nested display
  const groupEnrollments = data.enrollments.reduce((acc, e) => {
    if (e.groupId) {
      if (!acc[e.groupId]) acc[e.groupId] = [];
      acc[e.groupId].push(e);
    }
    return acc;
  }, {});

  const topLevelEnrollments = filteredEnrollments()
    .filter((e, idx, arr) => {
      if (e.groupId) {
        return arr.findIndex(x => x.groupId === e.groupId) === idx;
      }
      return true;
    })
    .map(e => {
      if (e.groupId) {
        const users = groupEnrollments[e.groupId] || [];
        
        // Calculate group average progress
        const progressValues = users.map(u => u.courseCompletionPercentage || 0);
        const avgProgress = progressValues.length
          ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
          : 0;

        // Calculate group status
        const statuses = users.map(u => u.status);
        const isCompleted = statuses.every(s => s === 'Completed');
        const groupStatus = isCompleted
          ? 'Completed'
          : statuses.includes('In Progress')
          ? 'In Progress'
          : 'Not Started';

        // Calculate worst adherence
        const adherenceOrder = [
            'Overdue',
            'Not Due Yet',
            'Behind Schedule',
            'On Track',
            'Late',
            'On Time'
        ]; 
        const worstAdherence = users.reduce((worst, u) => {
          const currentIndex = adherenceOrder.indexOf(u.adherence || 'Completed');
          const worstIndex = adherenceOrder.indexOf(worst || 'Completed');
          return currentIndex > worstIndex ? u.adherence : worst;
        }, 'Completed');

        return {
          ...e,
          displayTitle: e.groupName,
          enrolleeType: 'GROUP',
          courseCompletionPercentage: avgProgress,
          status: groupStatus,
          adherence: worstAdherence,
          enrolledAt: e.assignedAt
        };
      }

      return {
        ...e,
        displayTitle: e.fullName,
        enrolleeType: 'USER',
        enrolledAt: e.assignedAt
      };
    });

  return (
    <div style={{ padding: '75px 0px 0px 53px' }}>
      <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>{data.courseTitle}</Title>
          <Text>ID: {data.courseId}</Text><br />
          <Text>Total Enrollments: {data.enrollments?.length || 0}</Text>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 50 }}>
          <Search
            placeholder="Search users or groups"
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

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Select 
          value={filterType} 
          onChange={(v) => { 
            setFilterType(v); 
            setSelectedBundle(null); 
          }} 
          style={{ width: 180 }}
        >
          <Option value="ALL">All Enrollments</Option>
          <Option value="INDIVIDUAL">Individual</Option>
          <Option value="BUNDLE">Bundle</Option>
        </Select>

         {filterType === 'BUNDLE' && bundleOptions.length > 0 && (
        <Select
            value={selectedBundle}
            onChange={setSelectedBundle}
            style={{ width: 180 }}
            >
            <Option value={null}>All Bundles</Option>
            {bundleOptions.map(b => <Option key={b} value={b}>{b}</Option>)}
        </Select>
          )}


        <Select 
          value={subType} 
          onChange={(v) => { 
            setSubType(v); 
            setSelectedGroup('ALL'); 
          }} 
          style={{ width: 180 }}
        >
          <Option value="ALL">All Types</Option>
          <Option value="USER">Users</Option>
          <Option value="GROUP">Groups</Option>
        </Select>

        

        {subType === 'GROUP' && (
        <Select
            value={selectedGroup}
            onChange={setSelectedGroup}
            style={{ width: 180 }}
            placeholder="Select Group"
        >
            <Option value="ALL">All Groups</Option>
            {groupOptions.map(group => (
            <Option key={group} value={group}>{group}</Option>
            ))}
        </Select>
        )}

        {subType === 'USER' && (
        <Select
            value={selectedUser}
            onChange={setSelectedUser}
            style={{ width: 180 }}
            placeholder="Select User"
            allowClear
            showSearch
        >
            <Option value="ALL">All Users</Option>
            {userOptions.map(user => (
            <Option key={user} value={user}>{user}</Option>
            ))}
        </Select>
        )}

      </div>

      {filteredEnrollments().length === 0 ? (
        <Text style={{ display: 'block', textAlign: 'center', marginTop: 24 }}>
          No enrollments match the selected filters
        </Text>
      ) : (
        <Table
          columns={enrolleeColumns}
            dataSource={
            expandedRowKey
                ? topLevelEnrollments.filter(e =>
                    e.groupId ? `group-${e.groupId}` === expandedRowKey : e.userId === expandedRowKey
                )
                : topLevelEnrollments
            }
        rowKey={record => record.groupId ? `group-${record.groupId}` : record.userId}          pagination={{ pageSize: 10 }}
        expandable={{
        expandedRowRender: record => {
        if (record.enrolleeType === 'GROUP') {
        const groupUsers = groupEnrollments[record.groupId] || [];

        return groupUsers.length > 0 ? (
          <Table
            dataSource={groupUsers.map(u => ({
              ...u,
              displayTitle: u.fullName,
              enrolleeType: 'USER',
              enrolledAt: u.assignedAt
            }))}
            columns={enrolleeColumns}
            pagination={false}
            rowKey="userId"
          />
        ) : (
          <Text type="secondary">No users in this group.</Text>
        );
      }
      return null;
    },
    rowExpandable: record => record.enrolleeType === 'GROUP',
    onExpand: (expanded, record) =>
      setExpandedRowKey(expanded ? (record.groupId ? `group-${record.groupId}` : record.userId) : null)

  }}

        />
      )}
    </div>
  );
};

export default AdminHOC(SingleCourseReport);