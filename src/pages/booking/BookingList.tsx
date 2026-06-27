import { useEffect, useState } from "react";
import { getBookings } from "../../api/bookingApi";
import type { Booking } from "../../types/booking";
import { useNavigate } from "react-router-dom";

export default function BookingList() {

  const navigate =
    useNavigate();

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    load();

  }, []);

  const load = async () => {

    try {

      const res =
        await getBookings();

      setBookings(
        res.data.data
      );

    } finally {

      setLoading(false);

    }

  };

  if (loading)
    return (
      <div className="p-5">

        Loading...

      </div>
    );

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">

        Bookings

      </h2>

      <table className="w-full border">

        <thead>

          <tr className="bg-gray-100">

            <th className="border p-3">
              Booking No
            </th>

            <th className="border p-3">
              Customer
            </th>

            <th className="border p-3">
              Plot
            </th>

            <th className="border p-3">
              Sale Value
            </th>

            <th className="border p-3">
              Pending
            </th>

            <th className="border p-3">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {bookings.map((booking) => (

            <tr
              key={booking._id}
              onClick={() =>
                navigate(
                  `/bookings/${booking._id}`
                )
              }
              className="cursor-pointer hover:bg-gray-50"
            >

              <td className="border p-3">

                {booking.bookingNo}

              </td>

              <td className="border p-3">

                {booking.customer.firstName}{" "}
                {booking.customer.lastName}

              </td>

              <td className="border p-3">

                {booking.inventory.plotNo}

              </td>

              <td className="border p-3">

                ₹
                {booking.totalSaleValue.toLocaleString()}

              </td>

              <td className="border p-3">

                ₹
                {booking.pendingAmount.toLocaleString()}

              </td>

              <td className="border p-3">

                {booking.status}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}