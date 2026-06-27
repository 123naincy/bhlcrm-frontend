import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { createBooking } from "../../../api/inventoryApi";

import CustomerForm, {
  type CustomerData,
} from "./CustomerForm";

import PricingForm, {
  type PricingData,
} from "./PricingForm";

import PaymentPlanForm, {
  type PaymentPlanData,
} from "./PaymentPlanForm";

import FirstPaymentForm, {
  type FirstPaymentData,
} from "./FirstPaymentForm";

import RelationshipForm, {
  type RelationshipData,
} from "./RelationshipForm";

import BookingSummary from "./BookingSummary";

interface Props {
  open: boolean;

  plot: any;

  onClose: () => void;

  onSuccess: () => void;
}

const steps = [
  "Customer",
  "Pricing",
  "Relationship",
  "Payment Plan",
  "First Payment",
  "Summary",
];

export default function SoldModal({
  open,
  plot,
  onClose,
  onSuccess,
}: Props) {
  const [activeStep, setActiveStep] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  /**
   * Customer
   */

  const [customer, setCustomer] =
    useState<CustomerData>({
      firstName: "",
      lastName: "",
      fatherName: "",
      mobile: "",
      alternateMobile: "",
      email: "",
      pan: "",
      aadhaar: "",
      address: "",
    });

  /**
   * Pricing
   */

  const [pricing, setPricing] =
    useState<PricingData>({
      basePrice: 0,
      plc: 0,
      edc: 0,
      idc: 0,
      ifms: 0,
      clubCharges: 0,
      parkingCharges: 0,
      otherCharges: 0,
      discount: 0,
      gst: 0,
      totalSaleValue: 0,
    });

  /**
   * Payment Plan
   */

  const [paymentPlan, setPaymentPlan] =
    useState<PaymentPlanData>({
      paymentPlan: "down_payment",
      schedules: [],
    });

  /**
   * First Payment
   */

  const [payment, setPayment] =
    useState<FirstPaymentData>({
      amount: 0,
      paymentDate: "",
      paymentMode: "cash",
      bankName: "",
      transactionNo: "",
      chequeNo: "",
      remarks: "",
      receiptFile: null,
    });

  /**
   * Relationship
   */

  const [relationship, setRelationship] =
    useState<RelationshipData>({
      salesExecutive: "",
      salesExecutiveCommission: 0,
      channelPartner: "",
      channelPartnerCommission: 0,
      referralSource: "",
      bookingSource: "",
    });

  if (!open || !plot) return null;

  /**
   * Next
   */

  const next = () => {
    if (
      activeStep <
      steps.length - 1
    ) {
      setActiveStep(
        activeStep + 1
      );
    }
  };

  /**
   * Previous
   */

  const previous = () => {
    if (activeStep > 0) {
      setActiveStep(
        activeStep - 1
      );
    }
  };

  const validateStep = (step = activeStep) => {
    switch (step) {
      case 0:
        if (!customer.firstName) {
          alert("First Name is required");
          return false;
        }

        if (!customer.mobile) {
          alert("Mobile Number is required");
          return false;
        }

        return true;

      case 1:
        if (pricing.totalSaleValue <= 0) {
          alert("Enter Pricing Details");
          return false;
        }

        return true;

      case 2:
        if (!relationship.salesExecutive.trim()) {
          alert("Enter Sales Executive name");
          return false;
        }

        return true;

      case 3:
        if (!paymentPlan.paymentPlan) {
          alert("Select Payment Plan");
          return false;
        }

        return true;

      case 4:
        if (payment.amount <= 0) {
          alert("Enter First Payment");
          return false;
        }

        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;

    next();
  };

  const handlePrevious = () => {
    previous();
  };

  const validateAll = () => {
    for (let step = 0; step <= 4; step += 1) {
      if (!validateStep(step)) {
        setActiveStep(step);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateAll()) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "inventoryId",
        plot._id
      );

      formData.append(
        "customer",
        JSON.stringify(customer)
      );

      formData.append(
        "pricing",
        JSON.stringify(pricing)
      );

      formData.append(
        "relationship",
        JSON.stringify(relationship)
      );

      formData.append(
        "paymentPlan",
        JSON.stringify(paymentPlan)
      );

      formData.append(
        "payment",
        JSON.stringify({
          amount: payment.amount,
          paymentDate:
            payment.paymentDate ||
            new Date().toISOString().split("T")[0],
          paymentMode: payment.paymentMode,
          bankName: payment.bankName,
          transactionNo: payment.transactionNo,
          chequeNo: payment.chequeNo,
          remarks: payment.remarks,
        })
      );

      if (payment.receiptFile) {
        formData.append(
          "receipt",
          payment.receiptFile
        );
      }

      await createBooking(formData);

      alert(
        "Booking Created Successfully"
      );

      onSuccess();

      onClose();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Booking Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}

      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}

      <div className="fixed inset-0 flex items-center justify-center z-50 p-5">

        <div className="bg-white rounded-xl w-full max-w-6xl h-[92vh] overflow-hidden flex flex-col shadow-xl">

          {/* Header */}

          <div className="border-b p-5 flex justify-between items-center">

            <div>

              <h2 className="text-2xl font-bold">

                Book Plot

              </h2>

              <p className="text-gray-500">

                Plot No :
                {" "}
                {plot.plotNo}

              </p>

            </div>

            <button onClick={onClose}>

              <X />

            </button>

          </div>

          {/* Stepper */}

          <div className="border-b p-4">

            <div className="flex justify-between">

              {steps.map(
                (
                  step,
                  index
                ) => (
                  <div
                    key={step}
                    className="flex-1 text-center"
                  >

                    <div
                      className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center text-white ${
                        index <= activeStep
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >

                      {index + 1}

                    </div>

                    <p className="text-xs mt-2">

                      {step}

                    </p>

                  </div>
                )
              )}

            </div>

          </div>

          {/* Content */}

          <div className="flex-1 overflow-y-auto p-6">
                        {activeStep === 0 && (
              <CustomerForm
                data={customer}
                setData={setCustomer}
              />
            )}

            {activeStep === 1 && (
              <PricingForm
                data={pricing}
                setData={setPricing}
              />
            )}

            {activeStep === 2 && (
              <RelationshipForm
                data={relationship}
                setData={setRelationship}
              />
            )}

            {activeStep === 3 && (
              <PaymentPlanForm
                totalSaleValue={
                  pricing.totalSaleValue
                }
                data={paymentPlan}
                setData={setPaymentPlan}
              />
            )}

            {activeStep === 4 && (
              <FirstPaymentForm
                data={payment}
                setData={setPayment}
              />
            )}

            {activeStep === 5 && (
              <BookingSummary
                plot={plot}
                customer={customer}
                pricing={pricing}
                paymentPlan={paymentPlan}
                payment={payment}
                relationship={relationship}
              />
            )}
          </div>

          {/* Footer */}

          <div className="border-t p-5 flex justify-between">

            {/* Previous */}

            <button
              onClick={handlePrevious}
              disabled={activeStep === 0 || loading}
              className="flex items-center gap-2 px-5 py-3 rounded-lg border disabled:opacity-40"
            >
              <ChevronLeft size={18} />

              Previous

            </button>

            {/* Right Side */}

            <div className="flex gap-3">

              <button
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border rounded-lg"
              >
                Cancel
              </button>

              {activeStep < steps.length - 1 ? (

                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                >
                  Next

                  <ChevronRight size={18} />

                </button>

              ) : (

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg"
                >
                  {loading
                    ? "Saving Booking..."
                    : "Save Booking"}
                </button>

              )}

            </div>

          </div>

        </div>

      </div>

    </>
  );

}