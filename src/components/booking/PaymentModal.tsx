import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { receivePayment } from "../../api/bookingApi";

interface Installment {
  _id: string;
  installmentNo: number;
  title: string;
  amount: number;
  paidAmount?: number;
  dueDate?: string;
  status: string;
}

interface Props {
  open: boolean;
  bookingId: string;
  installments: Installment[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({
  open,
  bookingId,
  installments,
  onClose,
  onSuccess,
}: Props) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    installmentId: "",
    amount: "",
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMode: "cash",
    bankName: "",
    transactionNo: "",
    chequeNo: "",
    remarks: "",
  });

  const [receipt, setReceipt] =
    useState<File | null>(null);

  useEffect(() => {

    if (!open) return;

    const firstPending =
      installments.find(
        (i) => i.status !== "paid"
      );

    if (firstPending) {

      setForm((prev) => ({
        ...prev,
        installmentId: firstPending._id,
        amount: (
          firstPending.amount -
          (firstPending.paidAmount || 0)
        ).toString(),
      }));

    }

  }, [open, installments]);

  const selectedInstallment =
    useMemo(() => {

      return installments.find(
        (i) =>
          i._id === form.installmentId
      );

    }, [
      form.installmentId,
      installments,
    ]);

  const remaining =
    selectedInstallment
      ? selectedInstallment.amount -
        (selectedInstallment.paidAmount || 0)
      : 0;

  if (!open) return null;
  const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement |
    HTMLSelectElement |
    HTMLTextAreaElement
  >
) => {

  setForm({
    ...form,
    [e.target.name]:
      e.target.value,
  });

};

const handleSubmit =
async () => {

  if (!form.installmentId) {

    alert("Select installment");

    return;

  }

  if (!form.amount) {

    alert("Enter amount");

    return;

  }

  try {

    setLoading(true);

    const fd =
      new FormData();

    fd.append(
      "bookingId",
      bookingId
    );

    fd.append(
      "paymentScheduleId",
      form.installmentId
    );

    fd.append(
      "amount",
      form.amount
    );

    fd.append(
      "paymentDate",
      form.paymentDate
    );

    fd.append(
      "paymentMode",
      form.paymentMode
    );

    fd.append(
      "bankName",
      form.bankName
    );

    fd.append(
      "transactionNo",
      form.transactionNo
    );

    fd.append(
      "chequeNo",
      form.chequeNo
    );

    fd.append(
      "remarks",
      form.remarks
    );

    if (receipt) {

      fd.append(
        "receipt",
        receipt
      );

    }

    await receivePayment(fd);

    alert(
      "Payment received successfully"
    );

    onSuccess();

    onClose();

  } catch (err: any) {

    alert(
      err?.response?.data
        ?.message ||
        "Payment failed"
    );

  } finally {

    setLoading(false);

  }

};
return (

<>

<div
className="fixed inset-0 bg-black/50 z-40"
/>

<div className="fixed inset-0 z-50 flex justify-center items-center p-5">

<div className="bg-white rounded-xl w-full max-w-3xl">

<div className="border-b p-5 flex justify-between">

<h2 className="text-xl font-bold">

Receive Payment

</h2>

<button onClick={onClose}>

<X/>

</button>

</div>

<div className="p-6 space-y-5">

<div>

<label>

Installment

</label>

<select
name="installmentId"
value={form.installmentId}
onChange={handleChange}
className="w-full border rounded-lg p-3"
>

{installments.map(i=>(

<option
key={i._id}
value={i._id}
>

#{i.installmentNo}

{" - "}

{i.title}

</option>

))}

</select>

</div>

<div className="grid grid-cols-2 gap-5">

<div>

<label>

Remaining

</label>

<input
readOnly
value={remaining}
className="w-full border rounded-lg p-3 bg-gray-100"
/>

</div>

<div>

<label>

Receive Amount

</label>

<input
type="number"
name="amount"
value={form.amount}
onChange={handleChange}
className="w-full border rounded-lg p-3"
/>

</div>

<div>

<label>

Payment Date

</label>

<input
type="date"
name="paymentDate"
value={form.paymentDate}
onChange={handleChange}
className="w-full border rounded-lg p-3"
/>

</div>

<div>

<label>

Payment Mode

</label>

<select
name="paymentMode"
value={form.paymentMode}
onChange={handleChange}
className="w-full border rounded-lg p-3"
>

<option value="cash">Cash</option>
<option value="upi">UPI</option>
<option value="cheque">Cheque</option>
<option value="rtgs">RTGS</option>
<option value="neft">NEFT</option>

</select>

</div>

<div>

<label>

Bank Name

</label>

<input
name="bankName"
value={form.bankName}
onChange={handleChange}
className="w-full border rounded-lg p-3"
/>

</div>

<div>

<label>

Transaction No

</label>

<input
name="transactionNo"
value={form.transactionNo}
onChange={handleChange}
className="w-full border rounded-lg p-3"
/>

</div>

</div>

<div>

<label>

Upload Receipt

</label>

<input
type="file"
accept=".pdf,.jpg,.png,.jpeg"
onChange={(e)=>
setReceipt(
e.target.files?.[0] ||
null
)
}
/>

</div>

<div>

<label>

Remarks

</label>

<textarea
rows={4}
name="remarks"
value={form.remarks}
onChange={handleChange}
className="w-full border rounded-lg p-3"
/>

</div>

</div>

<div className="border-t p-5 flex justify-end gap-3">

<button
onClick={onClose}
className="border px-5 py-2 rounded-lg"
>

Cancel

</button>

<button
disabled={loading}
onClick={handleSubmit}
className="bg-green-600 text-white px-6 py-2 rounded-lg"
>

{loading
? "Saving..."
: "Receive Payment"}

</button>

</div>

</div>

</div>

</>

);
}