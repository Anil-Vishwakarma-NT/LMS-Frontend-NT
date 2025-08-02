import React, { useEffect, useState } from "react";
import { Table, Button, Typography, Input } from "antd";
import * as XLSX from "xlsx";
import { getCourseKpiReport } from "../../../service/ReportingService";
import { useNavigate } from "react-router-dom";
import { Tag, Space, Progress, Tooltip, Row } from "antd";
import { BookOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, ExportOutlined, FolderOpenOutlined, FileAddOutlined, UserOutlined } from "@ant-design/icons";


const { Title } = Typography;

const CourseReportTable = () => {
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
      const res = await getCourseKpiReport(page - 1, pageSize);
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
      item.courseTitle?.toLowerCase().includes(text) ||
      item.courseId?.toString().includes(text) ||
      item.courseLevel?.toLowerCase().includes(text)
    );
  });

  const renderWithNA = (val) =>
    val === null || val === undefined || val === "" ? "NA" : val;

  const columns = [
    {
      title: "Course ID",
      dataIndex: "courseId",
      key: "courseId",
      width: 100,
      sorter: (a, b) => a.courseId - b.courseId,
    },
    {
      title: "Course Name",
      dataIndex: "courseTitle",
      key: "courseTitle",
      width: 200,
      sorter: (a, b) => a.courseTitle.localeCompare(b.courseTitle),
    },
    {
      title: "Course Level",
      dataIndex: "courseLevel",
      key: "courseLevel",
      width: 150,
      filters: [
        { text: "Beginner", value: "BEGINNER" },
        { text: "Intermediate", value: "INTERMEDIATE" },
        { text: "Advanced", value: "ADVANCED" },
      ],
      onFilter: (value, record) =>
        record.courseLevel?.toLowerCase() === value.toLowerCase(),
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
      width: 150,
      sorter: (a, b) =>
        (a.individualAvgCompletionPercentage || 0) -
        (b.individualAvgCompletionPercentage || 0),
      render: renderWithNA,
    },
    {
      title: "Ind. Max %",
      dataIndex: "individualHighestCompletionPercentage",
      key: "individualHighestCompletionPercentage",
      width: 150,
      sorter: (a, b) =>
        (a.individualHighestCompletionPercentage || 0) -
        (b.individualHighestCompletionPercentage || 0),
      render: renderWithNA,
    },
    {
      title: "Ind. Min %",
      dataIndex: "individualLowestCompletionPercentage",
      key: "individualLowestCompletionPercentage",
      width: 150,
      sorter: (a, b) =>
        (a.individualLowestCompletionPercentage || 0) -
        (b.individualLowestCompletionPercentage || 0),
      render: renderWithNA,
    },
    {
      title: "Group Enrollments",
      dataIndex: "groupsEnrolled",
      key: "groupsEnrolled",
      width: 160,
      sorter: (a, b) => a.groupsEnrolled - b.groupsEnrolled,
    },
    {
      title: "Group Avg %",
      dataIndex: "groupAvgCompletionPercentage",
      key: "groupAvgCompletionPercentage",
      width: 150,
      sorter: (a, b) =>
        (a.groupAvgCompletionPercentage || 0) -
        (b.groupAvgCompletionPercentage || 0),
      render: renderWithNA,
    },
    {
      title: "Group Max %",
      dataIndex: "groupHighestCompletionPercentage",
      key: "groupHighestCompletionPercentage",
      width: 150,
      sorter: (a, b) =>
        (a.groupHighestCompletionPercentage || 0) -
        (b.groupHighestCompletionPercentage || 0),
      render: renderWithNA,
    },
    {
      title: "Group Min %",
      dataIndex: "groupLowestCompletionPercentage",
      key: "groupLowestCompletionPercentage",
      width: 150,
      sorter: (a, b) =>
        (a.groupLowestCompletionPercentage || 0) -
        (b.groupLowestCompletionPercentage || 0),
      render: renderWithNA,
    },
    {
      title: "Bundles Part Of",
      dataIndex: "bundlesCourseIsPartOf",
      key: "bundlesCourseIsPartOf",
      width: 200,
      sorter: (a, b) => a.bundlesCourseIsPartOf - b.bundlesCourseIsPartOf,
    },
    {
      title: "Bundle Individual Enrollments",
      dataIndex: "bundleIndividualEnrollments",
      key: "bundleIndividualEnrollments",
      width: 220,
      sorter: (a, b) => a.bundleIndividualEnrollments - b.bundleIndividualEnrollments,
    },
    {
      title: "Bundle Group Enrollments",
      dataIndex: "bundleGroupEnrollments",
      key: "bundleGroupEnrollments",
      width: 220,
      sorter: (a, b) => a.bundleGroupEnrollments - b.bundleGroupEnrollments,
    },

    {
      title: "Total Enrollments",
      dataIndex: "totalEnrollments",
      key: "totalEnrollments",
      width: 160,
      sorter: (a, b) => a.totalEnrollments - b.totalEnrollments,
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      width: 120,
      sorter: (a, b) => a.completed - b.completed,
    },
    {
      title: "In Progress",
      dataIndex: "inProgress",
      key: "inProgress",
      width: 130,
      sorter: (a, b) => a.inProgress - b.inProgress,
    },
    {
      title: "Not Started",
      dataIndex: "notStarted",
      key: "notStarted",
      width: 130,
      sorter: (a, b) => a.notStarted - b.notStarted,
    },
    {
      title: "On Time",
      dataIndex: "onTime",
      key: "onTime",
      width: 120,
      sorter: (a, b) => a.onTime - b.onTime,
    },
    {
      title: "Late",
      dataIndex: "late",
      key: "late",
      width: 120,
      sorter: (a, b) => a.late - b.late,
    },
    {
      title: "On Track",
      dataIndex: "onTrack",
      key: "onTrack",
      width: 120,
      sorter: (a, b) => a.onTrack - b.onTrack,
    },
    {
      title: "Behind Schedule",
      dataIndex: "behindSchedule",
      key: "behindSchedule",
      width: 160,
      sorter: (a, b) => a.behindSchedule - b.behindSchedule,
    },
    {
      title: "Not Yet Started",
      dataIndex: "notYetStarted",
      key: "notYetStarted",
      width: 160,
      sorter: (a, b) => a.notYetStarted - b.notYetStarted,
    },
    {
      title: "Deadline Missed",
      dataIndex: "deadlineMissed",
      key: "deadlineMissed",
      width: 160,
      sorter: (a, b) => a.deadlineMissed - b.deadlineMissed,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Course Report");
    XLSX.writeFile(workbook, "course_kpi_report.xlsx");
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
        <Tooltip title="Back to courses">
          <Button
            icon={<ArrowLeftOutlined style={{ fontSize: 20 }} />}
            onClick={() => navigate(-1)}
          />
        </Tooltip>
        <Title level={5} style={{ margin: 0, fontSize: 20 }}>
          Course Report
        </Title>
        <div style={{ display: "flex", gap: 6 }}>
          <Input.Search
            placeholder="Search by course name, id, or role"
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
          rowKey="courseId"
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

export default CourseReportTable;
