import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapComponent() {
  const [searchLocation, setSearchLocation] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6273928, 77.1716954]);
  const [mapZoom, setMapZoom] = useState(10);
  const [userLocationMarker, setUserLocationMarker] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}`
      );
      if (!response.ok) {
        throw new Error("Geocoding request failed");
      }
      const data = await response.json();
      if (data.length > 0) {
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);
        setSearchResult({
          displayName: data[0].display_name,
          latitude,
          longitude,
        });
        setMapCenter([latitude, longitude]);
        setMapZoom(15);
      } else {
        setSearchResult(null);
        console.log("No results found");
      }
    } catch (error) {
      console.error("Error geocoding:", error);
    }
  };

  const LocationButton = () => {
    const map = useMap();

    const getUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMapCenter([latitude, longitude]);
            setMapZoom(15);

            if (userLocationMarker) {
              userLocationMarker.remove();
            }

            const marker = L.marker([latitude, longitude]).addTo(map);
            setUserLocationMarker(marker);

            map.panTo([latitude, longitude]);
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    const handleClick = () => {
      getUserLocation();
    };

    return (
      <button
        onClick={handleClick}
        className="absolute z-10 top-4 right-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
      >
        Get Current Location
      </button>
    );
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center relative  ">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="w-full h-96 z-0 relative"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {searchResult && (
            <Marker position={[searchResult.latitude, searchResult.longitude]}>
              <Popup>{searchResult.displayName}</Popup>
            </Marker>
          )}
          <LocationButton />
        </MapContainer>
        <div className="flex flex-col  items-center justify-center mt-6 space-y-2 w-full ">
          {searchResult ? (
            <>
              <div className="flex flex-row justify-center ">
                <p className="px-4">Location: {searchResult.displayName}</p>
                <p className="px-4">Latitude: {searchResult.latitude}</p>
                <p className="px-4">Longitude: {searchResult.longitude}</p>
              </div>
            </>
          ) : (
            <p>Enter Location to Search</p>
          )}
          <div className="flex  items-center justify-center space-x-4">
            <input
              type="text"
              placeholder="Search location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-80 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MapComponent;
