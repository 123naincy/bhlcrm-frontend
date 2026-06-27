interface Props {
  status: string;

  setStatus: (
    value: string
  ) => void;
}

export default function InventoryFilters({
  status,
  setStatus,
}: Props) {
  return (
    <div className="flex gap-4 mb-6">

      <select
        className="border rounded-lg px-4 py-2"
        value={status}
        onChange={(e) =>
          setStatus(
            e.target.value
          )
        }
      >
        <option value="">
          All Status
        </option>

        <option value="available">
          Available
        </option>

        <option value="hold">
          Hold
        </option>

        <option value="sold">
          Sold
        </option>
      </select>

    </div>
  );
}