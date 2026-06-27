import {
  BadgeIndianRupee,
  Percent,
  Receipt,
} from "lucide-react";
import type { Booking } from "../../types/booking";

interface Props {
  booking: Booking;
}

export default function PricingCard({
  booking,
}: Props) {

  const pricing = (booking as any).pricing || {};

  const rows = [
    {
      label: "Base Price",
      value: pricing.basePrice || 0,
    },
    {
      label: "PLC",
      value: pricing.plc || 0,
    },
    {
      label: "EDC",
      value: pricing.edc || 0,
    },
    {
      label: "IDC",
      value: pricing.idc || 0,
    },
    {
      label: "IFMS",
      value: pricing.ifms || 0,
    },
    {
      label: "Club Charges",
      value: pricing.clubCharges || 0,
    },
    {
      label: "Parking Charges",
      value: pricing.parkingCharges || 0,
    },
    {
      label: "Other Charges",
      value: pricing.otherCharges || 0,
    },
    {
      label: "Discount",
      value: pricing.discount || 0,
      danger: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow">

      {/* Header */}

      <div className="border-b p-5 flex items-center gap-3">

        <Receipt className="text-blue-600" />

        <h2 className="text-xl font-bold">
          Pricing Details
        </h2>

      </div>

      {/* Body */}

      <div className="p-6 space-y-3">

        {rows.map((row) => (
          <Row
            key={row.label}
            label={row.label}
            value={row.value}
            danger={row.danger}
          />
        ))}

        <hr />

        <Row
          label="GST"
          value={`${pricing.gst || 0}%`}
          icon={<Percent size={16} />}
        />

        <hr />

        <Row
          label="Total Sale Value"
          value={`₹ ${booking.totalSaleValue.toLocaleString()}`}
          bold
          icon={
            <BadgeIndianRupee
              size={18}
            />
          }
        />

        <Row
          label="Received Amount"
          value={`₹ ${booking.receivedAmount.toLocaleString()}`}
          success
        />

        <Row
          label="Pending Amount"
          value={`₹ ${booking.pendingAmount.toLocaleString()}`}
          warning
        />

      </div>

    </div>
  );
}

interface RowProps {
  label: string;
  value: any;
  bold?: boolean;
  success?: boolean;
  warning?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
}

function Row({
  label,
  value,
  bold,
  success,
  warning,
  danger,
  icon,
}: RowProps) {

  let color = "text-gray-800";

  if (success)
    color = "text-green-600";

  if (warning)
    color = "text-orange-600";

  if (danger)
    color = "text-red-600";

  return (

    <div className="flex justify-between items-center">

      <div className="flex items-center gap-2">

        {icon}

        <span
          className={
            bold
              ? "font-semibold"
              : ""
          }
        >
          {label}
        </span>

      </div>

      <span
        className={`${color} ${
          bold
            ? "font-bold text-lg"
            : "font-medium"
        }`}
      >
        {typeof value === "number"
          ? `₹ ${value.toLocaleString()}`
          : value}
      </span>

    </div>

  );
}