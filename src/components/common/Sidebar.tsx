import {
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FolderKanban,
  Link2,
  Package,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { hasRole } from "../../utils/auth";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

function Sidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const canViewAnalytics = hasRole([
    "super_admin",
    "admin",
    "sales_manager",
    "support_agent",
  ]);

  const canManageTeam = hasRole([
    "super_admin",
    "admin",
  ]);
  const canManageProjects =
  hasRole([
    "super_admin",
    "admin",
  ]);
  const canManageSourceMappings =
  hasRole([
    "super_admin",
    "admin",
  ]);
const canManageLeads = hasRole([
  "super_admin",
  "admin",
  "sales_manager",
]);

const canViewMyLeads = hasRole([
  "sales_executive",
  "telecaller",
]);
const menuItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/dashboard",
  },

  ...(canManageLeads
    ? [
        {
          name: "All Leads",
          icon: <Users size={18} />,
          path: "/leads/all",
        },
        {
          name: "Assigned Leads",
          icon: <ShieldCheck size={18} />,
          path: "/leads/assigned",
        },
        {
          name: "Kanban",
          icon: <LayoutDashboard size={18} />,
          path: "/leads/kanban",
        },
      ]
    : []),
...(canManageProjects
  ? [
      {
        name: "Projects",
        icon: (
          <FolderKanban size={18} />
        ),
        path: "/projects",
      },
    ]
  : []),
  ...(canManageProjects
  ? [
      {
        name: "Inventory",
        icon: <Package size={18} />,
        path: "/inventory",
      },
    ]
  : []),
  ...(canManageSourceMappings
  ? [
      {
        name: "Source Mapping",
        icon: <Link2 size={18} />,
        path: "/source-mappings",
      },
    ]
  : []),
  ...(canViewMyLeads
    ? [
        {
          name: "My Leads",
          icon: <Users size={18} />,
          path: "/leads/my",
        },
        {
          name: "Kanban",
          icon: <LayoutDashboard size={18} />,
          path: "/leads/kanban",
        },
      ]
    : []),

  ...(canViewAnalytics
    ? [
        {
          name: "Analytics",
          icon: <BarChart3 size={18} />,
          path: "/analytics",
        },
      ]
    : []),

  ...(canManageTeam
    ? [
        {
          name: "Team",
          icon: <ShieldCheck size={18} />,
          path: "/team",
        },
      ]
    : []),
];
  return (
    <aside
      className={`bg-slate-950 text-white flex flex-col h-screen shadow-lg transition-all duration-300 shrink-0 ${
        collapsed ? "w-[4.5rem]" : "w-52"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b border-slate-800 flex items-center ${
          collapsed
            ? "justify-center p-3"
            : "justify-between px-4 py-3"
        }`}
      >
        <div
          className={`flex items-center overflow-hidden ${
            collapsed ? "" : "gap-4"
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Building2 size={18} />
          </div>

          {!collapsed && (
            <div>
              <h1 className="font-semibold text-sm whitespace-nowrap">
                Real Estate CRM
              </h1>
              <p className="text-slate-400 text-xs">
                Management
              </p>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="bg-slate-800 p-2 rounded-xl hover:bg-slate-700"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Collapse Button */}
      {collapsed && (
        <div className="flex justify-center py-4 border-b border-slate-800">
          <button
            onClick={() => setCollapsed(false)}
            className="bg-slate-800 p-2 rounded-xl hover:bg-slate-700"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Menu */}
      <div className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const active =
            location.pathname.startsWith(item.path);

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center rounded-lg transition text-sm ${
                collapsed
                  ? "justify-center p-2.5"
                  : "gap-3 px-3 py-2"
              } ${
                active
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
            >
              {item.icon}

              {!collapsed && (
                <span className="font-medium">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center rounded-lg hover:bg-red-600 transition text-sm ${
            collapsed
              ? "justify-center p-2.5"
              : "gap-3 px-3 py-2"
          }`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;