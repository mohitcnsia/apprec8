import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

/**
 * A custom hook to manage and play sound effects for the V2 interactive quiz.
 * It preloads the sounds to ensure minimal latency when playing.
 */
export const useSoundEffects = () => {
  const [successSound, setSuccessSound] = useState(null);
  const [failureSound, setFailureSound] = useState(null);

  useEffect(() => {
    let sSound;
    let fSound;

    const loadSounds = async () => {
      try {
        // Our own short sounds, bundled in the app (16 Nov 2026: the old Pixabay links answered 403, so quizzes were silent).
        const successUrl = require('../assets/sounds/right.wav');
        const failureUrl = require('../assets/sounds/wrong.wav');

        const { sound: success } = await Audio.Sound.createAsync(
          successUrl,
          { shouldPlay: false }
        );
        sSound = success;
        setSuccessSound(success);

        const { sound: failure } = await Audio.Sound.createAsync(
          failureUrl,
          { shouldPlay: false }
        );
        fSound = failure;
        setFailureSound(failure);
      } catch (e) {
        console.warn("Failed to load sound effects", e);
      }
    };

    loadSounds();

    return () => {
      if (sSound) sSound.unloadAsync();
      if (fSound) fSound.unloadAsync();
    };
  }, []);

  const playSuccess = async () => {
    if (successSound) {
      try {
        await successSound.replayAsync();
      } catch (e) {
        console.warn("Could not play success sound", e);
      }
    }
  };

  const playFailure = async () => {
    if (failureSound) {
      try {
        await failureSound.replayAsync();
      } catch (e) {
        console.warn("Could not play failure sound", e);
      }
    }
  };

  return {
    playSuccess,
    playFailure,
  };
};
