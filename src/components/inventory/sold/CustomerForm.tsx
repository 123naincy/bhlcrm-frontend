import type { Dispatch, SetStateAction } from "react";

export interface CustomerData {
  firstName: string;
  lastName: string;
  fatherName: string;
  mobile: string;
  alternateMobile: string;
  email: string;
  pan: string;
  aadhaar: string;
  address: string;
}

interface Props {
  data: CustomerData;
  setData: Dispatch<
    SetStateAction<CustomerData>
  >;
}

export default function CustomerForm({
  data,
  setData,
}: Props) {
  const change = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-5">

      <h3 className="text-lg font-semibold border-b pb-2">
        Customer Details
      </h3>

      <div className="grid grid-cols-2 gap-4">

        <input
          placeholder="First Name"
          name="firstName"
          value={data.firstName}
          onChange={change}
          className="border rounded-lg p-3"
        />

        <input
          placeholder="Last Name"
          name="lastName"
          value={data.lastName}
          onChange={change}
          className="border rounded-lg p-3"
        />

        <input
          placeholder="Father Name"
          name="fatherName"
          value={data.fatherName}
          onChange={change}
          className="border rounded-lg p-3"
        />

        <input
          placeholder="Mobile"
          name="mobile"
          value={data.mobile}
          onChange={change}
          className="border rounded-lg p-3"
        />

        <input
          placeholder="Alternate Mobile"
          name="alternateMobile"
          value={data.alternateMobile}
          onChange={change}
          className="border rounded-lg p-3"
        />

        <input
          placeholder="Email"
          name="email"
          value={data.email}
          onChange={change}
          className="border rounded-lg p-3"
        />

        <input
          placeholder="PAN Number"
          name="pan"
          value={data.pan}
          onChange={change}
          className="border rounded-lg p-3"
        />

        <input
          placeholder="Aadhaar Number"
          name="aadhaar"
          value={data.aadhaar}
          onChange={change}
          className="border rounded-lg p-3"
        />

      </div>

      <textarea
        placeholder="Address"
        rows={4}
        name="address"
        value={data.address}
        onChange={change}
        className="border rounded-lg w-full p-3"
      />

    </div>
  );
}