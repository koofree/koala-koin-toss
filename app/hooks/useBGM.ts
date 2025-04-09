import { INITIAL_BGM_VOLUME } from '@/config';
import { useEffect, useState } from 'react';
const bgmList = [
  'game-music-player-console-8bit-background-intro-theme-297305.mp3',
  'very-lush-and-swag-loop-74140.mp3',
];

export const useBGM = () => {
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [userFocused, setUserFocused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleUserInteraction = (): void => {
    if (!userFocused) {
      setUserFocused(true);

      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);

      window.addEventListener('touchstart', handleUserInteraction);
      window.addEventListener('mousedown', handleUserInteraction);
      window.addEventListener('keydown', handleUserInteraction);
    }
  };

  useEffect(() => {
    // Add event listeners for various user interactions
    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('mousedown', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  const handleBlur = () => {
    if (userFocused) {
      setUserFocused(false);

      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);

      window.addEventListener('touchstart', handleUserInteraction);
      window.addEventListener('mousedown', handleUserInteraction);
      window.addEventListener('keydown', handleUserInteraction);
    }
  };

  const _playMusic = () => {
    if (audioRef) {
      audioRef.currentTime = currentTime;
      audioRef.volume = INITIAL_BGM_VOLUME;
      audioRef.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      const audio = new Audio(`/sounds/${bgmList[0]}`);
      audio.addEventListener('ended', () => {
        const nextAudio = new Audio(`/sounds/${bgmList[1]}`);
        nextAudio.addEventListener('ended', () => {
          if (isPlaying) {
            _playMusic();
          }
        });
        setAudioRef(nextAudio);
        nextAudio.volume = INITIAL_BGM_VOLUME;
        nextAudio.play().catch(() => {
          setIsPlaying(false);
        });
      });
      setAudioRef(audio);
      audio.volume = INITIAL_BGM_VOLUME;
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const _pauseMusic = () => {
    if (audioRef) {
      audioRef.pause();
      setCurrentTime(audioRef.currentTime);
    }
  };

  useEffect(() => {
    if (isPlaying && userFocused) {
      _playMusic();
    } else {
      // Pause the music
      _pauseMusic();
    }

    // Cleanup function to stop audio when component unmounts or animation state changes
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
        setAudioRef(null);
      }
    };
  }, [isPlaying, userFocused]);

  // Add event listeners for visibility and blur events
  useEffect(() => {
    if (audioRef) {
      window.addEventListener('blur', handleBlur);
    }
  }, [audioRef]);

  const playMusic = () => {
    setIsPlaying(true);
  };

  const stopMusic = () => {
    setIsPlaying(false);
  };

  return { isPlaying, playMusic, stopMusic };
};
