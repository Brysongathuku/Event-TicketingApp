import { createBrowserRouter, RouterProvider } from "react-router";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyUser from "./pages/VerifyUser";
import { Toaster } from "sonner";
import Events from "./dashboard/Events/Events";
import AdminDashboard from "./dashboard/AdminDashboard/AdminDashboard";
import FetchUsers from "./dashboard/AdminDashboard/manageUsers/FetchUsers";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },

    {
      path: "home",
      element: <LandingPage />,
    },
    {
      path: "/about",
      element: <AboutPage />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/verify",
      element: <VerifyUser />,
    },
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "admin/dashboard",
      element: <AdminDashboard />, //  add  check role
      children: [
        {
          path: "events",
          element: <Events />,
        },
        {
          path: "venues",
          element: "welcome  to  venues",
        },
        {
          path: "bookings",
          element: "welcome  to    bookings",
        },
        {
          path: "users",
          element: <FetchUsers />,
        },
        {
          path: "profile",
          element: "welcome  to    profiles",
        },
        {
          path: "Analytics",
          element: "welcome  to  analytics",
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            error: "bg-red-500 text-white",
            success: "bg-green-500 text-white",
            info: "bg-blue-500 text-white",
          },
        }}
      />
    </>
  );
};

export default App;
