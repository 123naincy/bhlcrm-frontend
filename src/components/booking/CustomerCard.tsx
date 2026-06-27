import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  BadgeCheck,
  MessageCircle,
} from "lucide-react";
import {
  sanitizePhone,
} from "../../utils/fileUrl";


interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  pan: string;
  aadhaar: string;
  address?: string;
  photo?: string;
}

interface Props {
  customer: Customer;
}

export default function CustomerCard({
  customer,
}: Props) {

  const fullName =
    `${customer.firstName} ${customer.lastName}`;

  const phone = sanitizePhone(
    customer.mobile
  );

  const whatsapp = () => {
    if (!phone) {
      window.alert(
        "No mobile number available."
      );
      return;
    }

    window.open(
      `https://wa.me/91${phone}`,
      "_blank"
    );
  };

  const call = () => {
    if (!phone) {
      window.alert(
        "No mobile number available."
      );
      return;
    }

    window.location.href =
      `tel:+91${phone}`;
  };

  const email = () => {
    if (!customer.email) {
      window.alert(
        "No email address available."
      );
      return;
    }

    window.location.href =
      `mailto:${customer.email}`;
  };

  return (

    <div className="bg-white rounded-xl shadow">

      {/* Header */}

      <div className="border-b p-5 flex justify-between items-center">

        <h2 className="text-xl font-bold">

          Customer Details

        </h2>

        <div className="flex gap-2">

          <button
            onClick={call}
            className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
          >
            <Phone size={18} />

            Call

          </button>

          <button
            onClick={whatsapp}
            className="bg-emerald-500 text-white px-3 py-2 rounded-lg flex items-center gap-2"
          >
            <MessageCircle size={18} />

            WhatsApp

          </button>

          <button
            onClick={email}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
          >
            <Mail size={18} />

            Email

          </button>

        </div>

      </div>

      {/* Body */}

      <div className="p-6 flex gap-6">

        {/* Profile */}

        <div className="w-36 flex-shrink-0">

          {customer.photo ? (

            <img
              src={customer.photo}
              alt={fullName}
              className="w-32 h-32 rounded-full object-cover border"
            />

          ) : (

            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">

              <User
                size={50}
                className="text-gray-500"
              />

            </div>

          )}

        </div>

        {/* Details */}

        <div className="flex-1">

          <div className="grid grid-cols-2 gap-6">

            <Info
              icon={<User size={18} />}
              label="Customer Name"
              value={fullName}
            />

            <Info
              icon={<Phone size={18} />}
              label="Mobile"
              value={customer.mobile}
            />

            <Info
              icon={<Mail size={18} />}
              label="Email"
              value={customer.email}
            />

            <Info
              icon={<CreditCard size={18} />}
              label="PAN Number"
              value={customer.pan}
            />

            <Info
              icon={<BadgeCheck size={18} />}
              label="Aadhaar"
              value={customer.aadhaar}
            />

            <Info
              icon={<MapPin size={18} />}
              label="Address"
              value={customer.address || "-"}
            />

          </div>

        </div>

      </div>

    </div>

  );

}

interface InfoProps {

  icon: React.ReactNode;

  label: string;

  value: string;

}

function Info({
  icon,
  label,
  value,
}: InfoProps) {

  return (

    <div>

      <div className="flex items-center gap-2 text-gray-500 mb-2">

        {icon}

        <span className="text-sm">

          {label}

        </span>

      </div>

      <div className="font-semibold break-words">

        {value}

      </div>

    </div>

  );

}