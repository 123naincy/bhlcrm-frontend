import { useRef } from "react";
import {
  Upload,
  Eye,
  Download,
  Trash2,
  FileText,
} from "lucide-react";

import {
  deleteBookingDocument,
  uploadBookingDocument,
} from "../../api/bookingApi";
import { getFileUrl } from "../../utils/fileUrl";

interface BookingDocument {
  _id: string;
  name: string;
  type: string;
  fileUrl: string;
  uploadedAt: string;
}

interface Props {
  booking: {
    _id: string;
    documents?: BookingDocument[];
  };
  refresh: () => void;
}

export default function Documents({
  booking,
  refresh,
}: Props) {
  const fileInput =
    useRef<HTMLInputElement>(null);

  const documents: BookingDocument[] =
    booking.documents || [];

  const upload = () => {
    fileInput.current?.click();
  };

  const uploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const formData =
        new FormData();

      formData.append("file", file);
      formData.append(
        "documentType",
        "other"
      );
      formData.append(
        "title",
        file.name
      );

      await uploadBookingDocument(
        booking._id,
        formData
      );

      refresh();
    } catch (err: any) {
      window.alert(
        err?.response?.data
          ?.message ||
          "Failed to upload document"
      );
    } finally {
      if (fileInput.current) {
        fileInput.current.value = "";
      }
    }
  };

  const removeDocument = async (
    documentId: string
  ) => {
    const confirmed =
      window.confirm(
        "Delete this document?"
      );

    if (!confirmed) return;

    try {
      await deleteBookingDocument(
        booking._id,
        documentId
      );

      refresh();
    } catch (err: any) {
      window.alert(
        err?.response?.data
          ?.message ||
          "Failed to delete document"
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="border-b p-5 flex justify-between">
        <h2 className="text-xl font-bold">
          Documents
        </h2>

        <button
          onClick={upload}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center"
        >
          <Upload size={18} />
          Upload
        </button>

        <input
          hidden
          ref={fileInput}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={uploadFile}
        />
      </div>

      <div className="p-5 space-y-4">
        {documents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No Documents Uploaded
          </div>
        )}

        {documents.map((doc) => (
          <div
            key={doc._id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <FileText className="text-blue-600" />
              </div>

              <div>
                <div className="font-semibold">
                  {doc.name}
                </div>

                <div className="text-sm text-gray-500">
                  {doc.type}
                </div>

                <div className="text-xs text-gray-400">
                  {new Date(
                    doc.uploadedAt
                  ).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  window.open(
                    getFileUrl(
                      doc.fileUrl
                    ),
                    "_blank"
                  )
                }
                className="border rounded-lg p-2 hover:bg-gray-100"
                title="View"
              >
                <Eye size={18} />
              </button>

              <button
                onClick={() =>
                  window.open(
                    getFileUrl(
                      doc.fileUrl
                    ),
                    "_blank"
                  )
                }
                className="border rounded-lg p-2 hover:bg-gray-100"
                title="Download"
              >
                <Download size={18} />
              </button>

              <button
                onClick={() =>
                  removeDocument(
                    doc._id
                  )
                }
                className="border rounded-lg p-2 hover:bg-red-50 text-red-600"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
