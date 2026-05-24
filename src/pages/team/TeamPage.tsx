import { useEffect, useState } from "react";
import {
  Search,
  Pencil,
  UserPlus,
  Power,
  Users,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getUsers,
  toggleUserStatus,
  deleteUser,
} from "../../api/userApi";

import CreateUserModal from "../../components/team/CreateUserModal";
import EditUserModal from "../../components/team/EditUserModal";

export default function TeamPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      `${user.fullName} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await getUsers();

      setUsers(res.users || []);
      setFilteredUsers(res.users || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleUserStatus(id);

      toast.success("User status updated");

      loadUsers();
    } catch (error) {
      console.error(error);
      toast.error("Status update failed");
    }
  };

  const handleDeleteUser = async (id: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmed) return;

  try {
    await deleteUser(id);

    toast.success("User deleted successfully");

    loadUsers();
  } catch (error) {
    console.error(error);
    toast.error("Delete failed");
  }
};
  return (
    <>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 rounded-xl p-10 text-white shadow-2xl">
          <div className="flex justify-between items-center flex-wrap gap-6">
            <div>
              <h1 className="text-5xl font-bold">
                Team Management
              </h1>

              <p className="text-slate-300 text-lg mt-3">
                Manage admins, managers and executives
              </p>
            </div>

            <button
              onClick={() => setCreateOpen(true)}
              className="bg-white text-slate-900 px-6 py-4 rounded-2xl font-semibold flex items-center gap-3 hover:scale-105 transition"
            >
              <UserPlus size={22} />
              Create User
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="relative">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search team members..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-100 border border-slate-200 outline-none"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <Users className="text-indigo-600" />
            <h2 className="text-2xl font-bold">
              Team Members
            </h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500 text-lg">
              Loading team...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-6 py-5">Name</th>
                    <th className="text-left px-6 py-5">Email</th>
                    <th className="text-left px-6 py-5">Phone</th>
                    <th className="text-left px-6 py-5">Role</th>
                    <th className="text-left px-6 py-5">City</th>
                    <th className="text-left px-6 py-5">Status</th>
                    <th className="text-left px-6 py-5">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 font-semibold">
                        {user.fullName}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-5">
                        {user.phone}
                      </td>

                      <td className="px-6 py-5">
                        <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold capitalize">
                          {user.role.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {user.city}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex gap-3">
  <button
    onClick={() => {
      setSelectedUser(user);
      setEditOpen(true);
    }}
    className="p-3 rounded-xl bg-yellow-100 text-yellow-700 hover:scale-110 transition"
  >
    <Pencil size={18} />
  </button>

  <button
    onClick={() =>
      handleToggleStatus(user._id)
    }
    className="p-3 rounded-xl bg-blue-100 text-blue-700 hover:scale-110 transition"
  >
    <Power size={18} />
  </button>

  <button
    onClick={() =>
      handleDeleteUser(user._id)
    }
    className="p-3 rounded-xl bg-red-100 text-red-700 hover:scale-110 transition"
  >
    <Trash2 size={18} />
  </button>
</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <CreateUserModal
  open={createOpen}
  onClose={() => setCreateOpen(false)}
  onSuccess={loadUsers}
/>

<EditUserModal
  open={editOpen}
  onClose={() => setEditOpen(false)}
  onSuccess={loadUsers}
  user={selectedUser}
/>
</>
  );
}