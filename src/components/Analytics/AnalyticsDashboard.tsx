// components/Analytics/AnalyticsDashboard.tsx
import React, { useState } from "react";
import { useGetAnalyticsQuery } from "../../features/analytics/analyticsAPI";
import KPICards from "./KPICards";
import Charts from "./Charts";
import { FaSync, FaDownload, FaCalendarAlt } from "react-icons/fa";

const AnalyticsDashboard: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, error, refetch } = useGetAnalyticsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 300000, // Refresh every 5 minutes
  });

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    refetch();
  };

  const handleExport = () => {
    if (data?.data) {
      // Convert data to CSV or JSON and download
      const exportData = {
        kpis: data.data.kpis,
        exportDate: new Date().toISOString(),
        ticketsPerEvent: data.data.ticketsPerEvent,
        revenueDistribution: data.data.revenueDistribution,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-report-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-lg text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <div className="text-red-500 text-xl mr-3">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">
                Error Loading Analytics
              </h3>
              <p className="text-red-600 text-sm mt-1">
                Failed to load analytics data. Please try refreshing the page.
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Analytics Data Available
          </h3>
          <p className="text-gray-500">
            Analytics data will appear here once you have events and bookings.
          </p>
        </div>
      </div>
    );
  }

  const {
    kpis,
    ticketsPerEvent,
    revenueDistribution,
    bookingsOverTime,
    paymentStatusBreakdown,
    topCustomers,
  } = data.data;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              📊 Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time insights into your event management system
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <FaSync className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <FaDownload />
              Export
            </button>
          </div>
        </div>

        {/* Last Updated Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Auto-refresh: Every 5 minutes</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards kpis={kpis} />

        {/* Charts */}
        <Charts
          ticketsPerEvent={ticketsPerEvent}
          revenueDistribution={revenueDistribution}
          bookingsOverTime={bookingsOverTime}
          paymentStatusBreakdown={paymentStatusBreakdown}
          topCustomers={topCustomers}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
