// components/Analytics/KPICards.tsx
import {
  FaCalendarAlt,
  FaTicketAlt,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";

interface KPICardsProps {
  kpis: {
    totalEvents: number;
    totalBookings: number;
    totalRevenue: number;
    totalCustomers: number;
  };
}

const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const kpiData = [
    {
      title: "Active Events",
      value: kpis.totalEvents.toLocaleString(),
      icon: FaCalendarAlt,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Bookings",
      value: kpis.totalBookings.toLocaleString(),
      icon: FaTicketAlt,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Revenue",
      value: `$${kpis.totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}`,
      icon: FaDollarSign,
      color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Customers",
      value: kpis.totalCustomers.toLocaleString(),
      icon: FaUsers,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiData.map((kpi, index) => {
        const IconComponent = kpi.icon;
        return (
          <div
            key={index}
            className={`${kpi.bgColor} rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {kpi.title}
                </p>
                <p className={`text-2xl font-bold ${kpi.textColor}`}>
                  {kpi.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center text-white shadow-lg`}
              >
                <IconComponent size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;
