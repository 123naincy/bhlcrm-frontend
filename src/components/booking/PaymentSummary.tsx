import {
  BadgeIndianRupee,
  TrendingUp,
  Wallet,
  Calendar,
  AlertTriangle,
} from "lucide-react";

import type { Booking } from "../../types/booking";

interface Props {
  booking: Booking;
}

export default function PaymentSummary({
  booking,
}: Props) {
  const collectionPercentage =
    booking.totalSaleValue > 0
      ? (
          (booking.receivedAmount /
            booking.totalSaleValue) *
          100
        ).toFixed(2)
      : "0";

  const nextInstallment =
    (booking as any).nextInstallment;

  const overdue =
    (booking as any).overdueAmount || 0;

  return (
    <div className="bg-white rounded-xl shadow">

      {/* Header */}

      <div className="border-b p-5">

        <h2 className="text-xl font-bold">
          Payment Summary
        </h2>

      </div>

      {/* Cards */}

      <div className="p-5 grid gap-4">

        <SummaryCard
          icon={<BadgeIndianRupee />}
          title="Sale Value"
          value={`₹ ${booking.totalSaleValue.toLocaleString()}`}
          bg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <SummaryCard
          icon={<Wallet />}
          title="Received"
          value={`₹ ${booking.receivedAmount.toLocaleString()}`}
          bg="bg-green-50"
          iconColor="text-green-600"
        />

        <SummaryCard
          icon={<AlertTriangle />}
          title="Pending"
          value={`₹ ${booking.pendingAmount.toLocaleString()}`}
          bg="bg-red-50"
          iconColor="text-red-600"
        />

        <SummaryCard
          icon={<TrendingUp />}
          title="Collection %"
          value={`${collectionPercentage}%`}
          bg="bg-yellow-50"
          iconColor="text-yellow-600"
        />

        <SummaryCard
          icon={<BadgeIndianRupee />}
          title="Overdue"
          value={`₹ ${overdue.toLocaleString()}`}
          bg="bg-orange-50"
          iconColor="text-orange-600"
        />

        <SummaryCard
          icon={<Calendar />}
          title="Next Installment"
          value={
            nextInstallment
              ? new Date(
                  nextInstallment
                ).toLocaleDateString()
              : "-"
          }
          bg="bg-indigo-50"
          iconColor="text-indigo-600"
        />

      </div>

      {/* Progress */}

      <div className="px-5 pb-5">

        <div className="flex justify-between mb-2">

          <span className="text-sm">

            Collection Progress

          </span>

          <span className="font-semibold">

            {collectionPercentage}%

          </span>

        </div>

        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

          <div
            className="h-full bg-green-600"
            style={{
              width: `${collectionPercentage}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
  iconColor: string;
}

function SummaryCard({
  title,
  value,
  icon,
  bg,
  iconColor,
}: CardProps) {
  return (
    <div
      className={`${bg} rounded-xl p-4 flex justify-between items-center`}
    >
      <div>

        <div className="text-sm text-gray-500">

          {title}

        </div>

        <div className="text-xl font-bold mt-1">

          {value}

        </div>

      </div>

      <div
        className={`${iconColor} bg-white p-3 rounded-full`}
      >
        {icon}
      </div>

    </div>
  );
}