interface Props {
  phase: number;

  phase1Count: number;

  phase2Count: number;

  onChange: (
    phase: number
  ) => void;
}

export default function PhaseTabs({
  phase,
  phase1Count,
  phase2Count,
  onChange,
}: Props) {
  return (
    <div className="flex gap-4 mb-6">

      <button
        onClick={() =>
          onChange(1)
        }
        className={`px-5 py-2 rounded-lg font-medium ${
          phase === 1
            ? "bg-blue-600 text-white"
            : "bg-white border"
        }`}
      >
        Phase 1
        {" "}
        <span className="opacity-80">
          ({phase1Count})
        </span>
      </button>

      <button
        onClick={() =>
          onChange(2)
        }
        className={`px-5 py-2 rounded-lg font-medium ${
          phase === 2
            ? "bg-blue-600 text-white"
            : "bg-white border"
        }`}
      >
        Phase 2
        {" "}
        <span className="opacity-80">
          ({phase2Count})
        </span>
      </button>

    </div>
  );
}
