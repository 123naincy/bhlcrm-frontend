import {
  useEffect,
  useState,
} from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { importLeads } from "../../api/leadApi";
import { getProjects } from "../../api/projectApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}

export default function ImportLeadModal({
  open,
  onClose,
  onImported,
}: Props) {
  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<any[]>([]);

  const [projects, setProjects] =
    useState<any[]>([]);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleFileChange = async (
    e: any
  ) => {
    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    try {
      const data =
        await selectedFile.arrayBuffer();

      const workbook =
        XLSX.read(data);

      const sheet =
        workbook.Sheets[
          workbook
            .SheetNames[0]
        ];

      const json =
        XLSX.utils.sheet_to_json(
          sheet
        );

      setPreview(
        json.slice(0, 10)
      );
    } catch (error) {
      console.error(error);
      toast.error(
        "File preview failed"
      );
    }
  };

  const handleImport =
    async () => {
      if (!file) {
        toast.error(
          "Please select file"
        );
        return;
      }

      try {
        setLoading(true);

        const result =
          await importLeads(
            file,
            selectedProject
          );

        toast.success(
          `Imported: ${result.importedCount}, Skipped: ${result.skippedCount}`
        );

        setFile(null);
        setPreview([]);
        setSelectedProject("");

        onImported();
        onClose();
      } catch (error) {
        console.error(error);
        toast.error(
          "Import failed"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const loadProjects =
      async () => {
        try {
          const res =
            await getProjects();

          setProjects(
            res.projects || []
          );
        } catch (error) {
          console.error(error);
        }
      };

    if (open) {
      loadProjects();
    }
  }, [open]);

  // IMPORTANT: hooks ke baad
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl">
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Import Leads
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={
              handleFileChange
            }
            className="block"
          />

          <div>
            <label className="block mb-2 font-medium">
              Assign Project
              (if CSV has no
              project)
            </label>

            <select
              value={selectedProject}
              onChange={(e) =>
                setSelectedProject(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3"
            >
              <option value="">
                Select Project
              </option>

              {projects.map(
                (project) => (
                  <option
                    key={
                      project._id
                    }
                    value={
                      project.name
                    }
                  >
                    {project.name}
                  </option>
                )
              )}
            </select>
          </div>

          {preview.length > 0 && (
            <div className="overflow-auto border rounded-2xl max-h-[450px]">
              <table className="min-w-full">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    {Object.keys(
                      preview[0]
                    ).map((key) => (
                      <th
                        key={key}
                        className="px-4 py-3 text-left text-sm"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {preview.map(
                    (
                      row,
                      index
                    ) => (
                      <tr
                        key={index}
                        className="border-t"
                      >
                        {Object.values(
                          row
                        ).map(
                          (
                            value: any,
                            i
                          ) => (
                            <td
                              key={i}
                              className="px-4 py-3 text-sm"
                            >
                              {String(
                                value
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t flex justify-end gap-4 bg-white shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-slate-200"
          >
            Cancel
          </button>

          <button
            onClick={
              handleImport
            }
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white"
          >
            {loading
              ? "Importing..."
              : "Import Leads"}
          </button>
        </div>
      </div>
    </div>
  );
}