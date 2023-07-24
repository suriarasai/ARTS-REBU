import { Location } from "@/types";

export default function AddMarker(
  map: google.maps.Map,
  place: google.maps.LatLng,
  image: any
) {
  return new google.maps.Marker({
    position: { lat: place.lat(), lng: place.lng() },
    map: map,
    icon: {
      url: image,
      scaledSize: new google.maps.Size(30, 30),
    },
  });
}
