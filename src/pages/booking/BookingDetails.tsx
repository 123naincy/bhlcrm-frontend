import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  cancelBooking,
  deletePayment,
  getBooking,
} from "../../api/bookingApi";

import BookingHeader from "../../components/booking/BookingHeader";
import CustomerCard from "../../components/booking/CustomerCard";
import PricingCard from "../../components/booking/PricingCard";
import PaymentSummary from "../../components/booking/PaymentSummary";
import PaymentHistory from "../../components/booking/PaymentHistory";
import PaymentSchedule from "../../components/booking/PaymentSchedule";
import Timeline from "../../components/booking/Timeline";
import Documents from "../../components/booking/Documents";
import BookingActions from "../../components/booking/BookingActions";
import PaymentModal from "../../components/booking/PaymentModal";
import EditBookingModal from "../../components/booking/EditBookingModal";

import {
  generateLetter,
  printBookingForm,
  printPaymentReceipt,
} from "../../utils/printBooking";

import type { Booking, Payment } from "../../types/booking";

interface BookingDetailsData
  extends Booking {
  timeline?: Array<{
    _id: string;
    title: string;
    description: string;
    action: string;
    createdAt: string;
    createdBy?: { name: string };
  }>;

  documents?: Array<{
    _id: string;
    name: string;
    type: string;
    fileUrl: string;
    uploadedAt: string;
  }>;

  paymentPlan?: {
    type: string;
    schedules: Array<{
      _id: string;
      installmentNo: number;
      title: string;
      amount: number;
      paidAmount?: number;
      dueDate?: string;
      percentage: number;
      status: string;
    }>;
  };
}

export default function BookingDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [booking, setBooking] =
    useState<BookingDetailsData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [
    showPaymentModal,
    setShowPaymentModal,
  ] = useState(false);

  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);

  const loadBooking = async () => {
    try {
      if (!id) return;

      const res = await getBooking(id);

      setBooking(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  const installments =
    useMemo(() => {
      return (
        booking?.paymentPlan
          ?.schedules || []
      );
    }, [booking]);

  const handleReceivePayment =
    () => {
      if (
        !installments.length
      ) {
        window.alert(
          "No payment schedule found for this booking."
        );
        return;
      }

      setShowPaymentModal(true);
    };

  const handleCancelBooking =
    async () => {
      if (!booking) return;

      const confirmed =
        window.confirm(
          "Cancel this booking? The plot will become available again."
        );

      if (!confirmed) return;

      try {
        await cancelBooking(
          booking._id
        );

        await loadBooking();

        window.alert(
          "Booking cancelled successfully."
        );
      } catch (err: any) {
        window.alert(
          err?.response?.data
            ?.message ||
            "Failed to cancel booking"
        );
      }
    };

  const handleDeletePayment = async (
    payment: Payment
  ) => {
    const confirmed =
      window.confirm(
        "Delete this payment record?"
      );

    if (!confirmed) return;

    try {
      await deletePayment(
        payment._id
      );

      await loadBooking();
    } catch (err: any) {
      window.alert(
        err?.response?.data
          ?.message ||
          "Failed to delete payment"
      );
    }
  };

  const handleViewPayment = (
    payment: Payment
  ) => {
    if (!booking) return;

    printPaymentReceipt(
      booking,
      payment
    );
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading Booking...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-10">
        <h2 className="text-xl font-bold mb-5">
          Booking Not Found
        </h2>

        <button
          onClick={() =>
            navigate("/bookings")
          }
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <BookingHeader
        booking={booking}
        onReceivePayment={
          handleReceivePayment
        }
        onEdit={() =>
          setShowEditModal(true)
        }
        onPrint={() =>
          printBookingForm(booking)
        }
        onCancel={
          handleCancelBooking
        }
      />

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <CustomerCard
            customer={booking.customer}
          />

          <PricingCard
            booking={booking}
          />

          <PaymentHistory
            payments={
              booking.payments
            }
            booking={booking}
            refresh={loadBooking}
            onReceivePayment={
              handleReceivePayment
            }
            onViewPayment={
              handleViewPayment
            }
            onPrintPayment={
              handleViewPayment
            }
            onDeletePayment={
              handleDeletePayment
            }
          />

          <PaymentSchedule
            booking={booking}
            onReceivePayment={() =>
              handleReceivePayment()
            }
          />

          <Timeline
            timeline={
              booking.timeline || []
            }
          />
        </div>

        <div className="col-span-12 xl:col-span-4 space-y-6">
          <PaymentSummary
            booking={booking}
          />

          <Documents
            booking={booking}
            refresh={loadBooking}
          />

          <BookingActions
            booking={booking}
            refresh={loadBooking}
            onReceivePayment={
              handleReceivePayment
            }
            onEdit={() =>
              setShowEditModal(true)
            }
            onTransfer={() =>
              window.alert(
                "Transfer booking: please contact admin."
              )
            }
            onCancel={
              handleCancelBooking
            }
            onPrintBooking={() =>
              printBookingForm(booking)
            }
            onPrintReceipt={() =>
              printPaymentReceipt(
                booking
              )
            }
            onGenerateDemandLetter={() =>
              generateLetter(
                booking,
                "demand"
              )
            }
            onGenerateAllotmentLetter={() =>
              generateLetter(
                booking,
                "allotment"
              )
            }
            onGenerateRegistry={() =>
              generateLetter(
                booking,
                "registry"
              )
            }
          />
        </div>
      </div>

      <PaymentModal
        open={showPaymentModal}
        bookingId={booking._id}
        installments={installments}
        onClose={() =>
          setShowPaymentModal(false)
        }
        onSuccess={loadBooking}
      />

      <EditBookingModal
        open={showEditModal}
        booking={booking}
        onClose={() =>
          setShowEditModal(false)
        }
        onSuccess={loadBooking}
      />
    </div>
  );
}
