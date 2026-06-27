import type { Dispatch, SetStateAction } from "react";

export interface FirstPaymentData {
  amount: number;
  paymentDate: string;
  paymentMode:
    | "cash"
    | "cheque"
    | "rtgs"
    | "neft"
    | "upi"
    | "dd";

  bankName: string;
  transactionNo: string;
  chequeNo: string;
  remarks: string;
  receiptFile?: File | null;
}

interface Props {
  data: FirstPaymentData;
  setData: Dispatch<SetStateAction<FirstPaymentData>>;
}

export default function FirstPaymentForm({
  data,
  setData,
}: Props) {

  const change = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {

    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]:
        name === "amount"
          ? Number(value)
          : value,
    }));

  };

  return (

    <div className="space-y-6">

      <h3 className="text-xl font-semibold border-b pb-2">

        First Payment

      </h3>

      <div className="grid grid-cols-2 gap-5">

        <div>

          <label className="block mb-2">

            Amount

          </label>

          <input
            type="number"
            name="amount"
            value={data.amount}
            onChange={change}
            className="w-full border rounded-lg p-3"
          />

        </div>

        <div>

          <label className="block mb-2">

            Payment Date

          </label>

          <input
            type="date"
            name="paymentDate"
            value={data.paymentDate}
            onChange={change}
            className="w-full border rounded-lg p-3"
          />

        </div>

        <div>

          <label className="block mb-2">

            Payment Mode

          </label>

          <select
            name="paymentMode"
            value={data.paymentMode}
            onChange={change}
            className="w-full border rounded-lg p-3"
          >

            <option value="cash">
              Cash
            </option>

            <option value="cheque">
              Cheque
            </option>

            <option value="rtgs">
              RTGS
            </option>

            <option value="neft">
              NEFT
            </option>

            <option value="upi">
              UPI
            </option>

            <option value="dd">
              Demand Draft
            </option>

          </select>

        </div>

        <div>

          <label className="block mb-2">

            Bank Name

          </label>

          <input
            name="bankName"
            value={data.bankName}
            onChange={change}
            className="w-full border rounded-lg p-3"
          />

        </div>

        <div>

          <label className="block mb-2">

            Transaction / UTR No.

          </label>

          <input
            name="transactionNo"
            value={data.transactionNo}
            onChange={change}
            className="w-full border rounded-lg p-3"
          />

        </div>

        <div>

          <label className="block mb-2">

            Cheque No.

          </label>

          <input
            name="chequeNo"
            value={data.chequeNo}
            onChange={change}
            className="w-full border rounded-lg p-3"
          />

        </div>

      </div>

      <div>

        <label className="block mb-2">

          Upload Receipt

        </label>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              receiptFile:
                e.target.files?.[0] ?? null,
            }))
          }
        />

      </div>

      <div>

        <label className="block mb-2">

          Remarks

        </label>

        <textarea
          rows={4}
          name="remarks"
          value={data.remarks}
          onChange={change}
          className="w-full border rounded-lg p-3"
        />

      </div>

    </div>

  );

}