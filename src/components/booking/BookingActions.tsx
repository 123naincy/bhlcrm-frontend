import {
  CreditCard,
  Pencil,
  ArrowRightLeft,
  Ban,
  RotateCcw,
  Printer,
  FileText,
  Landmark,
} from "lucide-react";

import type { Booking } from "../../types/booking";

interface Props {
  booking: Booking;
  refresh: () => void;

  onReceivePayment?: () => void;
  onEdit?: () => void;
  onTransfer?: () => void;
  onCancel?: () => void;
  onRestore?: () => void;
  onPrintBooking?: () => void;
  onPrintReceipt?: () => void;
  onGenerateDemandLetter?: () => void;
  onGenerateAllotmentLetter?: () => void;
  onGenerateRegistry?: () => void;
}

export default function BookingActions({
  booking,
  onReceivePayment,
  onEdit,
  onTransfer,
  onCancel,
  onRestore,
  onPrintBooking,
  onPrintReceipt,
  onGenerateDemandLetter,
  onGenerateAllotmentLetter,
  onGenerateRegistry,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow">

      <div className="border-b p-5">

        <h2 className="text-xl font-bold">

          Booking Actions

        </h2>

      </div>

      <div className="p-5 grid gap-3">

        <ActionButton
          title="Receive Payment"
          icon={<CreditCard size={18} />}
          color="bg-green-600"
          onClick={onReceivePayment}
        />

        <ActionButton
          title="Edit Booking"
          icon={<Pencil size={18} />}
          color="bg-blue-600"
          onClick={onEdit}
        />

        <ActionButton
          title="Transfer Booking"
          icon={<ArrowRightLeft size={18} />}
          color="bg-purple-600"
          onClick={onTransfer}
        />

        <ActionButton
          title="Print Booking Form"
          icon={<Printer size={18} />}
          color="bg-gray-700"
          onClick={onPrintBooking}
        />

        <ActionButton
          title="Print Payment Receipt"
          icon={<Printer size={18} />}
          color="bg-indigo-600"
          onClick={onPrintReceipt}
        />

        <ActionButton
          title="Generate Demand Letter"
          icon={<FileText size={18} />}
          color="bg-orange-600"
          onClick={onGenerateDemandLetter}
        />

        <ActionButton
          title="Generate Allotment Letter"
          icon={<FileText size={18} />}
          color="bg-cyan-600"
          onClick={onGenerateAllotmentLetter}
        />

        <ActionButton
          title="Generate Registry Papers"
          icon={<Landmark size={18} />}
          color="bg-teal-600"
          onClick={onGenerateRegistry}
        />

        {booking.status === "active" ? (
          <ActionButton
            title="Cancel Booking"
            icon={<Ban size={18} />}
            color="bg-red-600"
            onClick={onCancel}
          />
        ) : (
          <ActionButton
            title="Restore Booking"
            icon={<RotateCcw size={18} />}
            color="bg-green-700"
            onClick={onRestore}
          />
        )}

      </div>

    </div>
  );
}

interface ActionButtonProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

function ActionButton({
  title,
  icon,
  color,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white rounded-lg px-4 py-3 flex items-center gap-3 hover:opacity-90 transition`}
    >
      {icon}

      <span>{title}</span>

    </button>
  );
}