import { Bell, Search } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm">
      {/* Search */}
      <div className="relative w-full max-w-md hidden md:block">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search leads..."
          className="w-full bg-slate-100 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative">
          <Bell size={22} className="text-slate-600" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {user?.fullName?.charAt(0)}
          </div>

          <div className="hidden md:block">
            <h3 className="font-semibold text-slate-900">
              {user?.fullName}
            </h3>
            <p className="text-sm text-slate-500 capitalize">
              {user?.role?.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;