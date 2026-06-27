import { useEffect, type Dispatch, type SetStateAction } from "react";

export interface PricingData {
  basePrice: number;
  plc: number;
  edc: number;
  idc: number;
  ifms: number;
  clubCharges: number;
  parkingCharges: number;
  otherCharges: number;
  discount: number;
  gst: number;
  totalSaleValue: number;
}

interface Props {
  data: PricingData;
  setData: Dispatch<SetStateAction<PricingData>>;
}

export default function PricingForm({
  data,
  setData,
}: Props) {

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: Number(value) || 0,
    }));

  };

  useEffect(() => {

    const subtotal =
      data.basePrice +
      data.plc +
      data.edc +
      data.idc +
      data.ifms +
      data.clubCharges +
      data.parkingCharges +
      data.otherCharges -
      data.discount;

    const gstAmount =
      subtotal * (data.gst / 100);

    const total =
      subtotal + gstAmount;

    setData((prev) => ({
      ...prev,
      totalSaleValue: total,
    }));

  }, [
    data.basePrice,
    data.plc,
    data.edc,
    data.idc,
    data.ifms,
    data.clubCharges,
    data.parkingCharges,
    data.otherCharges,
    data.discount,
    data.gst,
  ]);

  return (

    <div className="space-y-6">

      <h3 className="text-xl font-semibold border-b pb-2">

        Pricing Details

      </h3>

      <div className="grid grid-cols-2 gap-5">

        <Input
          label="Base Price"
          name="basePrice"
          value={data.basePrice}
          onChange={handleChange}
        />

        <Input
          label="PLC"
          name="plc"
          value={data.plc}
          onChange={handleChange}
        />

        <Input
          label="EDC"
          name="edc"
          value={data.edc}
          onChange={handleChange}
        />

        <Input
          label="IDC"
          name="idc"
          value={data.idc}
          onChange={handleChange}
        />

        <Input
          label="IFMS"
          name="ifms"
          value={data.ifms}
          onChange={handleChange}
        />

        <Input
          label="Club Charges"
          name="clubCharges"
          value={data.clubCharges}
          onChange={handleChange}
        />

        <Input
          label="Parking"
          name="parkingCharges"
          value={data.parkingCharges}
          onChange={handleChange}
        />

        <Input
          label="Other Charges"
          name="otherCharges"
          value={data.otherCharges}
          onChange={handleChange}
        />

        <Input
          label="Discount"
          name="discount"
          value={data.discount}
          onChange={handleChange}
        />

        <Input
          label="GST (%)"
          name="gst"
          value={data.gst}
          onChange={handleChange}
        />

      </div>

      <div className="bg-green-100 rounded-xl p-5">

        <div className="flex justify-between">

          <span className="font-semibold">

            Total Sale Value

          </span>

          <span className="text-2xl font-bold text-green-700">

            ₹ {data.totalSaleValue.toLocaleString()}

          </span>

        </div>

      </div>

    </div>

  );

}

interface InputProps {
  label: string;
  name: keyof PricingData;
  value: number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

function Input({
  label,
  name,
  value,
  onChange,
}: InputProps) {

  return (

    <div>

      <label className="block mb-2 text-sm font-medium">

        {label}

      </label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg p-3"
      />

    </div>

  );

}