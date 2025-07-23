import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { MdEvent } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FaUserCheck } from "react-icons/fa6";
import { MdSupportAgent } from "react-icons/md";

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
    icon: MdEvent,
    link: "events",
  },
  {
    id: "venues",
    name: "Venue",
    icon: FaBuilding,
    link: "Venues",
  },
  {
    id: "bookings",
    name: "Bookings",
    icon: FaCalendarCheck,
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
    id: "SupportTickets",
    name: "SupportTickets",
    icon: MdSupportAgent,
    link: "SupportTickets",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: TbBrandGoogleAnalytics,
    link: "analytics",
  },
];
