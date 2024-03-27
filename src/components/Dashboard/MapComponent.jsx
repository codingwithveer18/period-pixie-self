import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";

function MapComponent() {
  const [searchLocation, setSearchLocation] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6273928, 77.1716954]);
  const [mapZoom, setMapZoom] = useState(10);
  const userLocationMarkerRef = useRef(null);
  const mapRef = useRef();

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}`
      );
      if (!response.ok) {
        throw new Error("Geocoding request failed");
      }
      {
        response.ok
          ? toast.info("Fetching")
          : toast.error("Geocoding request failed");
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
        setMapZoom(10);
        toast.success("Fetched");

        // Remove user location marker when searching new location
        if (userLocationMarkerRef.current) {
          mapRef.current.removeLayer(userLocationMarkerRef.current);
          userLocationMarkerRef.current = null;
        }
      } else {
        setSearchResult(null);
        //console.log("No results found");
        toast.error("No results found");
      }
    } catch (error) {
      console.error("Error geocoding:", error);
    }
  };

  const LocationButton = () => {
    const handleClick = () => {
      getUserLocation();
    };

    const getUserLocation = () => {
      const map = mapRef.current;
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMapCenter([latitude, longitude]);
            setMapZoom(15);
            {
              position ? toast.success("Fetched") : toast.error("error");
            }

            // Update or create user location marker
            if (userLocationMarkerRef.current) {
              userLocationMarkerRef.current.setLatLng([latitude, longitude]);
            } else {
              const marker = L.marker([latitude, longitude]).addTo(map);
              userLocationMarkerRef.current = marker;
            }
          },
          (error) => {
            //console.error("Error getting user location:", error);
            toast.error("Error getting user location", error);
          }
        );
      } else {
        //console.error("Geolocation is not supported by this browser.");
        toast.error("Geolocation is not supported by this browser.");
      }
    };

    return (
      <button
        onClick={handleClick}
        className="absolute z-10 top-4 right-4 px-2 py-1 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white sm:font-semibold sm:px-4 sm:py-2"
      >
        Get Current Location
      </button>
    );
  };

  return (
    <>
      <div className="w-auto">
        <div className="flex flex-col items-center justify-center relative">
          <MapContainer
            ref={mapRef}
            center={mapCenter}
            zoom={mapZoom}
            className="w-full h-96 z-0 relative"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a>"
            />
            {searchResult && (
              <Marker
                position={[searchResult.latitude, searchResult.longitude]}
              >
                <Popup>{searchResult.displayName}</Popup>
              </Marker>
            )}
          </MapContainer>
          <LocationButton />
        </div>
        <div className="flex flex-col items-center justify-center mt-6 my-4 mx-4 ">
          {searchResult ? (
            <div className="flex flex-col justify-center sm:flex-row">
              <p className="px-4 ">Location: {searchResult.displayName}</p>
              <p className="px-4">Latitude: {searchResult.latitude}</p>
              <p className="px-4">Longitude: {searchResult.longitude}</p>
            </div>
          ) : (
            <p>Enter Location to Search</p>
          )}
          <div className="flex flex-col  items-center justify-center my-2 mx-4 sm:flex-row  ">
            <input
              type="text"
              placeholder="Search location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className=" shrink  px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent  "
            />
            <button
              onClick={handleSearch}
              className="  flex-none mx-4 my-2 px-4 py-2 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white sm:my-2"
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
