import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";

import "./App.css";
import AdminDashboard from "./components/admin/adminDashboard/AdminDashboard";
import UserDashboard from "./components/user/userDashboard/UserDashboard";
import Home from "./pages/homePage/Home";
import Navbar from "./components/shared/navbar/Navbar";
import BooksAdmin from "./components/admin/booksAdmin/CoursesAdmin";
import CategoriesAdmin from "./components/admin/categoriesAdmin/CategoriesAdmin";
import UsersAdmin from "./components/admin/usersAdmin/UsersAdmin";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import IssuanceAdmin from "./components/admin/issuanceAdmin/IssuanceAdmin";
import { login } from "./redux/authentication/authActions";
import { getUserByToken } from "./service/UserService";
import UserHistory from "./components/admin/userHistory/UserHistory";
import BookHistory from "./components/admin/bookHistory/BookHistory";
import ContactUs from "./components/shared/contactUs/ContactUs";
import AboutUs from "./components/shared/aboutUs/AboutUs";
import Loader from "./components/shared/loader/Loader";
import NotFound from "./pages/notFound/NotFound";
import EnrollmentDashboard from "./components/admin/enrollment/EnrollmentDashboard";
import CourseContentAdmin from "./components/admin/booksAdmin/CourseContentAdmin";
import MyCourses from "./components/user/myCourses/MyCourses";
import CourseContentUser from "./components/user/myCourses/CourseContentUser";
import AllGroup from "./components/admin/Group/AllGroup";
import GroupHistory from "./components/admin/Group/GroupHistory";
import QuizListPage from "./pages/quiz/QuizListPage";
import QuizQuestionEditPage from "./pages/quiz/QuizQuestionEditPage";
import CourseQuizAttempt from "./components/user/myCourses/CourseQuizAttempt";
import UserGroup from "./components/user/myGroups/UserGroup"; import CoursesAdmin from "./components/admin/booksAdmin/CoursesAdmin";
import UserGroupHistory from "./components/user/myGroups/UserGroupHistory";
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("authtoken");
    if (token) {
      getUser(token);
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeOut = setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [location]);

  const getUser = async (token) => {
    try {
      const decoded = jwtDecode(token);
      const { email, roles, exp } = decoded;

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (exp < currentTime) {
        console.warn("Token expired!");
        localStorage.removeItem("authtoken");
        navigate("/");
        return;
      }

      dispatch(login({ email, roles, accessToken: token }));

      window.localStorage.setItem("authtoken", token);
    } catch (error) {
      navigate("/");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoutes>
              {" "}
              <AdminDashboard />{" "}
            </AdminRoutes>
          }
        />
        <Route
          path="/user"
          element={
            <UserRoutes>
              <UserDashboard />
            </UserRoutes>
          }
        />
        <Route
          path="/my-courses"
          element={
            <UserRoutes>
              <MyCourses />
            </UserRoutes>
          }
        />
        <Route
          path="/my-groups"
          element={
            <UserRoutes>
              <UserGroup />
            </UserRoutes>
          }
        />
        <Route
          path="/course-content-user/:courseId"
          element={
            <UserRoutes>
              <CourseContentUser />
            </UserRoutes>
          }
        ></Route>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route
          path="/books"
          element={
            <AdminRoutes>
              <CoursesAdmin />
            </AdminRoutes>
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoutes>
              <UsersAdmin />
            </AdminRoutes>
          }
        />
        <Route
          path="/categories"
          element={
            <AdminRoutes>
              <CategoriesAdmin />
            </AdminRoutes>
          }
        />
        <Route
          path="/issuance"
          element={
            <AdminRoutes>
              <IssuanceAdmin />
            </AdminRoutes>
          }
        />
        <Route
          path="/user-history/:id"
          element={
            <AdminRoutes>
              <UserHistory />
            </AdminRoutes>
          }
        />
        <Route
          path="/book-history/:id"
          element={
            <AdminRoutes>
              <BookHistory />
            </AdminRoutes>
          }
        />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/enroll"
          element={
            <AdminRoutes>
              <EnrollmentDashboard />
            </AdminRoutes>
          }
        />
        <Route
          path="/group"
          element={
            <AdminRoutes>
              <AllGroup />
            </AdminRoutes>
          }
        />

        <Route
          path="/group-history/:id"
          element={
            <AdminRoutes>
              <GroupHistory />
            </AdminRoutes>
          }
        />

        <Route
          path="/group-user-history/:id"
          element={
            <UserRoutes>
              <UserGroupHistory />
            </UserRoutes>
          }
        />
        <Route
          path="/course-content/:courseId"
          element={
            <AdminRoutes>
              <CourseContentAdmin />
            </AdminRoutes>
          }
        ></Route>
        <Route path="/course-content/:courseId/quizzes" element={<QuizListPage />} />
        <Route
          path="/course-content/:courseId/quizzes/edit-question/:questionId"
          element={<QuizQuestionEditPage />}
        />
        <Route path="/quiz/:courseId" element={<CourseQuizAttempt />} />
      </Routes>
    </>
  );
}

export default App;
