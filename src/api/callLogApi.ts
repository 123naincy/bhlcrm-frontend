import api from "./axios";

export const getLeadRecordings = async (
  leadId: string
) => {
  const response = await api.get(
    `/call-logs/lead/${leadId}`
  );

  return response.data;
};

export const playRecording = async (
  callLogId: string
) => {
  const response = await api.get(
    `/call-logs/${callLogId}/play`
  );

  return response.data;
};

async function loadStreamBlobUrl(
  path: string
) {
  const response = await api.get(path, {
    responseType: "blob",
  });

  const blob = response.data as Blob;

  if (
    blob.type.includes("json") ||
    blob.type.includes("text")
  ) {
    const text = await blob.text();

    try {
      const json = JSON.parse(text);

      if (json.url) {
        return json.url as string;
      }

      throw new Error(
        json.message ||
          "Unable to load recording"
      );
    } catch (parseError) {
      if (text.includes("API Not Found")) {
        throw new Error("Recording stream route not found");
      }

      throw parseError;
    }
  }

  if (!blob.size) {
    throw new Error("Recording file is empty");
  }

  return URL.createObjectURL(blob);
}

export async function loadRecordingAudioUrl(
  callLogId: string
) {
  const streamPaths = [
    `/call-logs/${callLogId}/play?stream=1`,
    `/call-logs/${callLogId}/stream`,
  ];

  for (const path of streamPaths) {
    try {
      const url = await loadStreamBlobUrl(path);

      if (url.startsWith("blob:")) {
        return url;
      }

      return url;
    } catch (error) {
      console.warn(`Recording stream failed for ${path}`, error);
    }
  }

  const playResponse = await playRecording(
    callLogId
  );

  if (!playResponse?.url) {
    throw new Error("Playback URL not available");
  }

  return playResponse.url as string;
}
