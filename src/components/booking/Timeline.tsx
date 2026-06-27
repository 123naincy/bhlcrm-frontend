import {
  Calendar,
  CreditCard,
  FileText,
  UserPlus,
  Ban,
  RotateCcw,
  CheckCircle,
} from "lucide-react";

interface TimelineItem {
  _id: string;

  title: string;

  description: string;

  action: string;

  createdBy?: {
    name: string;
  };

  createdAt: string;
}

interface Props {
  timeline?: TimelineItem[];
}

export default function Timeline({
  timeline = [],
}: Props) {

  const getIcon = (action: string) => {

    switch (action) {

      case "booking_created":
        return <UserPlus className="text-green-600" />;

      case "payment_received":
        return <CreditCard className="text-blue-600" />;

      case "document_uploaded":
        return <FileText className="text-purple-600" />;

      case "booking_cancelled":
        return <Ban className="text-red-600" />;

      case "booking_restored":
        return <RotateCcw className="text-orange-600" />;

      default:
        return <CheckCircle className="text-gray-600" />;

    }

  };

  return (

    <div className="bg-white rounded-xl shadow">

      {/* Header */}

      <div className="border-b p-5">

        <h2 className="text-xl font-bold">

          Timeline

        </h2>

      </div>

      {/* Timeline */}

      <div className="p-6">

        {timeline.length === 0 && (

          <div className="text-center py-8 text-gray-500">

            No Timeline Found

          </div>

        )}

        <div className="space-y-6">

          {timeline.map((item) => (

            <div
              key={item._id}
              className="flex gap-4"
            >

              {/* Icon */}

              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">

                {getIcon(item.action)}

              </div>

              {/* Content */}

              <div className="flex-1">

                <div className="font-semibold">

                  {item.title}

                </div>

                <div className="text-gray-600 mt-1">

                  {item.description}

                </div>

                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">

                  <Calendar size={15} />

                  {new Date(
                    item.createdAt
                  ).toLocaleString()}

                  {item.createdBy && (
                    <>
                      •

                      {item.createdBy.name}
                    </>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}