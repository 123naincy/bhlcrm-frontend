export interface RelationshipData {
  salesExecutive: string;
  salesExecutiveCommission: number;
  channelPartner: string;
  channelPartnerCommission: number;
  referralSource: string;
  bookingSource: string;
}

interface Props {
  data: RelationshipData;
  setData: React.Dispatch<
    React.SetStateAction<RelationshipData>
  >;
}

export default function RelationshipForm({
  data,
  setData,
}: Props) {
  const update = (
    field: keyof RelationshipData,
    value: string | number
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">

      <h3 className="text-xl font-semibold border-b pb-2">
        Relationship Details
      </h3>

      <div className="grid grid-cols-2 gap-5">

        <div>

          <label className="block mb-2">
            Sales Executive
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            placeholder="Enter sales executive name"
            value={data.salesExecutive}
            onChange={(e) =>
              update(
                "salesExecutive",
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label className="block mb-2">
            Sales Executive Commission (₹)
          </label>

          <input
            type="number"
            min={0}
            className="w-full border rounded-lg p-3"
            placeholder="Enter commission amount"
            value={data.salesExecutiveCommission || ""}
            onChange={(e) =>
              update(
                "salesExecutiveCommission",
                Number(e.target.value) || 0
              )
            }
          />

        </div>

        <div>

          <label className="block mb-2">
            Channel Partner
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            placeholder="Enter channel partner name"
            value={data.channelPartner}
            onChange={(e) =>
              update(
                "channelPartner",
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label className="block mb-2">
            Channel Partner Commission (₹)
          </label>

          <input
            type="number"
            min={0}
            className="w-full border rounded-lg p-3"
            placeholder="Enter commission amount"
            value={data.channelPartnerCommission || ""}
            onChange={(e) =>
              update(
                "channelPartnerCommission",
                Number(e.target.value) || 0
              )
            }
          />

        </div>

        <div>

          <label className="block mb-2">
            Referral Source
          </label>

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Enter referral source"
            value={data.referralSource}
            onChange={(e) =>
              update(
                "referralSource",
                e.target.value
              )
            }
          />

        </div>

        <div className="col-span-2">

          <label className="block mb-2">
            Booking Source
          </label>

          <select
            className="w-full border rounded-lg p-3"
            value={data.bookingSource}
            onChange={(e) =>
              update(
                "bookingSource",
                e.target.value
              )
            }
          >

            <option value="">
              Select Booking Source
            </option>

            <option value="walkin">
              Walk In
            </option>

            <option value="facebook">
              Facebook
            </option>

            <option value="google">
              Google Ads
            </option>

            <option value="website">
              Website
            </option>

            <option value="channel_partner">
              Channel Partner
            </option>

            <option value="employee_reference">
              Employee Reference
            </option>

            <option value="existing_customer">
              Existing Customer
            </option>

            <option value="other">
              Other
            </option>

          </select>

        </div>

      </div>

    </div>
  );
}
