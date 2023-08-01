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
