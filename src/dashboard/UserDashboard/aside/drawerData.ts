import { MdEventNote, MdOutlinePayment } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

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
    icon: MdEventNote, // 🗓️ Better for events
    link: "events",
  },

  {
    id: "bookings",
    name: " My Bookings",
    icon: FaCalendarAlt, // 📅 Represents calendar/booking well
    link: "booking",
  },

  {
    id: "profile",
    name: "Profile",
    icon: CgProfile, // 👤 More clean for profile
    link: "profile",
  },

  {
    id: "My payments",
    name: "Payments",
    icon: MdOutlinePayment, // 💳 Payment-related icon
    link: "payments",
  },
];
