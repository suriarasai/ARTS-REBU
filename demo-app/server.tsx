import api from "@/axiosConfig";

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
