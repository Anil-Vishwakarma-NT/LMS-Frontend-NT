import React, { useEffect, useState } from "react";
import { Table, Button, Typography, Input, Tag } from "antd";
import * as XLSX from "xlsx";
import { getUserKpiReport } from "../../../service/ReportingService";
import { useNavigate } from "react-router-dom";
import { Tooltip, Row } from "antd";
import { BookOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, ExportOutlined, FolderOpenOutlined, FileAddOutlined, UserOutlined } from "@ant-design/icons";


const { Title } = Typography;


const UserKpiReportTable = () => {
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
      const res = await getUserKpiReport(page - 1, pageSize);
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
      item.fullName?.toLowerCase().includes(text) ||
      item.email?.toLowerCase().includes(text) ||
      item.role?.toLowerCase().includes(text)
    );
  });

  const renderWithNA = (val) =>
    val === null || val === undefined || val === "" ? "NA" : val;

  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 100,
      sorter: (a, b) => a.userId - b.userId,
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      width: 160,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
      filters: [
        { text: "Admin", value: "ADMIN" },
        { text: "Manager", value: "MANAGER" },
        { text: "User", value: "USER" },
      ],
      onFilter: (value, record) =>
        record.role?.toLowerCase() === value.toLowerCase(),
      render: renderWithNA,
    },
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
      width: 150,
    },
    {
      title: "Individual Enrollments",
      dataIndex: "individualEnrollments",
      key: "individualEnrollments",
      width: 180,
      sorter: (a, b) => a.individualEnrollments - b.individualEnrollments,
    },
    {
      title: "Ind. Avg %",
      dataIndex: "individualAvgCompletionPercentage",
      key: "individualAvgCompletionPercentage",
      width: 140,
      sorter: (a, b) =>
        a.individualAvgCompletionPercentage -
        b.individualAvgCompletionPercentage,
      render: renderWithNA,
    },
    {
      title: "Ind. Max %",
      dataIndex: "individualHighestCompletionPercentage",
      key: "individualHighestCompletionPercentage",
      width: 140,
      sorter: (a, b) =>
        a.individualHighestCompletionPercentage -
        b.individualHighestCompletionPercentage,
      render: renderWithNA,
    },
    {
      title: "Ind. Min %",
      dataIndex: "individualLowestCompletionPercentage",
      key: "individualLowestCompletionPercentage",
      width: 140,
      sorter: (a, b) =>
        a.individualLowestCompletionPercentage -
        b.individualLowestCompletionPercentage,
      render: renderWithNA,
    },
    {
      title: "Bundles Enrolled",
      dataIndex: "bundlesEnrolled",
      key: "bundlesEnrolled",
      width: 150,
      sorter: (a, b) => a.bundlesEnrolled - b.bundlesEnrolled,
    },
    {
      title: "Bundle Avg %",
      dataIndex: "bundleAvgCompletionPercentage",
      key: "bundleAvgCompletionPercentage",
      width: 140,
      sorter: (a, b) =>
        a.bundleAvgCompletionPercentage - b.bundleAvgCompletionPercentage,
      render: renderWithNA,
    },
    {
      title: "Bundle Max %",
      dataIndex: "bundleHighestCompletionPercentage",
      key: "bundleHighestCompletionPercentage",
      width: 140,
      sorter: (a, b) =>
        a.bundleHighestCompletionPercentage -
        b.bundleHighestCompletionPercentage,
      render: renderWithNA,
    },
    {
      title: "Bundle Min %",
      dataIndex: "bundleLowestCompletionPercentage",
      key: "bundleLowestCompletionPercentage",
      width: 140,
      sorter: (a, b) =>
        a.bundleLowestCompletionPercentage -
        b.bundleLowestCompletionPercentage,
      render: renderWithNA,
    },
    {
      title: "Groups Part Of",
      dataIndex: "groupsPartOf",
      key: "groupsPartOf",
      width: 140,
      sorter: (a, b) => a.groupsPartOf - b.groupsPartOf,
    },
    {
      title: "Group Course Enrollments",
      dataIndex: "groupCourseEnrollments",
      key: "groupCourseEnrollments",
      width: 200,
      sorter: (a, b) => a.groupCourseEnrollments - b.groupCourseEnrollments,
    },
    {
      title: "Group Bundle Enrollments",
      dataIndex: "groupBundleEnrollments",
      key: "groupBundleEnrollments",
      width: 200,
      sorter: (a, b) => a.groupBundleEnrollments - b.groupBundleEnrollments,
    },
    {
      title: "Total Enrollments",
      dataIndex: "totalEnrollments",
      key: "totalEnrollments",
      width: 150,
      sorter: (a, b) => a.totalEnrollments - b.totalEnrollments,
    },
    {
      title: "Courses Completed",
      dataIndex: "coursesCompleted",
      key: "coursesCompleted",
      width: 150,
      sorter: (a, b) => a.coursesCompleted - b.coursesCompleted,
    },
    {
      title: "Courses In Progress",
      dataIndex: "coursesInProgress",
      key: "coursesInProgress",
      width: 120,
      sorter: (a, b) => a.coursesInProgress - b.coursesInProgress,
    },
    {
      title: "Courses Not Started",
      dataIndex: "coursesNotStarted",
      key: "coursesNotStarted",
      width: 120,
      sorter: (a, b) => a.coursesNotStarted - b.coursesNotStarted,
    },
    {
      title: "Courses Completed On Time",
      dataIndex: "coursesCompletedOnTime",
      key: "coursesCompletedOnTime",
      width: 100,
      sorter: (a, b) => a.coursesCompletedOnTime - b.coursesCompletedOnTime,
    },
    {
      title: "Courses Completed Late",
      dataIndex: "courseCompletedLate",
      key: "courseCompletedLate",
      width: 100,
      sorter: (a, b) => a.courseCompletedLate - b.courseCompletedLate,
    },
    {
      title: "Courses On Track",
      dataIndex: "coursesOnTrack",
      key: "coursesOnTrack",
      width: 100,
      sorter: (a, b) => a.coursesOnTrack - b.coursesOnTrack,
    },
    {
      title: "Courses Behind Schedule",
      dataIndex: "coursesNotOnTrack",
      key: "coursesNotOnTrack",
      width: 140,
      sorter: (a, b) => a.coursesNotOnTrack - b.coursesNotOnTrack,
    },
    {
      title: "Courses Not Due Yet",
      dataIndex: "coursesYetToStart",
      key: "coursesYetToStart",
      width: 120,
      sorter: (a, b) => a.coursesYetToStart - b.coursesYetToStart,
    },
    {
      title: "Missed Deadline",
      dataIndex: "deadlineMissedCourses",
      key: "deadlineMissedCourses",
      width: 140,
      sorter: (a, b) => a.deadlineMissedCourses - b.deadlineMissedCourses,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Report");
    XLSX.writeFile(workbook, "user_kpi_report.xlsx");
  };

  return (
    <div
      style={{
        padding: 32,
        backgroundColor: "#fff",
        borderRadius: 8,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 30,
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Tooltip title="Back to users">
          <Button
            icon={<ArrowLeftOutlined style={{ fontSize: 20 }} />}
            onClick={() => navigate(-1)}
          />
        </Tooltip>
        <Title level={5} style={{ margin: 0, fontSize: 20 }}>
          User Report
        </Title>
        <div style={{ display: "flex", gap: 6 }}>
          <Input.Search
            placeholder="Search by name, email or role"
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            style={{ width: 250 }}
            size="middle"
          />
          <Button type="primary" onClick={handleExport} size="middle">
            Export
          </Button>
        </div>
      </div>

      {/* Scrollable Table */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          border: "1px solid #f0f0f0",
          borderRadius: 4,
        }}
      >
        <Table
          size="small"
          bordered
          loading={loading}
          rowKey="userId"
          dataSource={filteredData}
          columns={columns}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
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

export default UserKpiReportTable;
