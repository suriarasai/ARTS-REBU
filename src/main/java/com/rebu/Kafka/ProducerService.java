// Producer: Sends the message to the Kafka stream

package com.rebu.Kafka;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;
import com.rebu.Kafka.Models.Driver;
import com.rebu.Kafka.Models.GeoJson;
import com.rebu.Kafka.Models.UserLocation;

@Service
public class ProducerService {

    @Autowired
    KafkaTemplate<String, String> kafkaTemplate;

    public void bookingProducer(String message) {
        kafkaTemplate.send("bookingEvent", message);
    }

    public void dispatchProducer(String message) {
        kafkaTemplate.send("dispatchEvent", message);
    }

    public void taxiLocatorProducer(String message) {
        kafkaTemplate.send("taxiLocatorEvent", message);
    }

    public void chatProducer(String message) {
        kafkaTemplate.send("chatEvent", message);
    }

    public List<Driver> findNearestTaxis(UserLocation user) {
        // Calling taxi availability API and parsing response as string
        String uri = "https://api.data.gov.sg/v1/transport/taxi-availability";
        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(uri, String.class);

        // Parsing the response as an object and extracting the taxi locations
        Gson gson = new Gson();
        GeoJson obj = gson.fromJson(result, GeoJson.class);
        List<List<Float>> taxis = obj.getFeatures().get(0).getGeometry().getCoordinates();

        // Computing the closest N=8 taxis
        List<Driver> driverList = new ArrayList<Driver>();
        Double distance;
        Integer index = 1;

        for (List<Float> taxi : taxis) {
            distance = Math.pow(taxi.get(0) - user.getLng(), 2) + Math.pow(taxi.get(1) - user.getLat(), 2);
            driverList.add(new Driver(distance, index, taxi.get(0), taxi.get(1)));
            index++;
        }

        Collections.sort(driverList);
        return driverList.subList(0, 6);
    }

}
