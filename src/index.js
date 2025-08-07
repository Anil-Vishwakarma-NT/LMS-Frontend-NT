import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import store from "./redux/store";
import App from "./App";
import Home from "./pages/homePage/Home";
import NotFound from "./pages/notFound/NotFound";
import AdminDashboard from "./components/admin/adminDashboard/AdminDashboard";
import UserDashboard from "./components/user/userDashboard/UserDashboard";
import MyCourses from "./components/user/myCourses/MyCourses";
import CourseContentUser from "./components/user/myCourses/CourseContentUser";
import CoursesAdmin from "./components/admin/booksAdmin/CoursesAdmin";
import UsersAdmin from "./components/admin/usersAdmin/UsersAdmin";
import CategoriesAdmin from "./components/admin/categoriesAdmin/CategoriesAdmin";
import IssuanceAdmin from "./components/admin/issuanceAdmin/IssuanceAdmin";
import UserHistory from "./components/admin/userHistory/UserHistory";
import BookHistory from "./components/admin/categoriesAdmin/CategoriesAdmin";
import EnrollmentDashboard from "./components/admin/enrollment/EnrollmentDashboard";
import AllGroup from "./components/admin/Group/AllGroup";
import GroupHistory from "./components/admin/Group/GroupHistory";
import CourseContentAdmin from "./components/admin/booksAdmin/CourseContentAdmin";
import QuizListPage from "./pages/quiz/QuizListPage";
import QuizQuestionEditPage from "./pages/quiz/QuizQuestionEditPage";
import CourseQuizAttempt from "./components/user/myCourses/CourseQuizAttempt";
import ContactUs from "./components/shared/contactUs/ContactUs";
import AboutUs from "./components/shared/aboutUs/AboutUs";
import Login from "./pages/login/Login";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import BundlesHistory from "./components/admin/bundles/BundlesHistory";
import BundlesAdmin from "./components/admin/bundles/BundlesAdmin";
import UserReportPage from "./components/admin/ReportPages/UsersReport";
import SingleUserReport from "./components/admin/ReportPages/SingleUserReport";
import CourseReportPage from "./components/admin/ReportPages/CoursesReport";
import SingleCourseReport from "./components/admin/ReportPages/SingleCourseReport";
import GroupReportPage from "./components/admin/ReportPages/GroupsReport";
import SingleGroupReport from "./components/admin/ReportPages/SingleGroupReport";
import BundleReportPage from "./components/admin/ReportPages/BundlesReport";
import SingleBundleReport from "./components/admin/ReportPages/SingleBundleReport"

import "./App.css";
const router = createBrowserRouter([
  {
    path: "/login", // :large_green_circle: Login route explicitly defined
    element: <Login />,
  },
  {
    path: "/",
    element: <App />, // Layout with Navbar + Outlet
    children: [
      { index: true, element: <Home /> },
      { path: "contact", element: <ContactUs /> },
      { path: "about", element: <AboutUs /> },
      // Admin routes
      {
        path: "admin",
        element: (
          <AdminRoutes>
            <AdminDashboard />
          </AdminRoutes>
        ),
      },
      {
        path: "books",
        element: (
          <AdminRoutes>
            <CoursesAdmin />
          </AdminRoutes>
        ),
      },
      {
        path: "users",
        element: (
          <AdminRoutes>
            <UsersAdmin />
          </AdminRoutes>
        ),
      },
      {
        path: "categories",
        element: (
          <AdminRoutes>
            <CategoriesAdmin />
          </AdminRoutes>
        ),
      },
      {
        path: "issuance",
        element: (
          <AdminRoutes>
            <IssuanceAdmin />
          </AdminRoutes>
        ),
      },
      {
        path: "user-history/:id",
        element: (
          <AdminRoutes>
            <UserHistory />
          </AdminRoutes>
        ),
      },
      {
        path: "book-history/:id",
        element: (
          <AdminRoutes>
            <BookHistory />
          </AdminRoutes>
        ),
      },
      {
        path: "enroll",
        element: (
          <AdminRoutes>
            <EnrollmentDashboard />
          </AdminRoutes>
        ),
      },
      {
        path: "group",
        element: (
          <AdminRoutes>
            <AllGroup />
          </AdminRoutes>
        ),
      },
      {
        path: "bundles",
        element: (
          <AdminRoutes>
            <BundlesAdmin />
          </AdminRoutes>
        ),
      },
      {
        path: "group-history/:id",
        element: (
          <AdminRoutes>
            <GroupHistory />
          </AdminRoutes>
        ),
      },
      {
        path: "bundles-history/:id",
        element: (
          <AdminRoutes>
            <BundlesHistory />
          </AdminRoutes>
        ),
      },
      {
        path: "course-content/:courseId",
        element: (
          <AdminRoutes>
            <CourseContentAdmin />
          </AdminRoutes>
        ),
      },
      // Quiz routes
      { path: "course-content/:courseId/quizzes", element: <QuizListPage /> },
      {
        path: "course-content/:courseId/quizzes/edit-question/:questionId",
        element: <QuizQuestionEditPage />,
      },
      // User routes
      {
        path: "user",
        element: (
          <UserRoutes>
            <UserDashboard />
          </UserRoutes>
        ),
      },
      {
        path: "my-courses",
        element: (
          <UserRoutes>
            <MyCourses />
          </UserRoutes>
        ),
      },
      {
        path: "course-content-user/:courseId",
        element: (
          <UserRoutes>
            <CourseContentUser />
          </UserRoutes>
        ),
      },
      // Quiz Attempt (no guard)
      { path: "quiz/:courseId", element: <CourseQuizAttempt /> },
      // 404 fallback
      { path: "*", element: <NotFound /> },
      {
        path: "/user-report",
        element: (
          <AdminRoutes>
            {" "}
            <UserReportPage />
          </AdminRoutes>
        ),
      },
      {
        path: "/user-report/:userId",
        element: (
          <AdminRoutes>
            {" "}
            <SingleUserReport />
          </AdminRoutes>
        ),
      },
      {
        path: "/course-report",
        element: (
          <AdminRoutes>
            {" "}
            <CourseReportPage />
          </AdminRoutes>
        ),
      },
      {
        path: "/course-report/:courseId",
        element: (
          <AdminRoutes>
            {" "}
            <SingleCourseReport />
          </AdminRoutes>
        ),
      },
      {
        path: "/group-report",
        element: (
          <AdminRoutes>
            {" "}
            <GroupReportPage />
          </AdminRoutes>
        ),
      },
      {
        path: "/group-report/:groupId",
        element: (
          <AdminRoutes>
            {" "}
            <SingleGroupReport />
          </AdminRoutes>
        ),
      },
      {
        path: "/bundle-report",
        element: (
          <AdminRoutes>
            {" "}
            <BundleReportPage />
          </AdminRoutes>
        ),
      },
      {
        path: "/bundle-report/:bundleId",
        element: (
          <AdminRoutes>
            {" "}
            <SingleBundleReport />
          </AdminRoutes>
        ),
      },
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);