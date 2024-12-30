//parses the json string format of the location to the displaying of it MapDisply.jsx

interface LocationData {
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const parseLocation = (
  locationString: string | undefined | null
): { lat: number; lng: number } | null => {
  if (!locationString) return null;

  try {
    // Parse the JSON string into an object
    const locationData: LocationData = JSON.parse(locationString);

    // Extract coordinates from the parsed object
    const { coordinates } = locationData;

    if (
      !coordinates ||
      typeof coordinates.lat !== "number" ||
      typeof coordinates.lng !== "number"
    ) {
      console.error("Invalid coordinates in location data:", locationData);
      return null;
    }

    return {
      lat: coordinates.lat,
      lng: coordinates.lng,
    };
  } catch (error) {
    console.error("Error parsing location JSON:", error);
    return null;
  }
};

export const parseLocationName = (
  locationString: string | undefined | null
): string => {
  if (!locationString) return "Location not available";

  try {
    const locationData: LocationData = JSON.parse(locationString);
    return (
      locationData.location.split(",")[0].trim() || "Location not available"
    );
  } catch (error) {
    console.error("Error parsing location JSON:", error);
    return "Location not available";
  }
};
