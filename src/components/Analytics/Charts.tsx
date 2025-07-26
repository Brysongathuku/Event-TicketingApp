// components/Analytics/Charts.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface ChartsProps {
  ticketsPerEvent: Array<{
    eventName: string;
    eventID: number;
    ticketsSold: number;
    venue: string;
  }>;
  revenueDistribution: Array<{
    eventName: string;
    revenue: number;
    percentage: number;
  }>;
  bookingsOverTime: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
  paymentStatusBreakdown: Array<{
    status: string;
    count: number;
    amount: number;
  }>;
  topCustomers: Array<{
    customerName: string;
    totalBookings: number;
    totalSpent: number;
  }>;
}

const Charts: React.FC<ChartsProps> = ({
  ticketsPerEvent,
  revenueDistribution,
  bookingsOverTime,
  paymentStatusBreakdown,
  topCustomers,
}) => {
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  return (
    <div className="space-y-8">
      {/* First Row - Tickets and Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart - Tickets Sold per Event */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            🎫 Tickets Sold per Event
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={ticketsPerEvent.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="eventName"
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
                interval={0}
              />
              <YAxis fontSize={12} />
              <Tooltip
                formatter={(value) => [value, "Tickets Sold"]}
                labelFormatter={(label) => `Event: ${label}`}
                contentStyle={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="ticketsSold" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Revenue Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            💰 Revenue Distribution
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={revenueDistribution.slice(0, 6)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ eventName, percentage }) =>
                  `${
                    eventName.length > 15
                      ? eventName.substring(0, 15) + "..."
                      : eventName
                  } (${percentage.toFixed(1)}%)`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
              >
                {revenueDistribution.slice(0, 6).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
                contentStyle={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row - Time Series */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          📈 Bookings & Revenue Over Time (Last 30 Days)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={bookingsOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis yAxisId="left" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" fontSize={12} />
            <Tooltip
              labelFormatter={(value) =>
                `Date: ${new Date(value).toLocaleDateString()}`
              }
              formatter={(value, name) => [
                name === "revenue"
                  ? `$${Number(value).toLocaleString()}`
                  : value,
                name === "revenue" ? "Revenue" : "Bookings",
              ]}
              contentStyle={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="bookings"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Bookings"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stackId="2"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Third Row - Payment Status and Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Status Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            💳 Payment Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentStatusBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="status" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                formatter={(value, name) => [
                  name === "amount"
                    ? `$${Number(value).toLocaleString()}`
                    : value,
                  name === "amount" ? "Amount" : "Count",
                ]}
                contentStyle={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#6366f1" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Customers */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            🏆 Top Customers by Spending
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCustomers.slice(0, 8)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" fontSize={12} />
              <YAxis
                type="category"
                dataKey="customerName"
                fontSize={10}
                width={100}
                tickFormatter={(value) =>
                  value.length > 12 ? value.substring(0, 12) + "..." : value
                }
              />
              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Total Spent",
                ]}
                contentStyle={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="totalSpent" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
