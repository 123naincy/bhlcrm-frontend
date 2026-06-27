import {
  Eye,
  Download,
  Trash2,
  Printer,
  BadgeIndianRupee,
} from "lucide-react";

import type { Payment } from "../../types/booking";
import { getFileUrl } from "../../utils/fileUrl";

interface Props {
  payments: Payment[];

  booking: any;

  refresh: () => void;

  onReceivePayment?: () => void;
  onViewPayment?: (
    payment: Payment
  ) => void;
  onPrintPayment?: (
    payment: Payment
  ) => void;
  onDeletePayment?: (
    payment: Payment
  ) => void;
}

export default function PaymentHistory({
  payments,
  onReceivePayment,
  onViewPayment,
  onPrintPayment,
  onDeletePayment,
}: Props) {
  const statusColor = {
    received:
      "bg-green-100 text-green-700",

    pending:
      "bg-yellow-100 text-yellow-700",

    failed:
      "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl shadow">

      {/* Header */}

      <div className="border-b p-5 flex justify-between items-center">

        <div>

          <h2 className="text-xl font-bold">

            Payment History

          </h2>

          <p className="text-gray-500 text-sm">

            All customer payments

          </p>

        </div>

        <button
          onClick={onReceivePayment}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Receive Payment
        </button>

      </div>

      {/* Table */}

      <div className="overflow-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 border">

                #

              </th>

              <th className="p-3 border">

                Date

              </th>

              <th className="p-3 border">

                Amount

              </th>

              <th className="p-3 border">

                Mode

              </th>

              <th className="p-3 border">

                Transaction

              </th>

              <th className="p-3 border">

                Status

              </th>

              <th className="p-3 border">

                Actions

              </th>

            </tr>

          </thead>

          <tbody>

            {payments.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  className="text-center p-8 text-gray-500"
                >

                  No Payments Found

                </td>

              </tr>

            )}

            {payments.map(
              (
                payment,
                index
              ) => (

                <tr
                  key={payment._id}
                  className="hover:bg-gray-50"
                >

                  <td className="border p-3 text-center">

                    {payment.installmentNo ??
                      index + 1}

                  </td>

                  <td className="border p-3">

                    {new Date(
                      payment.paymentDate
                    ).toLocaleDateString()}

                  </td>

                  <td className="border p-3 font-semibold">

                    ₹
                    {payment.amount.toLocaleString()}

                  </td>

                  <td className="border p-3 capitalize">

                    {payment.paymentMode}

                  </td>

                  <td className="border p-3">

                    {payment.transactionNo}

                  </td>

                  <td className="border p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusColor[
                          payment.status
                        ]
                      }`}
                    >

                      {payment.status}

                    </span>

                  </td>

                  <td className="border p-3">

                    <div className="flex gap-2">

                      <ActionButton
                        title="View"
                        icon={<Eye size={16} />}
                        onClick={() =>
                          onViewPayment?.(
                            payment
                          )
                        }
                      />

                      <ActionButton
                        title="Print"
                        icon={
                          <Printer size={16} />
                        }
                        onClick={() =>
                          onPrintPayment?.(
                            payment
                          )
                        }
                      />

                      {payment.receiptUrl && (
                        <ActionButton
                          title="Receipt"
                          icon={
                            <Download
                              size={16}
                            />
                          }
                          onClick={() =>
                            window.open(
                              getFileUrl(
                                payment.receiptUrl
                              ),
                              "_blank"
                            )
                          }
                        />
                      )}

                      <ActionButton
                        title="Delete"
                        danger
                        icon={
                          <Trash2 size={16} />
                        }
                        onClick={() =>
                          onDeletePayment?.(
                            payment
                          )
                        }
                      />

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="border-t p-5 flex justify-end">

        <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">

          <BadgeIndianRupee className="text-blue-600" />

          <div>

            <div className="text-sm text-gray-500">

              Total Received

            </div>

            <div className="font-bold text-lg">

              ₹
              {payments
                .reduce(
                  (sum, payment) =>
                    sum + payment.amount,
                  0
                )
                .toLocaleString()}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

interface ActionButtonProps {
  title: string;

  icon: React.ReactNode;

  danger?: boolean;

  onClick?: () => void;
}

function ActionButton({
  title,
  icon,
  danger,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-2 rounded-lg border transition ${
        danger
          ? "hover:bg-red-50 text-red-600"
          : "hover:bg-blue-50"
      }`}
    >
      {icon}
    </button>
  );
}