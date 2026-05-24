import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  getProjects,
} from "../../api/projectApi";

import {
  getSourceMappings,
  createSourceMapping,
  deleteSourceMapping,
} from "../../api/sourceApi";

export default function SourceMappingPage() {
  const [projects, setProjects] =
    useState<any[]>([]);

  const [mappings, setMappings] =
    useState<any[]>([]);

  const [
    sourceType,
    setSourceType,
  ] = useState("");

  const [
    identifier,
    setIdentifier,
  ] = useState("");

  const [
    selectedProject,
    setSelectedProject,
  ] = useState<any>(null);

  const loadData =
    async () => {
      try {
        const projectRes =
          await getProjects();

        const mappingRes =
          await getSourceMappings();

        setProjects(
          projectRes.projects
        );

        setMappings(
          mappingRes.mappings
        );
      } catch {
        toast.error(
          "Load failed"
        );
      }
    };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate =
    async () => {
      if (
        !sourceType ||
        !identifier ||
        !selectedProject
      ) {
        toast.error(
          "All fields required"
        );
        return;
      }

      try {
        await createSourceMapping(
          {
            sourceType,
            identifier,
            projectId:
              selectedProject._id,
            projectName:
              selectedProject.name,
          }
        );

        toast.success(
          "Mapping created"
        );

        setSourceType("");
        setIdentifier("");
        setSelectedProject(
          null
        );

        loadData();
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
        await deleteSourceMapping(
          id
        );

        toast.success(
          "Deleted"
        );

        loadData();
      } catch {
        toast.error(
          "Delete failed"
        );
      }
    };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">
        Source Mapping
      </h1>

      {/* CREATE FORM */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <select
          value={sourceType}
          onChange={(e) =>
            setSourceType(
              e.target.value
            )
          }
          className="w-full border rounded-xl p-3"
        >
          <option value="">
            Select Source Type
          </option>

          <option value="meta_form">
            Meta Form
          </option>

          <option value="website">
            Website
          </option>

          <option value="landing_page">
            Landing Page
          </option>

          <option value="google_campaign">
            Google Campaign
          </option>

          <option value="api">
            API
          </option>

          <option value="magicbricks">
            Magicbricks
          </option>

          <option value="99acres">
            99acres
          </option>

          <option value="housing">
            Housing
          </option>
        </select>

        <input
          value={identifier}
          onChange={(e) =>
            setIdentifier(
              e.target.value
            )
          }
          placeholder="Identifier (form id / domain / slug)"
          className="w-full border rounded-xl p-3"
        />

        <select
          value={
            selectedProject?._id ||
            ""
          }
          onChange={(e) => {
            const project =
              projects.find(
                (p) =>
                  p._id ===
                  e.target.value
              );

            setSelectedProject(
              project
            );
          }}
          className="w-full border rounded-xl p-3"
        >
          <option value="">
            Select Project
          </option>

          {projects.map(
            (project) => (
              <option
                key={project._id}
                value={
                  project._id
                }
              >
                {project.name}
              </option>
            )
          )}
        </select>

        <button
          onClick={
            handleCreate
          }
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Create Mapping
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">
                Source Type
              </th>

              <th className="p-4 text-left">
                Identifier
              </th>

              <th className="p-4 text-left">
                Project
              </th>

              <th className="p-4 text-left">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {mappings.map(
              (
                mapping
              ) => (
                <tr
                  key={
                    mapping._id
                  }
                  className="border-t"
                >
                  <td className="p-4">
                    {
                      mapping.sourceType
                    }
                  </td>

                  <td className="p-4">
                    {
                      mapping.identifier
                    }
                  </td>

                  <td className="p-4">
                    {
                      mapping.projectName
                    }
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        handleDelete(
                          mapping._id
                        )
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}