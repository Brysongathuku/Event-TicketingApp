import { createBrowserRouter, RouterProvider } from "react-router";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyUser from "./pages/VerifyUser";
import { Toaster } from "sonner";
import UserEvents from "./dashboard/UserDashboard/Events/Events";
import AdminDashboard from "./dashboard/AdminDashboard/AdminDashboard";
import FetchUsers from "./dashboard/AdminDashboard/manageUsers/FetchUsers";
import FetchAllBookings from "./dashboard/AdminDashboard/Bookings/Abookings";
import SupportTicketAdmin from "./dashboard/AdminDashboard/supportTickets/SupportTicket";
import Profile from "./dashboard/AdminDashboard/Profile/Profile";
import UserDashboard from "./dashboard/UserDashboard/UserDashboard";

// import CreateBooking from "./dashboard/UserDashboard/Bookings/CreateBooking";
import UserBooking from "./dashboard/UserDashboard/Bookings/UserBooking";
import Venues from "./dashboard/AdminDashboard/Venue/Venue";
import AdminEvents from "./dashboard/Events/Events";
import AnalyticsDashboard from "./components/Analytics/AnalyticsDashboard";
// import EventModal from "./dashboard/Events/MakeEvent";
// import UserEvents from "./dashboard/UserDashboard/Events/Events";

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
      path: "/events",
      element: <UserEvents />,
    },
    {
      path: "admin/dashboard",
      element: <AdminDashboard />, //  add  check role
      children: [
        {
          path: "events",
          element: <AdminEvents />,
        },
        {
          path: "venues",
          element: <Venues />,
        },
        {
          path: "booking",
          element: <FetchAllBookings />,
        },
        {
          path: "users",
          element: <FetchUsers />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "SupportTickets",
          element: <SupportTicketAdmin />,
        },
        {
          path: "Analytics",
          element: <AnalyticsDashboard />,
        },
      ],
    },

    {
      path: "user/dashboard",
      element: <UserDashboard />,
      children: [
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "booking",
          element: <UserBooking />,
        },
        {
          path: "book",
          element: "book  for new event",
        },

        {
          path: "events",
          element: <UserEvents />,
        },
        {
          path: "payments",
          element: "my  payments",
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
