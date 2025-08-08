import React, { useEffect, useState } from 'react';
import { Table, Typography, Select, Divider, Tag, Input, Button } from 'antd';
import { getSingleUserReport } from "../../../service/ReportingService";
import { useParams } from 'react-router-dom';
import AdminHOC from "../../shared/HOC/AdminHOC";
import { DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const enrollmentSourceMap = {
  INDIVIDUAL: "Direct Assignment",
  GROUP: "Group Assignment",
  BUNDLE: "Bundle Assignment",
  GROUP_BUNDLE: "Group-Bundle Assignment"
};

const formatDate = val => val ? new Date(val).toLocaleDateString() : '-';

const SingleUserReport = () => {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [subType, setSubType] = useState('ALL');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [expandedCourseKey, setExpandedCourseKey] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getSingleUserReport(userId);
      setData({
        ...userData,
        enrollments: userData?.enrollments || []
      });
      const groupSet = new Set();
      userData?.enrollments?.forEach(e => {
        if (e.groupName && e.groupName !== 'null') groupSet.add(e.groupName);
      });
      setGroupOptions([...groupSet]);
    };
    fetchData();
  }, [userId]);

  const filteredEnrollments = () => {
    if (!data) return [];

    return data.enrollments.filter(e => {
      const isIndividual = ['INDIVIDUAL', 'BUNDLE'].includes(e.enrollmentSource);
      const isGroup = ['GROUP', 'GROUP_BUNDLE'].includes(e.enrollmentSource);
      if (filterType === 'GROUP' && !isGroup) return false;
      if (filterType === 'INDIVIDUAL' && !isIndividual) return false;
      if (selectedGroup !== 'ALL' && e.groupName !== selectedGroup) return false;
      if (subType === 'COURSE' && e.sourceType !== 'COURSE') return false;
      if (subType === 'BUNDLE' && e.sourceType !== 'BUNDLE') return false;
      if (subType === 'COURSE' && selectedCourse && e.courseTitle !== selectedCourse) return false;
      if (subType === 'BUNDLE' && selectedBundle && e.bundleName !== selectedBundle) return false;
      if (searchText && !((e.courseTitle && e.courseTitle.toLowerCase().includes(searchText.toLowerCase())) ||
         (e.bundleName && e.bundleName.toLowerCase().includes(searchText.toLowerCase())))) return false;
      return true;
    });
  }; 


  const uniqueCourses = data?.enrollments
    ? [...new Set(data.enrollments.filter(e => e.sourceType === 'COURSE').map(e => e.courseTitle))]
    : [];

  const uniqueBundles = data?.enrollments
    ? [...new Set(data.enrollments.filter(e => e.bundleId).map(e => e.bundleName))]
    : [];

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

  const courseColumns = [
  {
    title: 'Title',
    dataIndex: 'displayTitle',
    sorter: (a, b) => a.displayTitle.localeCompare(b.displayTitle),
    render: (_, record) => (
      <>
        <strong>{record.displayTitle}</strong>
        <div style={{ fontSize: '12px', color: '#888' }}>
          Enrollment Type: {record.enrollmentType}
          {record.groupName && record.groupName !== 'null' &&
            ['GROUP', 'GROUP_BUNDLE'].includes(record.enrollmentSource) && (
              <div>Group: {record.groupName}</div>
          )}
          {record.bundleName && record.bundleName !== 'null' &&
            record.type === 'Course' && expandedRowKey === null && (
              <div>Curriculum: {record.bundleName}</div>
          )}
        </div>
      </>
    )
  },
  {
    title: 'Type',
    dataIndex: 'type',
    filters: [
      { text: 'Course', value: 'Course' },
      { text: 'Bundle', value: 'Bundle' }
    ],
    onFilter: (value, record) => record.type === value
  },
  ...getCommonColumns()
];

const bundleColumns = [
  {
    title: 'Curriculum Title',
    dataIndex: 'bundleName',
    sorter: (a, b) => a.bundleName.localeCompare(b.bundleName)
  },
  ...getCommonColumns()
];

const handleExport = () => {
  const currentColumns = subType === 'BUNDLE' ? bundleColumns : courseColumns;
  const currentData = expandedRowKey
    ? topLevelEnrollments.filter(e => e.enrollmentId === expandedRowKey)
    : topLevelEnrollments;

  const exportData = currentData.map(row => {
    const formattedRow = {};
    currentColumns.forEach(col => {
      const key = col.dataIndex;
      const title = col.title;

      let value = row[key];

      // Apply custom render logic if needed
      // Handle special cases manually
      if (key === 'status') {
        const statusMap = {
          COMPLETED: 'Completed',
          IN_PROGRESS: 'In Progress',
          PENDING: 'Pending'
          // Add more if needed
        };
        value = statusMap[value] || value;
      } else if (col.render && typeof col.render === 'function') {
        // Try to extract string if render returns JSX
        const rendered = col.render(value, row);
        value = typeof rendered === 'string' ? rendered : String(value);
      }

      // Strip JSX if render returns React elements
      formattedRow[title] = typeof value === 'string' ? value : String(value);
    });

    return formattedRow;
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "User Report");

  const tableType = subType === 'BUNDLE' ? 'Curriculums' : 'IndividualCourses';
  XLSX.writeFile(wb, `${data.fullName}_${tableType}.xlsx`);
};

  if (!data || data.enrollments.length === 0) {
    return (
      <div style={{ padding: '75px 0px 0px 53px' }}>
        <Text>No enrollments for this user.</Text>
      </div>
    );
  }

  const bundleGroups = data.enrollments.reduce((acc, e) => {
  if (e.sourceType === 'BUNDLE') {
    if (!acc[e.bundleId]) acc[e.bundleId] = [];
    acc[e.bundleId].push(e);
  }
  return acc;
}, {});

const topLevelEnrollments = filteredEnrollments()
  .filter((e, idx, arr) => {
    if (e.sourceType === 'BUNDLE') {
      return arr.findIndex(x => x.bundleId === e.bundleId) === idx;
    }
    return true;
  })
  .map(e => {
    if (e.sourceType === 'BUNDLE') {
      const courses = bundleGroups[e.bundleId] || [];

      const progressValues = courses.map(c => c.courseCompletionPercentage || 0);
      const avgProgress = progressValues.length
        ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
        : 0;

      const statuses = courses.map(c => c.status);
      const isCompleted = statuses.every(s => s === 'Completed');
      const bundleStatus = isCompleted
        ? 'Completed'
        : statuses.includes('In Progress')
        ? 'In Progress'
        : 'Not Started';

        const adherenceOrder = [
          'Overdue',
          'Not Due Yet',
          'Behind Schedule',
          'On Track',
          'Late',
          'On Time'
        ];      
        const worstAdherence = courses.reduce((worst, c) => {
          const currentIndex = adherenceOrder.indexOf(c.adherence || 'Completed');
          const worstIndex = adherenceOrder.indexOf(worst || 'Completed');
          return currentIndex > worstIndex ? c.adherence : worst;
        }, 'Completed');

      return {
        ...e,
        displayTitle: e.bundleName,
        enrollmentType: e.enrollmentSource || 'INDIVIDUAL',
        type: 'Bundle',
        courseCompletionPercentage: avgProgress,
        status: bundleStatus,
        adherence: worstAdherence
      };
    }

    return {
      ...e,
      displayTitle: e.courseTitle,
      enrollmentType: e.enrollmentSource || 'INDIVIDUAL',
      type: 'Course'
    };
  });



  return (
  <div style={{ padding: '75px 0px 0px 53px' }}>
  <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <Title level={3} style={{ marginBottom: 0 }}>{data.fullName}</Title>
      <Text>ID: {data.userId}</Text><br />
      <Text>Email: {data.email}</Text><br />
      <Text>Role: {data.role}</Text>
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

    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
      <Select value={filterType} onChange={(v) => { setFilterType(v); setSelectedGroup('ALL'); }} style={{ width: 180 }}>
        <Option value="ALL">All Enrollments</Option>
        <Option value="GROUP">Group</Option>
        <Option value="INDIVIDUAL">Individual</Option>
      </Select>

      {filterType === 'GROUP' && (
        <Select value={selectedGroup} onChange={setSelectedGroup} style={{ width: 180 }}>
          <Option value="ALL">All Groups</Option>
          {groupOptions.map(g => <Option key={g} value={g}>{g}</Option>)}
        </Select>
      )}

      <Select value={subType} onChange={(v) => { setSubType(v); setSelectedCourse(null); setSelectedBundle(null); }} style={{ width: 180 }}>
        <Option value="ALL">All Types</Option>
        <Option value="COURSE">Individual Courses</Option>
        <Option value="BUNDLE">Curriculums</Option>
      </Select>

      {subType === 'COURSE' && (
        <Select
          value={selectedCourse || 'ALL'}
          onChange={v => setSelectedCourse(v === 'ALL' ? null : v)}
          style={{ width: 200 }}
        >
          <Option value="ALL">All Courses</Option>
          {uniqueCourses.map(c => <Option key={c} value={c}>{c}</Option>)}
        </Select>
      )}

      {subType === 'BUNDLE' && (
        <Select
          value={selectedBundle || 'ALL'}
          onChange={v => setSelectedBundle(v === 'ALL' ? null : v)}
          style={{ width: 200 }}
        >
          <Option value="ALL">All Curriculums</Option>
          {uniqueBundles.map(b => <Option key={b} value={b}>{b}</Option>)}
        </Select>
      )}
    </div>

    {filteredEnrollments().length === 0 ? (
      <Text style={{ display: 'block', textAlign: 'center', marginTop: 24 }}>
        No enrollments match the selected filters
      </Text>
    ) : (
      <Table
        columns={subType === 'BUNDLE' ? bundleColumns : courseColumns}
        dataSource={
          expandedRowKey
            ? topLevelEnrollments.filter(e => e.enrollmentId === expandedRowKey)
            : topLevelEnrollments
        }
        rowKey="enrollmentId"
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: record => {
            if (record.sourceType === 'COURSE') {
              return record.contentProgress?.length > 0 ? (
                <Table
                  dataSource={record.contentProgress}
                  columns={[
                    { title: 'Title', dataIndex: 'contentTitle' },
                    { title: 'Type', dataIndex: 'contentType' },
                    {
                      title: 'Completion',
                      dataIndex: 'contentCompletionPercentage',
                      render: val => `${val || 0}%`
                    }
                  ]}
                  pagination={false}
                  rowKey="contentId"
                />
              ) : 'No content started.';
            }

            if (record.type === 'Bundle') {
              const bundleCourses = bundleGroups[record.bundleId] || [];

              return bundleCourses.length > 0 ? (
              <Table
                dataSource={
                  expandedCourseKey
                    ? bundleCourses
                        .filter(c => c.enrollmentId === expandedCourseKey)
                        .map(c => ({
                          ...c,
                          displayTitle: c.courseTitle,
                          enrollmentType: c.enrollmentSource || 'INDIVIDUAL',
                          type: 'Course',
                          hasContent: c.contentProgress?.length > 0
                        }))
                    : bundleCourses.map(c => ({
                        ...c,
                        displayTitle: c.courseTitle,
                        enrollmentType: c.enrollmentSource || 'INDIVIDUAL',
                        type: 'Course',
                        hasContent: c.contentProgress?.length > 0
                      }))
                }
                columns={courseColumns}
                pagination={false}
                rowKey="enrollmentId"
                expandable={{
                  expandedRowRender: innerRecord => {
                    if (innerRecord.contentProgress?.length > 0) {
                      return (
                        <Table
                          dataSource={innerRecord.contentProgress}
                          columns={[
                            { title: 'Title', dataIndex: 'contentTitle' },
                            { title: 'Type', dataIndex: 'contentType' },
                            {
                              title: 'Completion',
                              dataIndex: 'contentCompletionPercentage',
                              render: val => `${val || 0}%`
                            }
                          ]}
                          pagination={false}
                          rowKey="contentId"
                        />
                      );
                    }
                    return <Text type="secondary">No content started.</Text>;
                  },
                  onExpand: (expanded, innerRecord) =>
                    setExpandedCourseKey(expanded ? innerRecord.enrollmentId : null),
                  rowExpandable: () => true
                }}
              />
              ) : 'No courses in this curriculum.';
            }

            return null;
          },
          onExpand: (expanded, record) => setExpandedRowKey(expanded ? record.enrollmentId : null)
        }}
      />
    )}
  </div>
);
};

export default AdminHOC(SingleUserReport);