import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Table from '../../shared/table/Table'
import AdminHOC from '../../shared/HOC/AdminHOC'
import { userHistory } from '../../../service/IssuanceService'
import Paginate from '../../shared/pagination/Paginate'
import DashCard from "../../shared/dashCard/DashCard";
import book from "../../../assets/bookshelf.png";
import users from "../../../assets/group.png";
import inHouse from "../../../assets/reading.png";
import category from "../../../assets/category.png";
import './UserHistory.css'
const UserHistory = ({ setLoading }) => {

  const { id } = useParams();

  const [userHistoryData, setUserHistoryData] = useState([])
  const [pageNumber, setPageNumber] = useState(0);

  let height = window.innerHeight;

  const pageSizeByHeight = () => {

    if (height >= 1024) {
      return 11
    } else if (height <= 1024) {
      return 10
    }
  }
  const [pageSize, setPageSize] = useState(pageSizeByHeight());
  const handleResize = () => {
    height = window.innerHeight;
    const newSize = pageSizeByHeight();
    setPageSize(newSize);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [height]);

  const [totalPages, setTotalPages] = useState(0);


  const fields = [
    {
      index: 1,
      key: "Sr. No.",
      title: "Sr. No."
    },
    {
      index: 3,
      key: "Course name",
      title: "Course name"
    },
    {
      index: 4,
      key: "Group name",
      title: "Group name"
    },
    {
      index: 5,
      key: "Progress",
      title: "Progress"
    },
    {
      index: 6,
      key: "Expected Completion Date",
      title: "Expected completion Date"
    },
    {
      index: 7,
      key: "Status",
      title: "Status"
    },
  ]

  const userdata = [
    {
      1: 1,
      3: "React Basics",
      4: "Frontend Devs",
      5: "80%",
      6: "2025-05-10",
      7: "In Progress",
    },
    {
      1: 2,
      3: "Advanced JavaScript",
      4: "Backend Team",
      5: "95%",
      6: "2025-04-30",
      7: "Almost Done",
    },
    {
      1: 3,
      3: "UI/UX Design",
      4: "Designers",
      5: "60%",
      6: "2025-06-01",
      7: "In Progress",
    },
  ];

  const loadUserHistory = async () => {
    try {
      setLoading(true)
      const data = await userHistory(id);
      setUserHistoryData(data?.content);
      setTotalPages(data?.totalPages)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserHistory();
  }, [pageNumber, pageSize]);


  const data = [
    { id: 1, title: "Total Enrollments", number: 10, logo: users },
    { id: 2, title: "Total Groups", number: 6, logo: book },
    { id: 3, title: "Total Completed Courses", number: 6, logo: category },
    { id: 4, title: "Incomplete Courses", number: 3, logo: inHouse },
    { id: 5, title: "Defaulters", number: 1, logo: inHouse }
  ];

  return (
    <div className="admin-section">
      <h2 className="admin-page-header" style={{ marginTop: '10px' }}>Employee Details</h2>
      <div className="admin-page-mid">
      </div>
      <div className="main-content">

        {data?.map((data) => (
          <DashCard key={data.id} data={data} />
        ))}

      </div>
      <div className='user-history-table'>
        {userdata && userdata.length > 0 ?
          <Table fields={fields} entries={userdata} type={'user-history'} pageNumber={pageNumber} pageSize={pageSize} /> :
          <div className='no-data-found'>No data found</div>}
        <div className="paginate">
          {userHistoryData && userHistoryData.length > 0 ?
            <Paginate
              currentPage={pageNumber}
              totalPages={totalPages}
              onPageChange={setPageNumber}
            /> : <div></div>}
        </div>
      </div>
    </div>
  )
}

export default AdminHOC(UserHistory)