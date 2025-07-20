import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaTasks } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FaUserCheck } from "react-icons/fa6";

export type DrawerData = {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  link: string;
};

export const adminDrawerData: DrawerData[] = [
  {
    id: "events",
    name: "Events",
    icon: FaTasks,
    link: "events",
  },
  {
    id: "venues",
    name: "Venue",
    icon: FaTasks,
    link: "Venues",
  },
  {
    id: "bookings",
    name: "Bookings",
    icon: FaTasks,
    link: "booking",
  },
  {
    id: "users",
    name: "Users",
    icon: FiUsers,
    link: "users",
  },
  {
    id: "profile",
    name: "Profile",
    icon: FaUserCheck,
    link: "profile",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: TbBrandGoogleAnalytics,
    link: "analytics",
  },
];
