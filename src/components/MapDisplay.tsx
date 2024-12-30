import { useEffect, useRef } from "react";
import loader from "../lib/googleMapsLoader";
import { parseLocation } from "@/lib/locationUtils";

interface MapDisplayProps {
  location: string;
  name: string;
}

const MapDisplay = ({ location, name }: MapDisplayProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const coordinates = parseLocation(location);
    if (!coordinates) {
      console.error("Could not parse coordinates from location:", location);
      return;
    }

    const initMap = async () => {
      try {
        await loader.load();

        if (!mapRef.current) return;

        console.log("Initializing map with coordinates:", coordinates);

        const mapOptions = {
          center: coordinates,
          zoom: 14,
          //   styles: [
          //     {
          //       featureType: "all",
          //       elementType: "geometry",
          //       stylers: [{ color: "#242f3e" }],
          //     },
          //     {
          //       featureType: "all",
          //       elementType: "labels.text.stroke",
          //       stylers: [{ color: "#242f3e" }],
          //     },
          //     {
          //       featureType: "all",
          //       elementType: "labels.text.fill",
          //       stylers: [{ color: "#746855" }],
          //     },
          //   ],
        };

        mapInstanceRef.current = new google.maps.Map(
          mapRef.current,
          mapOptions
        );

        markerRef.current = new google.maps.Marker({
          position: coordinates,
          map: mapInstanceRef.current,
          title: name,
          animation: google.maps.Animation.DROP,
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
    };
  }, [location, name]);

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-lg shadow-lg"
      style={{ minHeight: "24rem" }}
    />
  );
};

export default MapDisplay;
