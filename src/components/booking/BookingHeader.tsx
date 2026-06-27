import {
  Calendar,
  Home,
  User,
  Phone,
  BadgeIndianRupee,
  Printer,
  Pencil,
  Ban,
  CreditCard,
} from "lucide-react";

import type { Booking } from "../../types/booking";

interface Props {
  booking: Booking;

  onReceivePayment?: () => void;
  onEdit?: () => void;
  onPrint?: () => void;
  onCancel?: () => void;
}

export default function BookingHeader({
  booking,
  onReceivePayment,
  onEdit,
  onPrint,
  onCancel,
}: Props) {
  const statusColor = {
    active: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="border-b p-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">
            {booking.bookingNo}
          </h2>

          <div
            className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${
              statusColor[
                booking.status
              ]
            }`}
          >
            {booking.status.toUpperCase()}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap justify-end">
          {booking.status ===
            "active" && (
            <button
              onClick={
                onReceivePayment
              }
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <CreditCard size={18} />
              Receive Payment
            </button>
          )}

          <button
            onClick={onPrint}
            className="border px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Printer size={18} />
            Print
          </button>

          <button
            onClick={onEdit}
            className="border px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Pencil size={18} />
            Edit
          </button>

          {booking.status ===
            "active" && (
            <button
              onClick={onCancel}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Ban size={18} />
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 p-6">
        <InfoCard
          icon={<User size={20} />}
          title="Customer"
          value={`${booking.customer.firstName} ${booking.customer.lastName}`}
        />

        <InfoCard
          icon={<Phone size={20} />}
          title="Mobile"
          value={booking.customer.mobile}
        />

        <InfoCard
          icon={<Home size={20} />}
          title="Plot"
          value={
            booking.inventory.plotNo
          }
        />

        <InfoCard
          icon={<Calendar size={20} />}
          title="Booking Date"
          value={new Date(
            booking.bookingDate
          ).toLocaleDateString()}
        />

        <InfoCard
          icon={
            <BadgeIndianRupee size={20} />
          }
          title="Sale Value"
          value={`₹ ${booking.totalSaleValue.toLocaleString()}`}
        />

        <InfoCard
          icon={
            <BadgeIndianRupee size={20} />
          }
          title="Received"
          value={`₹ ${booking.receivedAmount.toLocaleString()}`}
        />

        <InfoCard
          icon={
            <BadgeIndianRupee size={20} />
          }
          title="Pending"
          value={`₹ ${booking.pendingAmount.toLocaleString()}`}
        />

        <InfoCard
          icon={<User size={20} />}
          title="Sales Executive"
          value={
            booking.salesExecutive ||
            "-"
          }
        />

        <InfoCard
          icon={
            <BadgeIndianRupee size={20} />
          }
          title="SE Commission"
          value={`₹ ${(booking.salesExecutiveCommission || 0).toLocaleString()}`}
        />

        <InfoCard
          icon={<User size={20} />}
          title="Channel Partner"
          value={
            booking.channelPartner ||
            "Direct"
          }
        />

        <InfoCard
          icon={
            <BadgeIndianRupee size={20} />
          }
          title="CP Commission"
          value={`₹ ${(booking.channelPartnerCommission || 0).toLocaleString()}`}
        />
      </div>
    </div>
  );
}

interface InfoProps {
  icon: React.ReactNode;
  title: string;
  value: any;
}

function InfoCard({
  icon,
  title,
  value,
}: InfoProps) {
  return (
    <div className="border rounded-xl p-4">
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        {icon}

        <span className="text-sm">
          {title}
        </span>
      </div>

      <div className="font-semibold text-lg break-words">
        {value}
      </div>
    </div>
  );
}
