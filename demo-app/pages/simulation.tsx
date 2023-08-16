/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { GoogleMap, LoadScriptNext } from "@react-google-maps/api";
import Styles from "@/public/resources/maps.json";
import {
  GridAlgorithm,
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import { getDriver, getTaxi } from "@/server";

let taxiMarkers: any = [];
let markerCluster: any = null;
let infoWindow: any = null;
let trafficLayer: any = null;
let rectangle: any = null;

const libraries = ["places", "geometry"];

export default function Simulation() {
  const [mapRef, setMapRef] = useState<google.maps.Map>();
  const [isLoading, setIsLoading] = useState(true);
  const [showTrafficLayer, setShowTrafficLayer] = useState(false);
  const [showGeofence, setShowGeofence] = useState(false);
  const useGrid = () => loadTaxis(new GridAlgorithm({}));
  const useNoop = () => loadTaxis(null);
  const useSuper = () => loadTaxis(new SuperClusterAlgorithm({}));
  const useTraffic = () => {
    trafficLayer.setMap(!showTrafficLayer ? mapRef! : null);
    setShowTrafficLayer(!showTrafficLayer);
  };

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
    loadTaxis(new GridAlgorithm({}));

    trafficLayer = new google.maps.TrafficLayer();

    const bounds = {
      north: 1.3275,
      south: 1.2982,
      east: 103.8231,
      west: 103.7914,
    };
    rectangle = new google.maps.Rectangle({
      bounds: bounds,
      editable: true,
      draggable: true,
    });
  }, [isLoading]);

  const loadTaxis = (algorithm: any) => {
    let newTaxi: any;
    let queryID: any;
    clearTaxis();

    fetch("https://api.data.gov.sg/v1/transport/taxi-availability")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const coordinates = data.features[0].geometry.coordinates;
        const markers = coordinates.map((coord: number[], index: number) => {
          newTaxi = new google.maps.Marker({
            position: new google.maps.LatLng(coord[1], coord[0]),
            title: (index + 1).toString(),
            map: !algorithm ? mapRef : null,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 3,
            },
            optimized: true,
          });
          infoWindow = new google.maps.InfoWindow();
          taxiMarkers.push(newTaxi);
          taxiMarkers[index].addListener("mouseover", () => {
            infoWindow.close();

            queryID = taxiMarkers[index].getTitle();

            getTaxi(queryID, (taxi: any) => {
              getDriver(queryID, (driver: any) => {
                infoWindow.setContent(`
                  <b>Driver</b><br />
                  DriverID: ${driver.driverID} <br />
                  DriverName: ${driver.driverName} <br />
                  DriverPhone: ${driver.phoneNumber} <br />
                  DriverRating: ${driver.rating} <br />
                  <br /> <hr /> <br />
                  <b>Taxi</b><br />
                  SNO: ${taxi.sno} <br />
                  TaxiNumber: ${taxi.taxiNumber} <br />
                  TaxiType: ${taxi.taxiType}
                `);
                infoWindow.open(mapRef, taxiMarkers[index]);
              });
            });
          });
          return newTaxi;
        });

        if (!algorithm) return;

        markerCluster = new MarkerClusterer({
          map: mapRef,
          markers: markers,
          algorithm: algorithm,
        });
      });
  };

  const clearTaxis = () => {
    if (taxiMarkers.length !== 0) {
      for (let i = 0; i < taxiMarkers.length; i++) {
        taxiMarkers[i].setMap(null);
      }
      taxiMarkers = [];
      markerCluster?.clearMarkers();
    }
  };

  const geofence = () => {
    rectangle.setMap(!showGeofence ? mapRef! : null);
    setShowGeofence(!showGeofence);

    ["bounds_changed", "dragend"].forEach((eventName) => {
      rectangle.addListener(eventName, () => {
        console.log({ bounds: rectangle.getBounds()?.toJSON(), eventName });
      });
    });
  };

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
        <div className="flex space-x-5 absolute bottom-0 left-0 m-5">
          <div className="dropup">
            <button>Cluster Algorithms</button>
            <div className="dropup-content">
              <a onClick={useNoop}>None</a>
              <a onClick={useGrid}>Sparse</a>
              <a onClick={useSuper}>Dense</a>
            </div>
          </div>
          <button onClick={clearTaxis}>Hide Taxis</button>
          <button onClick={useTraffic}>Toggle Traffic</button>
          <button onClick={geofence}>Geofencing</button>
        </div>
      </div>
    </LoadScriptNext>
  );
}
