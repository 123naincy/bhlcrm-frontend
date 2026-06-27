export type BookingStatus =
  | "active"
  | "cancelled"
  | "completed";

export interface Customer {
  _id: string;

  firstName: string;

  lastName: string;

  mobile: string;

  email: string;

  pan: string;

  aadhaar: string;
}

export interface Inventory {
  _id: string;

  plotNo: string;

  phase: number;

  area: number;

  areaUnit: string;

  type: string;
}

export interface Payment {
  _id: string;

  installmentNo?: number;

  amount: number;

  paymentDate: string;

  paymentMode: string;

  transactionNo: string;

  bankName?: string;

  receiptUrl?: string;

  receiptNo?: string;

  remarks?: string;

  status: "received" | "pending" | "failed";
}

export interface Booking {

  _id: string;

  bookingNo: string;

  bookingDate: string;

  status: BookingStatus;

  customer: Customer;

  inventory: Inventory;

  totalSaleValue: number;

  receivedAmount: number;

  pendingAmount: number;

  salesExecutive: string;

  salesExecutiveCommission?: number;

  channelPartner?: string;

  channelPartnerCommission?: number;

  payments: Payment[];

}