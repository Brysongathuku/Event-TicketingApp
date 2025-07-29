import { Link } from "react-router";
import { adminDrawerData } from "./drawerData";

const UserDrawer = () => {
  return (
    <div
      className="flex flex-col h-full -z-10"
      style={{
        background: "linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%)",
      }}
    >
      {/* Header - Sticky below navbar */}
      <div className="flex-shrink-0 sticky top-16 z-30">
        <h2
          className="text-2xl font-bold text-blue-800 p-5 border-b border-gray-600 shadow-lg"
          style={{
            background: "linear-gradient(90deg, #1e40af 0%, #e5e7eb 100%)",
          }}
        >
          Dashboard Menu
        </h2>
      </div>

      {/* Navigation - Scrollable content */}
      <nav
        className="flex-1 overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%)",
        }}
      >
        <ul className="pt-2">
          {adminDrawerData.map((item) => (
            <li key={item.id}>
              <Link
                to={item.link}
                className="flex items-center gap-4 px-5 py-4 text-gray-900 hover:text-blue-900 transition-all duration-300 border-b border-gray-400/50 hover:border-l-4 hover:border-blue-400 hover:shadow-lg"
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background =
                    "linear-gradient(90deg, #3b82f6 0%, #9ca3af 100%)";
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = "transparent";
                }}
              >
                <item.icon size={24} />
                <span className="text-base font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default UserDrawer;
