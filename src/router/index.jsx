import { createBrowserRouter } from "react-router-dom";
import HomePage from "../Pages/HomePage.jsx";
import SignInPage from "../Pages/auth/SignInPages.jsx";
import SignUpPage from "../Pages/auth/SignUpPages.jsx";
import NotFoundPage from "../Pages/404Page.jsx";
import AuthProtectedRoute from "./AuthProtectedRoute.jsx";
import Providers from "../Providers.jsx";
import DashboardRouter from "../components/DashboardRouter.jsx";
import RoleSelector from "../components/RoleSelector.jsx";
import CoachDashboard from "../Pages/CoachDashboard.jsx";
import AthleteDashboard from "../Pages/AthleteDashboard.jsx";
import CoachOnboarding from "../Pages/CoachOnboarding.jsx";
import AthleteOnboarding from "../Pages/AthleteOnboarding.jsx";
import EditProfile from "../Pages/EditProfile.jsx";
import AboutPage from "../Pages/AboutPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Providers />,
    children: [
      // Public routes — anyone can visit these
      {
        path: "/",
        element: <HomePage />,
      },
      {
            path: "/about",
            element: <AboutPage />,
          },
      {
        path: "/auth/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/auth/sign-up",
        element: <SignUpPage />,
      },
      // Protected routes — only logged in users get through
      {
        path: "/",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardRouter />,  // checks role, redirects
          },
          {
            path: "/role-select",
            element: <RoleSelector />,  // new user picks coach or athlete
          },
          {
            path: "/coach-dashboard",
            element: <CoachDashboard />,  // coach lands here
          },
          {
            path: "/athlete-dashboard",
            element: <AthleteDashboard />,  // athlete lands here
          },
          {
            path: "/coach-onboarding",
            element: <CoachOnboarding/>, // after choosing coach lands here
          },
          {
            path: "/athlete-onboarding",
            element: <AthleteOnboarding/>, // after choosing athlete lands here
          },
          {
            path: "/edit-profile", element: <EditProfile />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;