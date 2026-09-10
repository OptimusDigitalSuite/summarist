"use client";

import { useEffect, useState } from "react";

// Book duration is not in the API — it only exists inside the MP3. The
// documentation says to come back for it once the audio player is done, and
// this is that: load just the file's metadata (not the audio) and read the
// duration off it.
//
// Cached at module scope so a book that appears in two rows, or a page you
// revisit, does not trigger a second request.
const cache = new Map();

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export function useAudioDuration(url) {
  const [duration, setDuration] = useState(() => (url ? cache.get(url) ?? null : null));

  useEffect(() => {
    if (!url || cache.has(url)) return;
    let ignore = false;
    const audio = new Audio();
    audio.preload = "metadata";
    const onLoaded = () => {
      cache.set(url, audio.duration);
      if (!ignore) setDuration(audio.duration);
    };
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.src = url;
    return () => {
      ignore = true;
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.src = ""; // stop the browser fetching metadata we no longer need
    };
  }, [url]);

  return duration;
}
