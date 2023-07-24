import { Location } from "@/types";

export default function AddMarker(
  map: google.maps.Map,
  place: Location,
  image: any
) {
  return new google.maps.Marker({
    position: { lat: place.lat as number, lng: place.lng as number },
    map: map,
    icon: {
      url: image,
      scaledSize: new google.maps.Size(30, 30),
    },
  });
}
