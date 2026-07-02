import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  getProjects,
  createProject,
  deleteProject,
} from "../../api/projectApi";

export default function ProjectsPage() {
  const [projects, setProjects] =
    useState<any[]>([]);

  const [name, setName] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [
    propertyType,
    setPropertyType,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const loadProjects =
    async () => {
      try {
        const res =
          await getProjects();

        setProjects(
          res?.projects || []
        );
      } catch {
        toast.error(
          "Failed to load projects"
        );
      }
    };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate =
    async () => {
      if (!name) {
        toast.error(
          "Project name required"
        );
        return;
      }

      try {
        await createProject({
          name,
          location,
          propertyType,
          description,
        });

        toast.success(
          "Project created"
        );

        setName("");
        setLocation("");
        setPropertyType("");
        setDescription("");

        loadProjects();
      } catch {
        toast.error(
          "Create failed"
        );
      }
    };

  const handleDelete =
    async (
      id: string
    ) => {
      try {
        await deleteProject(
          id
        );

        toast.success(
          "Deleted"
        );

        loadProjects();
      } catch {
        toast.error(
          "Delete failed"
        );
      }
    };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">
        Projects
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <input
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          placeholder="Project Name"
          className="w-full border rounded-xl p-3"
        />

        <input
          value={location}
          onChange={(e) =>
            setLocation(
              e.target.value
            )
          }
          placeholder="Location"
          className="w-full border rounded-xl p-3"
        />

        <input
          value={propertyType}
          onChange={(e) =>
            setPropertyType(
              e.target.value
            )
          }
          placeholder="Property Type"
          className="w-full border rounded-xl p-3"
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          placeholder="Description"
          className="w-full border rounded-xl p-3"
        />

        <button
          onClick={
            handleCreate
          }
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Create Project
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">
                Name
              </th>
              <th className="p-4 text-left">
                Location
              </th>
              <th className="p-4 text-left">
                Type
              </th>
              <th className="p-4 text-left">
                Status
              </th>
              <th className="p-4 text-left">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-slate-500"
                >
                  No projects yet. Create one above.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr
                  key={project._id}
                  className="border-t"
                >
                  <td className="p-4">
                    {project.name}
                  </td>

                  <td className="p-4">
                    {project.location}
                  </td>

                  <td className="p-4">
                    {project.propertyType}
                  </td>

                  <td className="p-4">
                    {project.status}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        handleDelete(
                          project._id
                        )
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}