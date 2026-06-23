import { NavLink } from "react-router-dom";
import useSocket from "../hooks/useSocket";

const NAV_ITEMS = [
  { path: "/", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", label: "Home" },
  { path: "/calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Calendar" },
  { path: "/meals", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", label: "Meals" },
  { path: "/recipes", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "Recipes" },
  { path: "/grocery", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", label: "Grocery" },
  { path: "/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", label: "Settings" },
];

const Sidebar = () => {
  const { isConnected } = useSocket();

  return (
    <aside className="w-20 bg-white border-r border-gray-100 flex flex-col items-center py-6 gap-2 shadow-sm shrink-0 h-full">
      {/* Logo */}
      <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center mb-4 shadow-sm">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
      </div>

      {/* Nav items */}
      {NAV_ITEMS.map(({ path, icon, label }) => (
        <NavLink
          key={label}
          to={path}
          className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}
          title={label}
          aria-label={label}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
          </svg>
          <span className="hidden">{label}</span>
        </NavLink>
      ))}

      {/* Connection indicator */}
      <div className="mt-auto">
        <div
          className={`w-2.5 h-2.5 rounded-full mx-auto ${
            isConnected ? "bg-brand-500 badge-live" : "bg-gray-300"
          }`}
          title={isConnected ? "Live — connected" : "Disconnected"}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
