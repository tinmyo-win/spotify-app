import axios from "axios";

const LOCALSTROAGE_KEYS = {
  accessToken: "spotify_access_token",
  refreshToken: "spotify_refresh_token",
  expireTime: "spotify_token_expire_time",
  timestamp: "spotify_token_timestamp",
};

const LOCALSTROAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTROAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTROAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTROAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTROAGE_KEYS.timestamp),
};

export const logout = () => {
  for (const property in LOCALSTROAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTROAGE_KEYS[property]);
  }

  window.location = window.location.origin;
};

const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTROAGE_VALUES;
  if (!accessToken || !timestamp) {
    return false;
  }
  const millisecondsElapsed = Date.now() - Number(timestamp);
  return millisecondsElapsed / 1000 > Number(expireTime);
};

const refreshToken = async () => {
  try {
    if (
      !LOCALSTROAGE_VALUES.refreshToken ||
      LOCALSTROAGE_VALUES === "undefined" ||
      Date.now() - Number(LOCALSTROAGE_VALUES.timestamp) / 1000 < 1000
    ) {
      console.error("No refresh token available");
      logout();
    }
    const { data } = await axios.get(
      `refresh_token?refresh_token=${LOCALSTROAGE_VALUES.refreshToken}`
    );
    window.localStorage.setItem(
      LOCALSTROAGE_KEYS.accessToken,
      data.access_token
    );
    window.localStorage.setItem(LOCALSTROAGE_KEYS.timestamp, Date.now());

    window.location.reload();
  } catch (e) {
    console.error(e);
  }
};

const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTROAGE_KEYS.accessToken]: urlParams.get("access_token"),
    [LOCALSTROAGE_KEYS.refreshToken]: urlParams.get("refresh_token"),
    [LOCALSTROAGE_KEYS.expireTime]: urlParams.get("expires_in"),
  };
  const hasError = urlParams.get("error");

  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTROAGE_VALUES.accessToken === "undefined"
  ) {
    refreshToken();
  }

  if (
    LOCALSTROAGE_VALUES.accessToken &&
    LOCALSTROAGE_VALUES.accessToken !== "undefined"
  ) {
    return LOCALSTROAGE_VALUES.accessToken;
  }

  if (queryParams[LOCALSTROAGE_KEYS.accessToken]) {
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }

    window.localStorage.setItem(LOCALSTROAGE_KEYS.timestamp, Date.now());

    return queryParams[LOCALSTROAGE_KEYS.accessToken];
  }

  //We should never get here
  return false;
};

export const accessToken = getAccessToken();

axios.defaults.baseURL = "https://api.spotify.com/v1";
axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
axios.defaults.headers["Content-Type"] = "application/json";

export const getCurrentUserProfile = () => axios.get("/me");

export const getCurrentUserPlaylists = (limit = 20) => {
  return axios.get(`/me/playlists?limit=${limit}`);
};

export const getTopArtists = (time_range = "short_term") => {
  return axios.get(`/me/top/artists?time_range=${time_range}`);
};

export const getTopTracks = (time_range = "short_term") => {
  return axios.get(`/me/top/tracks?time_range=${time_range}`);
};

export const getPlaylistById = (playlist_id) => {
  return axios.get(`/playlists/${playlist_id}`);
};

export const getAudioFeaturesForTracks = (ids) => {
  return axios.get(`/audio-features?ids=${ids}`);
};
