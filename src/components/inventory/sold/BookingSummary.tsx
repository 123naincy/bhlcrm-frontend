import type { CustomerData } from "./CustomerForm";
import type { PricingData } from "./PricingForm";
import type { PaymentPlanData } from "./PaymentPlanForm";
import type { FirstPaymentData } from "./FirstPaymentForm";
import type { RelationshipData } from "./RelationshipForm";

interface Props {
  plot: {
    plotNo: string;
    phase: number;
    area: number;
    areaUnit: string;
    type: string;
  };

  customer: CustomerData;

  pricing: PricingData;

  paymentPlan: PaymentPlanData;

  payment: FirstPaymentData;

  relationship: RelationshipData;
}

export default function BookingSummary({
  plot,
  customer,
  pricing,
  paymentPlan,
  payment,
  relationship,
}: Props) {

  const pendingAmount =
    pricing.totalSaleValue - payment.amount;

  return (

    <div className="space-y-8">

      <h2 className="text-2xl font-bold border-b pb-3">

        Booking Summary

      </h2>

      {/* Plot */}

      <div className="bg-white border rounded-xl p-5">

        <h3 className="font-semibold text-lg mb-4">

          Plot Details

        </h3>

        <div className="grid grid-cols-2 gap-4">

          <Info
            label="Plot Number"
            value={plot.plotNo}
          />

          <Info
            label="Phase"
            value={`Phase ${plot.phase}`}
          />

          <Info
            label="Area"
            value={`${plot.area} ${plot.areaUnit}`}
          />

          <Info
            label="Property Type"
            value={plot.type}
          />

        </div>

      </div>

      {/* Customer */}

      <div className="bg-white border rounded-xl p-5">

        <h3 className="font-semibold text-lg mb-4">

          Customer

        </h3>

        <div className="grid grid-cols-2 gap-4">

          <Info
            label="Customer"
            value={`${customer.firstName} ${customer.lastName}`}
          />

          <Info
            label="Mobile"
            value={customer.mobile}
          />

          <Info
            label="Email"
            value={customer.email}
          />

          <Info
            label="PAN"
            value={customer.pan}
          />

          <Info
            label="Aadhaar"
            value={customer.aadhaar}
          />

        </div>

      </div>

      {/* Pricing */}

      <div className="bg-white border rounded-xl p-5">

        <h3 className="font-semibold text-lg mb-4">

          Pricing

        </h3>

        <div className="grid grid-cols-2 gap-4">

          <Info
            label="Sale Value"
            value={`₹ ${pricing.totalSaleValue.toLocaleString()}`}
          />

          <Info
            label="Discount"
            value={`₹ ${pricing.discount.toLocaleString()}`}
          />

          <Info
            label="GST"
            value={`${pricing.gst}%`}
          />

        </div>

      </div>

      {/* Payment */}

      <div className="bg-white border rounded-xl p-5">

        <h3 className="font-semibold text-lg mb-4">

          Payment

        </h3>

        <div className="grid grid-cols-2 gap-4">

          <Info
            label="Plan"
            value={paymentPlan.paymentPlan}
          />

          <Info
            label="First Payment"
            value={`₹ ${payment.amount.toLocaleString()}`}
          />

          <Info
            label="Pending"
            value={`₹ ${pendingAmount.toLocaleString()}`}
          />

          <Info
            label="Mode"
            value={payment.paymentMode}
          />

        </div>

      </div>

      {/* Relationship */}

      <div className="bg-white border rounded-xl p-5">

        <h3 className="font-semibold text-lg mb-4">

          Relationship

        </h3>

        <div className="grid grid-cols-2 gap-4">

          <Info
            label="Sales Executive"
            value={relationship.salesExecutive}
          />

          <Info
            label="Sales Executive Commission"
            value={`₹ ${relationship.salesExecutiveCommission.toLocaleString()}`}
          />

          <Info
            label="Channel Partner"
            value={
              relationship.channelPartner || "Direct"
            }
          />

          <Info
            label="Channel Partner Commission"
            value={`₹ ${relationship.channelPartnerCommission.toLocaleString()}`}
          />

          <Info
            label="Booking Source"
            value={relationship.bookingSource}
          />

        </div>

      </div>

      {/* Final Summary */}

      <div className="bg-green-50 border-2 border-green-600 rounded-xl p-6">

        <div className="grid grid-cols-3 gap-5">

          <SummaryCard
            title="Sale Value"
            value={`₹ ${pricing.totalSaleValue.toLocaleString()}`}
          />

          <SummaryCard
            title="Received"
            value={`₹ ${payment.amount.toLocaleString()}`}
          />

          <SummaryCard
            title="Pending"
            value={`₹ ${pendingAmount.toLocaleString()}`}
          />

        </div>

      </div>

    </div>

  );

}

interface InfoProps {
  label: string;
  value: any;
}

function Info({
  label,
  value,
}: InfoProps) {

  return (

    <div>

      <p className="text-sm text-gray-500">

        {label}

      </p>

      <p className="font-semibold">

        {value || "-"}

      </p>

    </div>

  );

}

interface SummaryProps {
  title: string;
  value: string;
}

function SummaryCard({
  title,
  value,
}: SummaryProps) {

  return (

    <div className="bg-white rounded-lg p-5 text-center shadow">

      <div className="text-sm text-gray-500">

        {title}

      </div>

      <div className="text-xl font-bold mt-2">

        {value}

      </div>

    </div>

  );

}