import type { Booking } from "../types/booking";

type LetterType =
  | "booking"
  | "receipt"
  | "demand"
  | "allotment"
  | "registry";

function openPrintWindow(
  title: string,
  html: string
) {
  const printWindow =
    window.open("", "_blank");

  if (!printWindow) {
    window.alert(
      "Please allow pop-ups to print."
    );
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
          h1 { margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .muted { color: #666; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export function printBookingForm(
  booking: Booking
) {
  const customer = booking.customer;
  const inventory = booking.inventory;
  const pricing = (booking as any).pricing || {};

  openPrintWindow(
    `Booking ${booking.bookingNo}`,
    `
      <h1>Booking Form</h1>
      <p class="muted">${booking.bookingNo}</p>
      <table>
        <tr><th>Customer</th><td>${customer.firstName} ${customer.lastName}</td></tr>
        <tr><th>Mobile</th><td>${customer.mobile}</td></tr>
        <tr><th>Plot</th><td>${inventory.plotNo} (Phase ${inventory.phase})</td></tr>
        <tr><th>Area</th><td>${inventory.area} ${inventory.areaUnit}</td></tr>
        <tr><th>Booking Date</th><td>${new Date(booking.bookingDate).toLocaleDateString()}</td></tr>
        <tr><th>Sale Value</th><td>₹ ${booking.totalSaleValue.toLocaleString()}</td></tr>
        <tr><th>Received</th><td>₹ ${booking.receivedAmount.toLocaleString()}</td></tr>
        <tr><th>Pending</th><td>₹ ${booking.pendingAmount.toLocaleString()}</td></tr>
        <tr><th>Sales Executive</th><td>${booking.salesExecutive || "-"}</td></tr>
        <tr><th>Channel Partner</th><td>${booking.channelPartner || "Direct"}</td></tr>
      </table>
      <h2>Pricing</h2>
      <table>
        <tr><th>Base Price</th><td>₹ ${(pricing.basePrice || 0).toLocaleString()}</td></tr>
        <tr><th>PLC</th><td>₹ ${(pricing.plc || 0).toLocaleString()}</td></tr>
        <tr><th>EDC/IDC</th><td>₹ ${(pricing.edc || 0).toLocaleString()}</td></tr>
        <tr><th>GST</th><td>₹ ${(pricing.gst || 0).toLocaleString()}</td></tr>
        <tr><th>Total</th><td>₹ ${(pricing.totalSaleValue || booking.totalSaleValue).toLocaleString()}</td></tr>
      </table>
    `
  );
}

export function printPaymentReceipt(
  booking: Booking,
  payment?: Booking["payments"][0]
) {
  const latest =
    payment ||
    booking.payments[
      booking.payments.length - 1
    ];

  if (!latest) {
    window.alert("No payment to print.");
    return;
  }

  openPrintWindow(
    `Receipt ${latest.receiptNo || latest._id}`,
    `
      <h1>Payment Receipt</h1>
      <p class="muted">${booking.bookingNo}</p>
      <table>
        <tr><th>Customer</th><td>${booking.customer.firstName} ${booking.customer.lastName}</td></tr>
        <tr><th>Plot</th><td>${booking.inventory.plotNo}</td></tr>
        <tr><th>Receipt No</th><td>${latest.receiptNo || "-"}</td></tr>
        <tr><th>Date</th><td>${new Date(latest.paymentDate).toLocaleDateString()}</td></tr>
        <tr><th>Amount</th><td>₹ ${latest.amount.toLocaleString()}</td></tr>
        <tr><th>Mode</th><td>${latest.paymentMode}</td></tr>
        <tr><th>Transaction</th><td>${latest.transactionNo || "-"}</td></tr>
        <tr><th>Bank</th><td>${latest.bankName || "-"}</td></tr>
      </table>
    `
  );
}

export function generateLetter(
  booking: Booking,
  type: LetterType
) {
  const titles: Record<
    LetterType,
    string
  > = {
    booking: "Booking Confirmation",
    receipt: "Payment Receipt",
    demand: "Demand Letter",
    allotment: "Allotment Letter",
    registry: "Registry Papers",
  };

  const customer = booking.customer;
  const inventory = booking.inventory;

  openPrintWindow(
    titles[type],
    `
      <h1>${titles[type]}</h1>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <p>To,</p>
      <p><strong>${customer.firstName} ${customer.lastName}</strong><br/>
      ${customer.mobile}<br/>
      ${(customer as any).address || ""}</p>
      <p>Dear Sir/Madam,</p>
      <p>
        This is regarding your booking
        <strong>${booking.bookingNo}</strong>
        for Plot <strong>${inventory.plotNo}</strong>
        (Phase ${inventory.phase}, ${inventory.area} ${inventory.areaUnit}).
      </p>
      <p>
        Total sale value:
        <strong>₹ ${booking.totalSaleValue.toLocaleString()}</strong>.
        Amount received:
        <strong>₹ ${booking.receivedAmount.toLocaleString()}</strong>.
        Pending balance:
        <strong>₹ ${booking.pendingAmount.toLocaleString()}</strong>.
      </p>
      <p>Regards,<br/>Sales Team</p>
    `
  );
}
