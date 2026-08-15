import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import remoteConfig from '@react-native-firebase/remote-config';

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
        // 1. Set default values
        await remoteConfig().setDefaults({
          audio_url_success: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3',
          audio_url_failure: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_7314d3a042.mp3?filename=error-126627.mp3',
        });

        // 2. Fetch and activate the remote config
        await remoteConfig().fetchAndActivate();

        // 3. Get the remote values
        const successUrl = remoteConfig().getValue('audio_url_success').asString();
        const failureUrl = remoteConfig().getValue('audio_url_failure').asString();

        const { sound: success } = await Audio.Sound.createAsync(
          { uri: successUrl },
          { shouldPlay: false }
        );
        sSound = success;
        setSuccessSound(success);

        const { sound: failure } = await Audio.Sound.createAsync(
          { uri: failureUrl },
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
