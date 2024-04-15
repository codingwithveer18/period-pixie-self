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
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API;
  const clearMarkers = () => {
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current.removeLayer(layer);
      }
    });
  };

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
        setMapZoom(10);
        toast.success("Fetched");

        // Remove user location marker when searching new location
        clearMarkers();

        // Fetch nearby places after successfully getting search location
        fetchNearbyPlaces(latitude, longitude);
      } else {
        setSearchResult(null);
        toast.error("No results found");
      }
    } catch (error) {
      console.error("Error geocoding:", error);
      toast.error("Error geocoding");
    }
  };

  const handleGetCurrentLocation = () => {
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
          toast.success("Fetched");

          // Update or create user location marker with a different icon
          clearMarkers();
          const customIcon = L.icon({
            iconUrl: "https://storage.googleapis.com/project-hackdata/pin.png",
            iconSize: [32, 32], // Adjust the size as needed
          });
          const marker = L.marker([latitude, longitude], {
            icon: customIcon,
          }).addTo(map);
          userLocationMarkerRef.current = marker;

          // Fetch nearby places after successfully getting user location
          fetchNearbyPlaces(latitude, longitude);
        },
        (error) => {
          // Handle error when getting user's location fails
          toast.error("Error getting user location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const fetchNearbyPlaces = async (latitude, longitude) => {
    try {
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=4000&type=hospital|pharmacy&key=${apiKey}`;
      const response = await fetch(proxyUrl + apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch nearby places");
      }
      const data = await response.json();
      // Handle the response data and display markers for each nearby place
      if (data.results && data.results.length > 0) {
        data.results.forEach((place) => {
          const marker = L.marker([
            place.geometry.location.lat,
            place.geometry.location.lng,
          ]).addTo(mapRef.current);
          marker.bindPopup(
            `<strong>${place.name}</strong><br>${place.vicinity}`
          );
        });
      }
    } catch (error) {
      console.error("Error fetching nearby places:", error);
      toast.error("Error fetching nearby places");
    }
  };

  const LocationButton = () => {
    return (
      <button
        onClick={handleGetCurrentLocation}
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
