import { Table, Empty, Tooltip, Button } from "antd";
import { userdeadlines } from "../../../service/UserService";
import { useEffect, useState } from "react";
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const DeadlineTable = () => {
    const [courseList, setCourseList] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(() => (window.innerHeight >= 1024 ? 11 : 10));
    const [totalPages, setTotalPages] = useState(0);


    const navigate = useNavigate();
    useEffect(() => {
        console.log("courseList ", courseList)
        getData();
    }, [])

    const getData = async () => {
        const response = await userdeadlines();
        console.log("Courses List fetched", response.data)
        alert("deadlines fetched")
        setCourseList(response.data);
    }

    const columns = [
        {
            title: 'Course Name',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            render: (date) => new Date(date).toLocaleDateString('en-GB')
        },
        {
            title: 'View',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <>

                    <Tooltip title="View content">
                        <Button
                            icon={<EyeOutlined />}
                            style={{ marginRight: 8 }}
                            onClick={() =>
                                navigate(`/course-content-user/${record.courseId}`)
                            } />
                    </Tooltip>
                </>
            )
        },

    ]



    return (
        < div >
            <div className="user-deadlines-table">
                {courseList.length > 0 ? (
                    <Table
                        dataSource={courseList}
                        columns={columns}
                        pagination={{
                            current: pageNumber + 1,
                            pageSize,
                            total: totalPages * pageSize,
                            onChange: (page) => setPageNumber(page - 1),
                            showSizeChanger: false,
                        }}
                        scroll={{ x: '100%', y: '100%' }}
                        locale={{ emptyText: 'No courses found for this user.' }}
                        rowKey={(record) => record.courseId}
                    />
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </div>

        </div >
    );
};
export default DeadlineTable;