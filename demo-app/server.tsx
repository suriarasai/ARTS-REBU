import api from "@/axiosConfig";
import axios from "axios";

export async function produceKafkaBookingEvent(message: string) {
  api.post("/api/v1/Kafka/bookingEvent", {
    message: message,
  });
}

export async function produceKafkaDispatchEvent(message: string) {
  api.post("/api/v1/Kafka/dispatchEvent", {
    message: message,
  });
}

export async function produceKafkaChatEvent(message: string) {
  api.post("/api/v1/Kafka/chatEvent", {
    message: message,
  });
}

export async function produceKafkaTaxiLocatorEvent(message: string) {
  api.post("/api/v1/Kafka/taxiLocatorEvent", {
    message: message,
  });
}

// Retrieves taxi information based on the ID (sno)
export const getTaxi = async (sno: number, _callback: Function) => {
  const response = await api.get("/api/v1/Taxi/" + sno);
  _callback(response.data);
};

// Retrieves taxi information based on the ID (sno)
export const getDriver = async (id: number, _callback: Function) => {
  const response = await api.get("/api/v1/Driver/" + id);
  _callback(response.data);
};

export async function computeNearbyTaxis(coord: google.maps.LatLng, N: number, _callback: any) {
	const response = await api.post('/api/v1/Kafka/findNearestTaxis', {
		lat: coord.lat(),
		lng: coord.lng(),
    n: N
	})
	_callback(response.data)
}

export const getDirections = (
	origin: google.maps.LatLng,
	destination: google.maps.LatLng,
	callback: Function
) => {
	axios
		.post(
			`https://routes.googleapis.com/directions/v2:computeRoutes?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
			{
				origin: {
					location: {
						latLng: {
							latitude: origin.lat(),
							longitude: origin.lng(),
						},
					},
				},
				destination: {
					location: {
						latLng: {
							latitude: destination.lat(),
							longitude: destination.lng(),
						},
					},
				},
				travelMode: 'DRIVE',
				routingPreference: 'TRAFFIC_AWARE',
				computeAlternativeRoutes: false,
				extraComputations: ['TRAFFIC_ON_POLYLINE'],
				routeModifiers: {
					avoidTolls: false,
					avoidHighways: false,
					avoidFerries: false,
				},
				languageCode: 'en-US',
				units: 'IMPERIAL',
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'X-Goog-FieldMask':
						'routes.duration,routes.distanceMeters,routes.polyline,routes.legs.polyline,routes.travelAdvisory,routes.legs.travelAdvisory',
				},
			}
		)
		.then((response: any) => {
			callback(response.data.routes[0])
		})
}