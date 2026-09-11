"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { BsPlayCircleFill, BsPauseCircleFill } from "react-icons/bs";
import { MdReplay10, MdForward10 } from "react-icons/md";

// mm:ss. Guards NaN because duration is unknown until the browser has read the
// file's metadata — the first render always happens before that.
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export default function AudioPlayer({ book, onFinished }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(NaN);
  const [error, setError] = useState(null);

  // Every piece of state here is set from an <audio> event rather than an
  // effect, so React never has to reconcile a guess against the element.
  //
  // `playing` in particular is driven by the element's own play/pause events,
  // not set optimistically here: audio.play() returns a promise that can
  // reject, and flipping the button to "pause" before knowing whether playback
  // actually started leaves the UI claiming something the browser never did.
  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setError(null);
    if (audio.paused) {
      try {
        await audio.play();
      } catch (err) {
        setError(
          err?.name === "NotAllowedError"
            ? "Your browser blocked playback. Press play again."
            : "This audio could not be played."
        );
      }
    } else {
      audio.pause();
    }
  };

  const skip = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), audio.duration || 0);
  };

  const onSeek = (e) => {
    const value = Number(e.target.value);
    setCurrentTime(value);
    if (audioRef.current) audioRef.current.currentTime = value;
  };

  const progress = Number.isFinite(duration) && duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio">
      <audio
        ref={audioRef}
        src={book.audioLink}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setError("This audio could not be loaded.")}
        onEnded={() => {
          setPlaying(false);
          onFinished?.();
        }}
      />

      <div className="audio__track">
        <figure className="audio__track--image-mask">
          <Image src={book.imageLink} alt={book.title} width={48} height={48} />
        </figure>
        <div>
          <div className="audio__track--title">{book.title}</div>
          <div className="audio__track--author">{book.author}</div>
        </div>
      </div>

      <div className="audio__controls">
        <button type="button" className="audio__controls--btn" onClick={() => skip(-10)} aria-label="Back 10 seconds">
          <MdReplay10 />
        </button>
        <button
          type="button"
          className="audio__controls--btn audio__controls--btn-play"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <BsPauseCircleFill /> : <BsPlayCircleFill />}
        </button>
        <button type="button" className="audio__controls--btn" onClick={() => skip(10)} aria-label="Forward 10 seconds">
          <MdForward10 />
        </button>
      </div>

      {error && (
        <div role="alert" className="audio__error">
          {error}
        </div>
      )}

      <div className="audio__progress--wrapper">
        <div className="audio__time">{formatTime(currentTime)}</div>
        <input
          type="range"
          className="audio__progress--bar"
          min={0}
          max={Number.isFinite(duration) ? duration : 0}
          step="any"
          value={currentTime}
          onChange={onSeek}
          aria-label="Seek"
          style={{ "--progress": `${progress}%` }}
        />
        <div className="audio__time">{formatTime(duration)}</div>
      </div>
    </div>
  );
}
