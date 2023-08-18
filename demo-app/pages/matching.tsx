/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { GoogleMap, LoadScriptNext } from "@react-google-maps/api";
import Styles from "@/public/resources/maps.json";
import { computeNearbyTaxis } from "@/server";

const libraries = ["places", "geometry"];
let infoWindow: any = null;
let userLoc: google.maps.Marker;
let nearbyTaxiCache: google.maps.Marker[] = [];
let taxiPolylineCache: google.maps.Polyline[] = [];
let searchRadius: google.maps.Circle;

export default function Matching() {
  const [map, setMap] = useState<google.maps.Map>();

  // On map load... set location to current location
  const loadMap = useCallback(function callback(gmap: google.maps.Map) {
    setMap(gmap);
    const currLocation = new google.maps.LatLng(1.292187, 103.7740251);
    infoWindow = new google.maps.InfoWindow();
    refresh(gmap, currLocation);

    gmap.panTo(currLocation);
    gmap.setZoom(15);
  }, []);

  const refresh = (map: google.maps.Map, currLocation: google.maps.LatLng) => {
    userLoc && clear();
    userLoc = new google.maps.Marker({
      position: currLocation,
      draggable: true,
      map: map,
      icon: {
        url: "https://www.svgrepo.com/show/466845/user-circle.svg",
        scaledSize: new google.maps.Size(30, 30),
      },
    });
    userLoc.addListener("click", () => {
      infoWindow.close();
      infoWindow.setContent(`(${currLocation.lat()}, ${currLocation.lng()})`);
      infoWindow.open(map, userLoc);
    });
    google.maps.event.addListener(userLoc, "dragend", function () {
      refresh(
        map as google.maps.Map,
        userLoc.getPosition() as google.maps.LatLng
      );
    });

    computeNearbyTaxis(currLocation, 15, (data: any) => {
      data.map((taxi: any, index: number) => {
        const taxiLoc = new google.maps.LatLng(taxi.lat, taxi.lng);
        const distance = (Math.sqrt(taxi.distance) * 111.139).toFixed(2);
        var randBoolean = Math.random() < 0.5;

        const nearbyTaxi = new google.maps.Marker({
          position: taxiLoc,
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: randBoolean ? "#ca8a04" : "#b91c1c",
            fillOpacity: 1,
            strokeWeight: 0,
          },
          label: {
            text: taxi.driverID.toString(),
            color: "white",
            fontSize: "14",
          },
        });

        nearbyTaxi.addListener("click", () => {
          infoWindow.close();
          infoWindow.setContent(`
          (${taxi.lat}, ${taxi.lng})<br /><br />
          Distance: <b>${distance}</b> km.<br />
          ETA: <b>${(Number(distance) / 0.65).toFixed(2)}</b> min.
          `);
          infoWindow.open(map, nearbyTaxi);
        });
        nearbyTaxiCache.push(nearbyTaxi);

        if (index === 5) {
          searchRadius = new google.maps.Circle({
            strokeColor: "#dc2626",
            strokeOpacity: 1,
            strokeWeight: 1.5,
            fillColor: "#fee2e2",
            fillOpacity: 0.35,
            map: map,
            center: currLocation,
            radius: Number(distance) * 1000,
          });
        }

        if (index >= 6) return;

        const taxiPolyline = new google.maps.Polyline({
          path: [currLocation, taxiLoc],
          map: map,
          strokeColor: randBoolean ? "#ca8a04" : "#b91c1c",
          strokeOpacity: 0.8,
          strokeWeight: 0.8,
        });
        taxiPolylineCache.push(taxiPolyline);
      });
    });
  };

  const clear = () => {
    for (let i = 0; i < nearbyTaxiCache.length; i++) {
      nearbyTaxiCache[i].setMap(null);
    }
    for (let i = 0; i < taxiPolylineCache.length; i++) {
      taxiPolylineCache[i].setMap(null);
    }
    searchRadius.setMap(null);
    userLoc.setMap(null);
  };

  return (
    <>
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
          <div className="flex space-x-5 absolute bottom-0 left-0 m-5">
            <button disabled>
              Drag and drop the user to see the matched taxis
            </button>
          </div>
        </div>
      </LoadScriptNext>
    </>
  );
}
