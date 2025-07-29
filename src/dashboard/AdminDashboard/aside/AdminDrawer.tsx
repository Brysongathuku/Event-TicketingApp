import { Link } from "react-router";
import { adminDrawerData } from "./drawerData";

const AdminDrawer = () => {
  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
      }}
    >
      {/* Header - Sticky below navbar */}
      <div className="flex-shrink-0 sticky top-16 z-30">
        <h2
          className="text-2xl font-bold text-white p-5 border-b border-slate-600 shadow-lg"
          style={{
            background: "linear-gradient(90deg, #1e40af 0%, #1e293b 100%)",
          }}
        >
          Dashboard Menu
        </h2>
      </div>

      {/* Navigation - Scrollable content */}
      <nav
        className="flex-1 overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #334155 0%, #1e293b 100%)",
        }}
      >
        <ul className="pt-2">
          {adminDrawerData.map((item) => (
            <li key={item.id}>
              <Link
                to={item.link}
                className="flex items-center gap-4 px-5 py-4 text-slate-300 hover:text-white transition-all duration-300 border-b border-slate-700/50 hover:border-l-4 hover:border-blue-400 hover:shadow-lg"
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background =
                    "linear-gradient(90deg, #2563eb 0%, #475569 100%)";
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

export default AdminDrawer;
