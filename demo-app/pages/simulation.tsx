/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { GoogleMap, LoadScriptNext } from "@react-google-maps/api";
import { useRecoilState, useRecoilValue } from "recoil";
import Styles from "@/public/resources/maps.json";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

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

    renderTaxiTimer = setTimeout(function () {
      if (taxiMarkers.length !== 0) {
        taxiMarkers.forEach((marker: google.maps.Marker) => {
          marker.setMap(null);
        });
        taxiMarkers = [];
      }

      fetch("https://api.data.gov.sg/v1/transport/taxi-availability")
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          const coordinates = data.features[0].geometry.coordinates.slice(0,200);
          coordinates.forEach(([a, b]: number[], index: number) => {
            newTaxi = new google.maps.Marker({
              map: mapRef,
              title: index.toString(),
              position: { lat: b, lng: a },
              icon: {
                url: "https://www.svgrepo.com/show/375911/taxi.svg",
                scaledSize: new google.maps.Size(10, 10),
              },
            });
            taxiMarkers.push(newTaxi);
          });
        });

      if (iter < 2) {
        rerenderTaxis(iter + 1);
        console.log("Taxis reloaded");
      }
    }, 30000);
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
