/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { GoogleMap, LoadScriptNext } from "@react-google-maps/api";
import { useRecoilState, useRecoilValue } from "recoil";
import Styles from "@/public/resources/maps.json";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

let taxiMarkers: any = [];

const libraries = ["places", "geometry"];
export let pickupRoute: any;
export let dropRoute: any;

export default function Simulation() {
  const [mapRef, setMapRef] = useState<google.maps.Map>();
  const [isLoading, setIsLoading] = useState(true);
  let renderTaxiTimer: any;

  // On map load... set location to current location
  const loadMap = useCallback(function callback(map: google.maps.Map) {
    setMapRef(map);
    navigator.geolocation.getCurrentPosition((position) => {
      const currLocation = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );

      map.panTo(currLocation);
      map.setZoom(14);

      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (isLoading) return;
    rerenderTaxis(0);

    return () => {
      clearTimeout(renderTaxiTimer);
    };
  }, [isLoading]);

  function rerenderTaxis(iter: number) {
    let newTaxi;

    renderTaxiTimer = setTimeout(
      function () {
        fetch("https://api.data.gov.sg/v1/transport/taxi-availability")
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            const coordinates = data.features[0].geometry.coordinates;
            const markers = coordinates.map(
              (coord: number[], index: number) =>
                new google.maps.Marker({
                  position: new google.maps.LatLng(coord[1], coord[0]),
                  title: index.toString(),
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 3,
                  },
                  optimized: true,
                })
            );
            var markerCluster = new MarkerClusterer({
              map: mapRef,
              markers: markers,
            });
          });

        if (iter < 4) {
          rerenderTaxis(iter + 1);
          console.log("Taxis reloaded");
        }
      },
      iter === 0 ? 0 : 30000
    );
  }

  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      libraries={libraries as any}
    >
      <div className="absolute top-0 left-0 h-screen w-screen">
        <GoogleMap
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            minZoom: 3,
            styles: Styles,
          }}
          onLoad={loadMap}
        />
      </div>
    </LoadScriptNext>
  );
}
