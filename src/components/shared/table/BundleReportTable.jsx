import React, { useEffect, useState } from "react";
import { Table, Button, Typography, Input } from "antd";
import * as XLSX from "xlsx";
import { getBundleKpiReport } from "../../../service/ReportingService";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const BundleKpiReportTable = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const pageSize = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getBundleKpiReport(page - 1, pageSize);
      const { records = [], total = 0 } = res || {};
      setData(records);
      setTotal(total);
      setLoading(false);
    };
    fetchData();
  }, [page]);

  const handleSearch = (value) => setSearchText(value.toLowerCase());

  const filteredData = data.filter((item) => {
    const text = searchText.trim();
    if (!text) return true;
    return (
      item.bundleName?.toLowerCase().includes(text) ||
      item.bundleId?.toString().includes(text) 
    )
  });

  const renderWithNA = (val) =>
    val === null || val === undefined || val === "" ? "NA" : val;

const columns = [
  {
    title: "Bundle ID",
    dataIndex: "bundleId",
    key: "bundleId",
    width: 100,
    sorter: (a, b) => a.bundleId - b.bundleId,
  },
  {
    title: "Bundle Name",
    dataIndex: "bundleName",
    key: "bundleName",
    width: 180,
    sorter: (a, b) => a.bundleName.localeCompare(b.bundleName),
  },
  {
    title: "Individual Users Enrolled",
    dataIndex: "individualUsersEnrolled",
    key: "individualUsersEnrolled",
    width: 180,
    sorter: (a, b) => a.individualUsersEnrolled - b.individualUsersEnrolled,
  },
{
  title: "Highest Completion %",
  dataIndex: "individualHighestCompletion",
  key: "individualHighestCompletion",
  width: 150,
  sorter: (a, b) => (a.individualHighestCompletion || 0) - (b.individualHighestCompletion || 0),
  render: renderWithNA,
},
{
  title: "Lowest Completion %",
  dataIndex: "individualLowestCompletion",
  key: "individualLowestCompletion",
  width: 150,
  sorter: (a, b) => (a.individualLowestCompletion || 0) - (b.individualLowestCompletion || 0),
  render: renderWithNA,
},
  {
    title: "Individual Avg Completion %",
    dataIndex: "individualAvgCompletion",
    key: "individualAvgCompletion",
    width: 180,
    sorter: (a, b) => a.individualAvgCompletion - b.individualAvgCompletion,
    render: renderWithNA,

  },
  {
    title: "Groups Enrolled",
    dataIndex: "groupsEnrolled",
    key: "groupsEnrolled",
    width: 150,
    sorter: (a, b) => a.groupsEnrolled - b.groupsEnrolled,
  },
  {
    title: "Group Highest Completion %",
    dataIndex: "groupHighestCompletion",
    key: "groupHighestCompletion",
    width: 180,
    sorter: (a, b) => a.groupHighestCompletion - b.groupHighestCompletion,
    render: renderWithNA,

  },
  {
    title: "Group Lowest Completion %",
    dataIndex: "groupLowestCompletion",
    key: "groupLowestCompletion",
    width: 180,
    sorter: (a, b) => a.groupLowestCompletion - b.groupLowestCompletion,
    render: renderWithNA,

  },
  {
    title: "Group Avg Completion %",
    dataIndex: "groupAvgCompletion",
    key: "groupAvgCompletion",
    width: 180,
    sorter: (a, b) => a.groupAvgCompletion - b.groupAvgCompletion,
    render: renderWithNA,

  },
  {
    title: "Total Courses",
    dataIndex: "totalCourses",
    key: "totalCourses",
    width: 150,
    sorter: (a, b) => a.totalCourses - b.totalCourses,
  },
  {
    title: "Total Enrollments",
    dataIndex: "totalEnrollments",
    key: "totalEnrollments",
    width: 160,
    sorter: (a, b) => a.totalEnrollments - b.totalEnrollments,
  },
  {
    title: "Courses Completed",
    dataIndex: "coursesCompleted",
    key: "coursesCompleted",
    width: 160,
    sorter: (a, b) => a.coursesCompleted - b.coursesCompleted,
  },
  {
    title: "Courses In Progress",
    dataIndex: "coursesInProgress",
    key: "coursesInProgress",
    width: 160,
    sorter: (a, b) => a.coursesInProgress - b.coursesInProgress,
  },
  {
    title: "Courses Not Started",
    dataIndex: "coursesNotStarted",
    key: "coursesNotStarted",
    width: 170,
    sorter: (a, b) => a.coursesNotStarted - b.coursesNotStarted,
  },
  {
    title: "Courses Completed On Time",
    dataIndex: "coursesCompletedOnTime",
    key: "coursesOnTime",
    width: 150,
    sorter: (a, b) => a.coursesOnTime - b.coursesOnTime,
  },
  {
    title: "Courses Completed Late",
    dataIndex: "coursesCompletedLate",
    key: "coursesLate",
    width: 150,
    sorter: (a, b) => a.coursesLate - b.coursesLate,
  },
  {
    title: "Courses On Track",
    dataIndex: "coursesOnTrack",
    key: "coursesOnTrack",
    width: 160,
    sorter: (a, b) => a.coursesOnTrack - b.coursesOnTrack,
  },
  {
    title: "Courses Behind Schedule",
    dataIndex: "coursesBehindSchedule",
    key: "coursesBehindSchedule",
    width: 190,
    sorter: (a, b) => a.coursesBehindSchedule - b.coursesBehindSchedule,
  },
  {
    title: "Courses Not Due Yet",
    dataIndex: "coursesNotDueYet",
    key: "coursesNotDueYet",
    width: 170,
    sorter: (a, b) => a.coursesNotDueYet - b.coursesNotDueYet,
  },
  {
    title: "Courses Overdue",
    dataIndex: "coursesOverdue",
    key: "coursesOverdue",
    width: 160,
    sorter: (a, b) => a.coursesOverdue - b.coursesOverdue,
  },
];


  const sanitizeData = (data) =>
    JSON.parse(
      JSON.stringify(data, (_, val) => (val === null || val === undefined ? "null" : val))
    );

  const handleExport = () => {
    const cleanData = sanitizeData(data);
    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bundle Report");
    XLSX.writeFile(workbook, "bundle_kpi_report.xlsx");
  };

  return (
    <div style={{ padding: 32, backgroundColor: "#fff", borderRadius: 8 }}>
      <div
        style={{
          marginBottom: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Title level={5} style={{ margin: 0, fontSize: 20 }}>
          Bundle KPI Report
        </Title>
        <div style={{ display: "flex", gap: 6 }}>
          <Input.Search
            placeholder="Search by bundle name, level, or creator"
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            style={{ width: 250 }}
            size="middle"
          />
          <Button type="primary" onClick={handleExport} size="middle">
            Export
          </Button>
          <Button onClick={() => navigate(-1)} size="middle">
            Back
          </Button>
        </div>
      </div>

      <div
        style={{
          overflow: "auto",
          border: "1px solid #f0f0f0",
          borderRadius: 4,
        }}
      >
        <Table
          size="small"
          bordered
          loading={loading}
          rowKey="bundleId"
          dataSource={filteredData}
          columns={columns}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
          }}
          scroll={{
            x: "max-content",
          }}
        />
      </div>
    </div>
  );
};

export default BundleKpiReportTable;
