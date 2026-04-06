import Constants from "expo-constants";

export const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) {
    return process.env.EXPO_PUBLIC_API_URL || "";
  }

  const ip = hostUri.split(":")[0];
  return `http://${ip}:8081`;
};

export const getApiUrl = (path: string) => {
  const baseUrl = getBaseUrl();
  const formattedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${formattedPath}`;
};
