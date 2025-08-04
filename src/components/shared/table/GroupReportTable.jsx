import React, { useEffect, useState } from "react";
import { Table, Button, Typography, Input } from "antd";
import * as XLSX from "xlsx";
import { getGroupKpiReport } from "../../../service/ReportingService";
import { useNavigate } from "react-router-dom";
import { Tooltip, Row } from "antd";
import { BookOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, ExportOutlined, FolderOpenOutlined, FileAddOutlined, UserOutlined } from "@ant-design/icons";



const { Title } = Typography;

const GroupKpiReportTable = () => {
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
      const res = await getGroupKpiReport(page - 1, pageSize);
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
      item.groupName?.toLowerCase().includes(text) ||
      item.groupId?.toString().includes(text)

    );
  });

  const renderWithNA = (val) =>
    val === null || val === undefined || val === "" ? "NA" : val;

  const columns = [
    {
      title: "Group ID",
      dataIndex: "groupId",
      key: "groupId",
      width: 100,
      sorter: (a, b) => a.groupId - b.groupId,
    },
    {
      title: "Group Name",
      dataIndex: "groupName",
      key: "groupName",
      sorter: (a, b) => a.groupName.localeCompare(b.groupName),
      width: 200,
    },
    {
      title: "Individual Courses Enrolled",
      dataIndex: "individualCoursesEnrolled",
      key: "individualCoursesEnrolled",
      width: 200,
      sorter: (a, b) => a.individualCoursesEnrolled - b.individualCoursesEnrolled,
    },
    {
      title: "Individual Avg %",
      dataIndex: "individualCoursesAvgCompletionPercentage",
      key: "individualCoursesAvgCompletionPercentage",
      width: 180,
      sorter: (a, b) => a.individualCoursesAvgCompletionPercentage - b.individualCoursesAvgCompletionPercentage,
      render: renderWithNA,
    },
    {
      title: "Individual Highest %",
      dataIndex: "individualCoursesHighestCompletionPercentage",
      key: "individualCoursesHighestCompletionPercentage",
      width: 180,
      sorter: (a, b) => a.individualCoursesHighestCompletionPercentage - b.individualCoursesHighestCompletionPercentage,
      render: renderWithNA,
    },
    {
      title: "Individual Lowest %",
      dataIndex: "individualCoursesLowestCompletionPercentage",
      key: "individualCoursesLowestCompletionPercentage",
      width: 180,
      sorter: (a, b) => a.individualCoursesLowestCompletionPercentage - b.individualCoursesLowestCompletionPercentage,
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
      width: 160,
      sorter: (a, b) => a.bundleAvgCompletionPercentage - b.bundleAvgCompletionPercentage,
      render: renderWithNA,
    },
    {
      title: "Bundle Highest %",
      dataIndex: "bundleHighestCompletionPercentage",
      key: "bundleHighestCompletionPercentage",
      width: 180,
      sorter: (a, b) => a.bundleHighestCompletionPercentage - b.bundleHighestCompletionPercentage,
      render: renderWithNA,
    },
    {
      title: "Bundle Lowest %",
      dataIndex: "bundleLowestCompletionPercentage",
      key: "bundleLowestCompletionPercentage",
      width: 180,
      sorter: (a, b) => a.bundleLowestCompletionPercentage - b.bundleLowestCompletionPercentage,
      render: renderWithNA,
    },
    {
      title: "Total Courses Enrolled",
      dataIndex: "totalCoursesEnrolled",
      key: "totalCoursesEnrolled",
      width: 200,
      sorter: (a, b) => a.totalCoursesEnrolled - b.totalCoursesEnrolled,
    },
    {
      title: "Total Users",
      dataIndex: "totalUsersInGroup",
      key: "totalUsersInGroup",
      width: 140,
      sorter: (a, b) => a.totalUsersInGroup - b.totalUsersInGroup,
    },
    {
      title: "Total Enrollments",
      dataIndex: "totalEnrollments",
      key: "totalEnrollments",
      width: 180,
      sorter: (a, b) => a.totalEnrollments - b.totalEnrollments,
    },
    {
      title: "Courses Completed",
      dataIndex: "coursesCompleted",
      key: "coursesCompleted",
      width: 180,
      sorter: (a, b) => a.coursesCompleted - b.coursesCompleted,
    },
    {
      title: "Courses In Progress",
      dataIndex: "coursesInProgress",
      key: "coursesInProgress",
      width: 180,
      sorter: (a, b) => a.coursesInProgress - b.coursesInProgress,
    },
    {
      title: "Courses Not Started",
      dataIndex: "coursesNotStarted",
      key: "coursesNotStarted",
      width: 180,
      sorter: (a, b) => a.coursesNotStarted - b.coursesNotStarted,
    },
    {
      title: "Completed On Time",
      dataIndex: "coursesCompletedOnTime",
      key: "coursesCompletedOnTime",
      width: 180,
      sorter: (a, b) => a.coursesCompletedOnTime - b.coursesCompletedOnTime,
    },
    {
      title: "Completed Late",
      dataIndex: "courseCompletedLate",
      key: "courseCompletedLate",
      width: 160,
      sorter: (a, b) => a.courseCompletedLate - b.courseCompletedLate,
    },
    {
      title: "On Track",
      dataIndex: "coursesOnTrack",
      key: "coursesOnTrack",
      width: 140,
      sorter: (a, b) => a.coursesOnTrack - b.coursesOnTrack,
    },
    {
      title: "Not On Track",
      dataIndex: "coursesNotOnTrack",
      key: "coursesNotOnTrack",
      width: 160,
      sorter: (a, b) => a.coursesNotOnTrack - b.coursesNotOnTrack,
    },
    {
      title: "Yet To Start",
      dataIndex: "coursesYetToStart",
      key: "coursesYetToStart",
      width: 160,
      sorter: (a, b) => a.coursesYetToStart - b.coursesYetToStart,
    },
    {
      title: "Missed Deadline",
      dataIndex: "deadlineMissedCourses",
      key: "deadlineMissedCourses",
      width: 180,
      sorter: (a, b) => a.deadlineMissedCourses - b.deadlineMissedCourses,
    },
  ];




  const sanitizeData = (data) =>
    JSON.parse(
      JSON.stringify(data, (_, val) =>
        val === null || val === undefined ? "null" : val
      )
    );

  const handleExport = () => {
    const cleanData = sanitizeData(data);
    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Group Report");
    XLSX.writeFile(workbook, "group_kpi_report.xlsx");
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
        <Tooltip title="Back to groups">
          <Button
            icon={<ArrowLeftOutlined style={{ fontSize: 20 }} />}
            onClick={() => navigate(-1)}
          />
        </Tooltip>
        <Title level={5} style={{ margin: 0, fontSize: 20 }}>
          Group Report
        </Title>
        <div style={{ display: "flex", gap: 6 }}>
          <Input.Search
            placeholder="Search by group or manager"
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
          rowKey="groupName"
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

export default GroupKpiReportTable;
