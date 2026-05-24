interface Props {
  temperature: string;
}

function TemperatureBadge({ temperature }: Props) {
  const styles: Record<string, string> = {
    hot: "bg-red-100 text-red-700",
    warm: "bg-yellow-100 text-yellow-700",
    cold: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[temperature] || "bg-slate-100 text-slate-700"
      }`}
    >
      {temperature.toUpperCase()}
    </span>
  );
}

export default TemperatureBadge;