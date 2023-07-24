import api from "@/axiosConfig";

export async function produceKafkaDispatchEvent(message: string) {
  api.post("/api/v1/Kafka/dispatchEvent", {
    message: message,
  });
}

export async function produceKafkaTaxiLocatorEvent(message: string) {
  api.post("/api/v1/Kafka/taxiLocatorEvent", {
    message: message,
  });
}

export const getDriver = async (driverID: number, _callback: Function) => {
  try {
    const response = await api.get("/api/v1/Driver/" + driverID);
    _callback(response.data);
  } catch (e) {
    console.log(e);
    _callback(null);
  }
};

// TODO: Logic error: Assumes driverID = taxiID instead of performing a search
export const getTaxi = async (driverID: number, _callback: Function) => {
  try {
    const response = await api.get("/api/v1/Taxi/" + driverID);
    _callback(response.data);
  } catch (e) {
    console.log(e);
    _callback(null);
  }
};

