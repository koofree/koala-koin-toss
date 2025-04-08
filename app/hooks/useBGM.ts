import { useEffect, useState } from 'react';

const bgmList = ['8bit-mix-56351.mp3', '8-bit-heaven-26287.mp3'];

export const useBGM = () => {
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (userInteracted) return;
      setIsPlaying(true);
      setUserInteracted(true);

      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };

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

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const _playMusic = () => {
    const audio = new Audio(`/sounds/${bgmList[0]}`);
    audio.addEventListener('ended', () => {
      const nextAudio = new Audio(`/sounds/${bgmList[1]}`);
      nextAudio.addEventListener('ended', () => {
        if (isPlaying) {
          _playMusic();
        }
      });
      setAudioRef(nextAudio);
      nextAudio.play().catch((err) => console.error('Error playing audio:', err));
    });
    setAudioRef(audio);
    audio.play().catch((err) => {
      console.error('Error playing audio:', err);
      setIsPlaying(false);
    });
  };

  useEffect(() => {
    if (isPlaying) {
      _playMusic();
    } else {
      // Stop the music when animation is disabled
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
        setAudioRef(null);
      }
    }

    // Cleanup function to stop audio when component unmounts or animation state changes
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
      }
    };
  }, [isPlaying]);

  const playMusic = () => {
    setIsPlaying(true);
  };

  const stopMusic = () => {
    setIsPlaying(false);
  };

  return { isPlaying, playMusic, stopMusic };
};
