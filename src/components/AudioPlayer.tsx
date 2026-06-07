import { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";
import { getApiUrl } from "../utils";

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  audioUrl?: string;
  showControl?: boolean;
}

function resolveAudioUrl(url: string): string {
  if (!url) return "music.mp3";
  if (url.startsWith("/api/") || url.startsWith("api/")) {
    return getApiUrl(url);
  }
  return url;
}


export default function AudioPlayer({ isPlaying, onToggle, audioUrl = "music.mp3", showControl = true }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);

  useEffect(() => {
    const resolved = resolveAudioUrl(audioUrl);
    const audio = new Audio(resolved);
    audio.loop = true;
    audio.volume = 0.4; // standard background volume
    audioRef.current = audio;

    // Explicitly ask browser to preload the audio stream
    audio.preload = "auto";

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay blocked or audio load failed on URL change:", error);
        });
      }
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay blocked or audio load failed on toggle:", error);
          setErrorOccurred(true);
          onToggle(); // reset state
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, onToggle]);

  // If the control is requested to be hidden, we don't render the visual overlay but the audio still plays/preloads!
  if (!showControl) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-2">
      <button
        onClick={onToggle}
        className={`p-3.5 bg-white/95 text-amber-800 rounded-full shadow-xl border border-amber-150/80 hover:bg-stone-50 cursor-pointer active:scale-95 transition-all group relative flex items-center justify-center`}
        title={isPlaying ? "Mute Musik" : "Putar Musik"}
        id="btn-floating-music"
      >
        {/* Vinyl rotation effect */}
        <div className={`absolute inset-0 rounded-full border border-amber-600/20 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: '4s' }} />
        
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-stone-400" />
        )}

        {/* Dynamic visualizer bars */}
        {isPlaying && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        )}
      </button>

      {isPlaying && (
        <div className="hidden sm:flex items-center gap-1 bg-stone-900/90 text-[10px] uppercase font-sans tracking-[0.15em] text-stone-200 px-3 py-1.5 rounded-full border border-stone-800 backdrop-blur-md shadow-lg animate-fade-in animate-pulse">
          <Music className="w-3 h-3 text-amber-400" />
          <span>Backsound Musik</span>
        </div>
      )}
    </div>
  );
}
