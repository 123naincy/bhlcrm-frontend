import { useEffect, type Dispatch, type SetStateAction } from "react";

export type PaymentPlanType =
  | "down_payment"
  | "flexi"
  | "50_50"
  | "construction_linked"
  | "custom";

export interface PaymentSchedule {
  installmentNo: number;
  title: string;
  percentage: number;
  amount: number;
}

export interface PaymentPlanData {
  paymentPlan: PaymentPlanType;
  schedules: PaymentSchedule[];
}

interface Props {
  totalSaleValue: number;
  data: PaymentPlanData;
  setData: Dispatch<SetStateAction<PaymentPlanData>>;
}

export default function PaymentPlanForm({
  totalSaleValue,
  data,
  setData,
}: Props) {
  useEffect(() => {
    let schedules: PaymentSchedule[] = [];

    switch (data.paymentPlan) {
      case "down_payment":
        schedules = [
          {
            installmentNo: 1,
            title: "100% Payment",
            percentage: 100,
            amount: totalSaleValue,
          },
        ];
        break;

      case "flexi":
        schedules = [
          {
            installmentNo: 1,
            title: "Booking Amount",
            percentage: 10,
            amount: totalSaleValue * 0.1,
          },
          {
            installmentNo: 2,
            title: "Within 45 Days",
            percentage: 40,
            amount: totalSaleValue * 0.4,
          },
          {
            installmentNo: 3,
            title: "Possession",
            percentage: 50,
            amount: totalSaleValue * 0.5,
          },
        ];
        break;

      case "50_50":
        schedules = [
          {
            installmentNo: 1,
            title: "Booking",
            percentage: 50,
            amount: totalSaleValue * 0.5,
          },
          {
            installmentNo: 2,
            title: "Possession",
            percentage: 50,
            amount: totalSaleValue * 0.5,
          },
        ];
        break;

      case "construction_linked":
        schedules = [
          {
            installmentNo: 1,
            title: "Booking",
            percentage: 10,
            amount: totalSaleValue * 0.1,
          },
          {
            installmentNo: 2,
            title: "Foundation",
            percentage: 20,
            amount: totalSaleValue * 0.2,
          },
          {
            installmentNo: 3,
            title: "Roof",
            percentage: 30,
            amount: totalSaleValue * 0.3,
          },
          {
            installmentNo: 4,
            title: "Finishing",
            percentage: 20,
            amount: totalSaleValue * 0.2,
          },
          {
            installmentNo: 5,
            title: "Possession",
            percentage: 20,
            amount: totalSaleValue * 0.2,
          },
        ];
        break;

      case "custom":
        schedules = [];
        break;
    }

    setData((prev) => ({
      ...prev,
      schedules,
    }));
  }, [data.paymentPlan, totalSaleValue]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold border-b pb-2">
        Payment Plan
      </h3>

      <select
        className="border rounded-lg p-3 w-full"
        value={data.paymentPlan}
        onChange={(e) =>
          setData((prev) => ({
            ...prev,
            paymentPlan: e.target.value as PaymentPlanType,
          }))
        }
      >
        <option value="down_payment">Down Payment</option>
        <option value="flexi">Flexi Plan</option>
        <option value="50_50">50 : 50 Plan</option>
        <option value="construction_linked">
          Construction Linked
        </option>
        <option value="custom">Custom</option>
      </select>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Stage</th>
            <th className="border p-2">%</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>

        <tbody>
          {data.schedules.map((item) => (
            <tr key={item.installmentNo}>
              <td className="border p-2 text-center">
                {item.installmentNo}
              </td>

              <td className="border p-2">
                {item.title}
              </td>

              <td className="border p-2 text-center">
                {item.percentage}%
              </td>

              <td className="border p-2 text-right">
                ₹ {item.amount.toLocaleString()}
              </td>
            </tr>
          ))}

          {data.paymentPlan === "custom" &&
            data.schedules.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center p-6 text-gray-500"
                >
                  Custom payment schedule will be added
                  manually.
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  );
}