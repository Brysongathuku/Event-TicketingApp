import { Link } from "react-router";
import { adminDrawerData } from "./drawerData";

const AdminDrawer = () => {
  return (
    <div className="h-screen w-full bg-gray-200 shadow-xl">
      <h2 className="text-2xl font-bold text-blue-800 p-5 border-b border-gray-600 shadow-sm">
        Dashboard Menu
      </h2>
      <ul className="pt-2">
        {adminDrawerData.map((item) => (
          <li key={item.id}>
            <Link
              to={item.link}
              className="flex items-center gap-4 px-5 py-4 text-gray-900 hover:bg-gray-600 hover:border-l-4 hover:border-blue-400 transition-all duration-200"
            >
              <item.icon size={24} />
              <span className="text-base font-medium">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDrawer;
