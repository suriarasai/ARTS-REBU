/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from "react";
import { GoogleMap, LoadScriptNext } from "@react-google-maps/api";
import Styles from "@/public/resources/maps.json";
import { getDirections } from "@/server";
import { polylineTrafficColors } from "@/types";

const libraries = ["places", "geometry"];
let polyline: google.maps.Polyline[] = [];
let markerFrom: google.maps.Marker;
let markerTo: google.maps.Marker;
let trafficLayer: any = null;

export default function Matching() {
  const [map, setMap] = useState<google.maps.Map>();
  const [tripStats, setTripStats] = useState({
    distance: 0,
    duration: 0,
    route: [] as google.maps.LatLng[],
  });
  const useTraffic = () =>
    trafficLayer.setMap(trafficLayer.getMap() ? null : map!);

  // On map load... set location to current location
  const loadMap = useCallback(function callback(gmap: google.maps.Map) {
    setMap(gmap);
    const originLocation = new google.maps.LatLng(1.292187, 103.7740251);
    const destinationLocation = new google.maps.LatLng(1.4392773, 103.773559);
    trafficLayer = new google.maps.TrafficLayer();

    setDirections(gmap, originLocation, destinationLocation);

    markerFrom = new google.maps.Marker({
      position: originLocation,
      draggable: true,
      map: gmap,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 15,
        fillColor: "#ca8a04",
        fillOpacity: 1,
        strokeWeight: 0,
      },
      label: {
        text: "A",
        color: "white",
        fontSize: "14",
      },
    });

    markerTo = new google.maps.Marker({
      position: destinationLocation,
      draggable: true,
      map: gmap,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 15,
        fillColor: "#ca8a04",
        fillOpacity: 1,
        strokeWeight: 0,
      },
      label: {
        text: "B",
        color: "white",
        fontSize: "14",
      },
    });

    google.maps.event.addListener(markerFrom, "dragend", function () {
      setDirections(
        gmap as google.maps.Map,
        markerFrom.getPosition() as google.maps.LatLng,
        markerTo.getPosition() as google.maps.LatLng
      );
    });

    google.maps.event.addListener(markerTo, "dragend", function () {
      setDirections(
        gmap as google.maps.Map,
        markerFrom.getPosition() as google.maps.LatLng,
        markerTo.getPosition() as google.maps.LatLng
      );
    });

    gmap.panTo(originLocation);
    gmap.setZoom(15);
  }, []);

  const setDirections = (
    map: google.maps.Map,
    origin: google.maps.LatLng,
    destination: google.maps.LatLng
  ) => {
    polyline.length > 0 && clear();
    getDirections(origin, destination, (res: any) => {
      setTripStats({
        distance: res.distanceMeters,
        duration: Number(res.duration.match(/\d+/)[0]),
        route: google.maps.geometry.encoding.decodePath(
          res.polyline.encodedPolyline
        ),
      });
      renderDirections(map!, res);
    });
  };

  const renderDirections = async (map: google.maps.Map, encodedPath: any) => {
    const path = google.maps.geometry.encoding.decodePath(
      encodedPath.polyline.encodedPolyline
    );

    const intervals = encodedPath.travelAdvisory.speedReadingIntervals;
    let routePolyline: google.maps.Polyline[] = [];

    intervals.map((segment: any) => {
      const segmentPolyline = new google.maps.Polyline({
        path: path.slice(
          segment.startPolylinePointIndex,
          segment.endPolylinePointIndex + 1
        ),
        strokeColor: (polylineTrafficColors as any)[segment.speed],
        strokeOpacity: 1,
        strokeWeight: 6,
      });
      segmentPolyline.setMap(map);

      routePolyline.push(segmentPolyline);
    });

    polyline = routePolyline;
  };

  const clear = () => {
    for (let i = 0; i < polyline.length; i++) {
      polyline[i].setMap(polyline[i].getMap() ? null : map!);
    }
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
          <div className="absolute top-0 left-0 m-5 mt-20 space-y-3 flex flex-col">
            <button disabled className="bg-green-500 text-white">
              Drag and drop the markers!
            </button>
            <button disabled className="bg-green-300">
              <p>{(tripStats.distance / 1000).toFixed(1) + " km."}</p>
            </button>
            <button disabled className="bg-green-300">
              <p>{(tripStats.duration / 60).toFixed(2) + " min."}</p>
            </button>
          </div>
          <div className="flex space-x-5 absolute bottom-0 left-0 m-5">
            <button onClick={useTraffic}>Toggle Traffic Layer</button>
            <button onClick={clear}>Toggle Polyline</button>
          </div>
        </div>
      </LoadScriptNext>
    </>
  );
}
