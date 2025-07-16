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
import BookHistory from "./components/admin/bookHistory/BookHistory";
import EnrollmentDashboard from "./components/admin/enrollment/EnrollmentDashboard";
import AllGroup from "./components/admin/Group/AllGroup";
import GroupHistory from "./components/admin/Group/GroupHistory";
import CourseContentAdmin from "./components/admin/booksAdmin/CourseContentAdmin";
import QuizListPage from "./pages/quiz/QuizListPage";
import QuizQuestionEditPage from "./pages/quiz/QuizQuestionEditPage";
import CourseQuizAttempt from "./components/user/myCourses/CourseQuizAttempt";
import ContactUs from "./components/shared/contactUs/ContactUs";
import AboutUs from "./components/shared/aboutUs/AboutUs";

import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";

import "./App.css";

const router = createBrowserRouter([
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
        element: <AdminRoutes><AdminDashboard /></AdminRoutes>
      },
      {
        path: "books",
        element: <AdminRoutes><CoursesAdmin /></AdminRoutes>
      },
      {
        path: "users",
        element: <AdminRoutes><UsersAdmin /></AdminRoutes>
      },
      {
        path: "categories",
        element: <AdminRoutes><CategoriesAdmin /></AdminRoutes>
      },
      {
        path: "issuance",
        element: <AdminRoutes><IssuanceAdmin /></AdminRoutes>
      },
      {
        path: "user-history/:id",
        element: <AdminRoutes><UserHistory /></AdminRoutes>
      },
      {
        path: "book-history/:id",
        element: <AdminRoutes><BookHistory /></AdminRoutes>
      },
      {
        path: "enroll",
        element: <AdminRoutes><EnrollmentDashboard /></AdminRoutes>
      },
      {
        path: "group",
        element: <AdminRoutes><AllGroup /></AdminRoutes>
      },
      {
        path: "group-history/:id",
        element: <AdminRoutes><GroupHistory /></AdminRoutes>
      },
      {
        path: "course-content/:courseId",
        element: <AdminRoutes><CourseContentAdmin /></AdminRoutes>
      },

      // Quiz routes
      { path: "course-content/:courseId/quizzes", element: <QuizListPage /> },
      { path: "course-content/:courseId/quizzes/edit-question/:questionId", element: <QuizQuestionEditPage /> },

      // User routes
      {
        path: "user",
        element: <UserRoutes><UserDashboard /></UserRoutes>
      },
      {
        path: "my-courses",
        element: <UserRoutes><MyCourses /></UserRoutes>
      },
      {
        path: "course-content-user/:courseId",
        element: <UserRoutes><CourseContentUser /></UserRoutes>
      },

      // Quiz Attempt (no guard)
      { path: "quiz/:courseId", element: <CourseQuizAttempt /> },

      // 404 fallback
      { path: "*", element: <NotFound /> }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
