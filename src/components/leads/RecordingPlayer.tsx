import {
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  loadRecordingAudioUrl,
} from "../../api/callLogApi";

type RecordingPlayerProps = {
  recording: {
    _id: string;
    callType?: string;
    duration?: number;
    callDate?: string;
  };
};

export default function RecordingPlayer({
  recording,
}: RecordingPlayerProps) {
  const [audioUrl, setAudioUrl] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");

  useEffect(() => {
    return () => {
      if (audioUrl.startsWith("blob:")) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleLoad = async () => {
    if (audioUrl) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const url = await loadRecordingAudioUrl(
        recording._id
      );

      setAudioUrl(url);
    } catch (loadError) {
      console.error(loadError);
      setError(
        "Unable to play this recording"
      );
      toast.error(
        "Failed to play recording"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="font-medium">
            {recording.callType || "Call"}
          </p>

          <p className="text-sm text-slate-500">
            Duration: {recording.duration || 0}s
          </p>

          <p className="text-xs text-slate-400">
            {recording.callDate
              ? new Date(
                  recording.callDate
                ).toLocaleString()
              : "-"}
          </p>
        </div>

        {!audioUrl && (
          <button
            type="button"
            onClick={handleLoad}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
          >
            {loading
              ? "Loading..."
              : "▶ Play Recording"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {audioUrl && (
        <audio
          controls
          autoPlay
          preload="metadata"
          src={audioUrl}
          className="w-full"
        >
          Your browser does not support audio playback.
        </audio>
      )}
    </div>
  );
}
