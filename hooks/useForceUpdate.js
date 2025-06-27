import { useState, useEffect } from "react";
import { Platform } from "react-native";
import remoteConfig from "@react-native-firebase/remote-config";
import Constants from "expo-constants";
import { isUpdateRequired } from "../utils/versionCheck";

/**
 * A custom hook to check for mandatory app updates using Firebase Remote Config.
 * @returns {{isUpdateNeeded: boolean, updateUrl: string, isLoading: boolean}}
 */
export const useForceUpdate = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateNeeded, setIsUpdateNeeded] = useState(false);
  const [updateUrl, setUpdateUrl] = useState("");

  useEffect(() => {
    const checkVersion = async () => {
      try {
        // In development, you might want to fetch more often.
        // For production, fetching once per hour is reasonable.
        const fetchInterval = __DEV__ ? 0 : 3600;

        await remoteConfig().fetch(fetchInterval);
        const activated = await remoteConfig().activate();

        if (activated) {
          console.log("Remote config data has been activated.");
        } else {
          console.log("Remote config data is already up to date.");
        }

        const minimumVersion = remoteConfig()
          .getValue("minimum_required_version")
          .asString();
        const currentVersion = Constants.expoConfig.version;

        console.log(
          `Version Check: Current is ${currentVersion}, Minimum required is ${minimumVersion}`
        );

        if (isUpdateRequired(currentVersion, minimumVersion)) {
          const url =
            Platform.OS === "ios"
              ? remoteConfig().getValue("update_url_ios").asString()
              : remoteConfig().getValue("update_url_android").asString();

          console.log("Update is required. URL:", url);
          setUpdateUrl(url);
          setIsUpdateNeeded(true);
        }
      } catch (error) {
        console.error("Error with remote config version check:", error);
        // In case of error, we don't force an update
      } finally {
        setIsLoading(false);
      }
    };

    checkVersion();
  }, []);

  return { isUpdateNeeded, updateUrl, isLoading };
};
