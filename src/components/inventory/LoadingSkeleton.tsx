export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-4">

      {Array.from({
        length: 10,
      }).map((_, index) => (
        <div
          key={index}
          className="h-32 rounded-lg bg-slate-200 animate-pulse"
        />
      ))}

    </div>
  );
}