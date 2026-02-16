import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
  autoPlay?: boolean;
  className?: string;
  loop?: boolean;
  muted?: boolean;
}

export function VideoPlayer({
  src,
  thumbnail,
  autoPlay = false,
  className,
  loop = false,
  muted = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState<string>('');
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Play/Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  // Volume control
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (newMuted) {
        setVolume(0);
      } else {
        setVolume(videoRef.current.volume || 1);
      }
    }
  };

  // Seek control
  const handleSeek = (values: number[]) => {
    const newTime = values[0];
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  // Handle controls visibility
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError('Failed to load video');
      setIsLoading(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(10);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange([Math.min(volume + 0.1, 1)]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange([Math.max(volume - 0.1, 0)]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [volume, isPlaying]);

  if (error) {
    return (
      <div className={cn('bg-muted rounded-lg flex items-center justify-center p-8', className)}>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative bg-black rounded-lg overflow-hidden group', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={thumbnail}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}

      {/* Play Button Overlay (when paused) */}
      {!isPlaying && !isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="h-20 w-20 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
            <Play className="h-10 w-10 text-black ml-1" fill="black" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-white hover:bg-white/20"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" fill="white" />
            ) : (
              <Play className="h-5 w-5" fill="white" />
            )}
          </Button>

          {/* Skip Backward */}
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-white hover:bg-white/20"
            onClick={() => skip(-10)}
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          {/* Skip Forward */}
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-white hover:bg-white/20"
            onClick={() => skip(10)}
          >
            <SkipForward className="h-5 w-5" />
          </Button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 ml-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <div className="w-24 hidden sm:block">
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Fullscreen */}
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-white hover:bg-white/20"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      {!isPlaying && (
        <div className="absolute top-2 right-2 text-xs text-white/60 bg-black/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Space: Play/Pause • ←→: Skip • F: Fullscreen
        </div>
      )}
    </div>
  );
}
