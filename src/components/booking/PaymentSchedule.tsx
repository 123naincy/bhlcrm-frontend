import {
  Calendar,
  BadgeIndianRupee,
  CreditCard,
} from "lucide-react";

interface Installment {
  _id?: string;

  installmentNo: number;

  title: string;

  dueDate?: string;

  percentage: number;

  amount: number;

  paidAmount?: number;

  status:
    | "paid"
    | "partial"
    | "pending"
    | "overdue";
}

interface Props {
  booking: any;
  onReceivePayment?: (
    installment: Installment
  ) => void;
}

export default function PaymentSchedule({
  booking,
  onReceivePayment,
}: Props) {

  const schedules: Installment[] =
    booking.paymentPlan?.schedules || [];

  const statusColor = {
    paid: "bg-green-100 text-green-700",

    partial:
      "bg-yellow-100 text-yellow-700",

    pending:
      "bg-gray-100 text-gray-700",

    overdue:
      "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl shadow">

      {/* Header */}

      <div className="border-b p-5 flex justify-between">

        <div>

          <h2 className="text-xl font-bold">

            Payment Schedule

          </h2>

          <p className="text-sm text-gray-500">

            Installment Tracking

          </p>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="border p-3">
                #
              </th>

              <th className="border p-3">
                Stage
              </th>

              <th className="border p-3">
                Due Date
              </th>

              <th className="border p-3">
                %
              </th>

              <th className="border p-3">
                Amount
              </th>

              <th className="border p-3">
                Paid
              </th>

              <th className="border p-3">
                Balance
              </th>

              <th className="border p-3">
                Status
              </th>

              <th className="border p-3">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {schedules.length === 0 && (

              <tr>

                <td
                  colSpan={9}
                  className="text-center p-8 text-gray-500"
                >

                  No Payment Schedule Found

                </td>

              </tr>

            )}

            {schedules.map((item) => {

              const paid =
                item.paidAmount || 0;

              const balance =
                item.amount - paid;

              return (

                <tr
                  key={item.installmentNo}
                  className="hover:bg-gray-50"
                >

                  <td className="border p-3 text-center">

                    {item.installmentNo}

                  </td>

                  <td className="border p-3">

                    {item.title}

                  </td>

                  <td className="border p-3">

                    {item.dueDate
                      ? new Date(
                          item.dueDate
                        ).toLocaleDateString()
                      : "-"}

                  </td>

                  <td className="border p-3 text-center">

                    {item.percentage}%

                  </td>

                  <td className="border p-3 font-semibold">

                    ₹
                    {item.amount.toLocaleString()}

                  </td>

                  <td className="border p-3 text-green-600 font-semibold">

                    ₹
                    {paid.toLocaleString()}

                  </td>

                  <td className="border p-3 text-red-600 font-semibold">

                    ₹
                    {balance.toLocaleString()}

                  </td>

                  <td className="border p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusColor[item.status]
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>

                  </td>

                  <td className="border p-3">

                    {item.status !== "paid" && (

                      <button
                        onClick={() =>
                          onReceivePayment?.(
                            item
                          )
                        }
                        className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
                      >

                        <CreditCard
                          size={16}
                        />

                        Receive

                      </button>

                    )}

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="border-t p-5 grid grid-cols-3 gap-5">

        <SummaryCard
          title="Total Installments"
          value={schedules.length.toString()}
          icon={<Calendar />}
        />

        <SummaryCard
          title="Total Amount"
          value={`₹ ${schedules
            .reduce(
              (sum, item) =>
                sum + item.amount,
              0
            )
            .toLocaleString()}`}
          icon={<BadgeIndianRupee />}
        />

        <SummaryCard
          title="Paid"
          value={`₹ ${schedules
            .reduce(
              (sum, item) =>
                sum +
                (item.paidAmount || 0),
              0
            )
            .toLocaleString()}`}
          icon={<CreditCard />}
        />

      </div>

    </div>
  );
}

interface SummaryCardProps {

  title: string;

  value: string;

  icon: React.ReactNode;

}

function SummaryCard({
  title,
  value,
  icon,
}: SummaryCardProps) {

  return (

    <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">

      {icon}

      <div>

        <div className="text-sm text-gray-500">

          {title}

        </div>

        <div className="font-bold text-lg">

          {value}

        </div>

      </div>

    </div>

  );

}