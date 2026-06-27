import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getBooking } from "../../api/bookingApi";

import BookingHeader from "../../components/booking/BookingHeader";
import CustomerCard from "../../components/booking/CustomerCard";
import PricingCard from "../../components/booking/PricingCard";
import PaymentSummary from "../../components/booking/PaymentSummary";
import PaymentHistory from "../../components/booking/PaymentHistory";
import PaymentSchedule from "../../components/booking/PaymentSchedule";
import Timeline from "../../components/booking/Timeline";
import Documents from "../../components/booking/Documents";
import BookingActions from "../../components/booking/BookingActions";

import type { Booking } from "../../types/booking";

export default function BookingDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);

  const [loading, setLoading] = useState(true);

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
          onClick={() => navigate("/bookings")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Back
        </button>

      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <BookingHeader booking={booking} />

      <div className="grid grid-cols-12 gap-6 mt-6">

        {/* Left */}

        <div className="col-span-12 xl:col-span-8 space-y-6">

          <CustomerCard
            customer={booking.customer}
          />

          <PricingCard
            booking={booking}
          />

          <PaymentHistory
            payments={booking.payments}
            booking={booking}
            refresh={loadBooking}
          />

          <PaymentSchedule
            booking={booking}
          />

          <Timeline
            timeline={
              (booking as any).timeline ||
              []
            }
          />

        </div>

        {/* Right */}

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
          />

        </div>

      </div>

    </div>
  );
}