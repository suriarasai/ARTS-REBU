// Controller: Defines endpoints to receive stream data from the frontend

package com.rebu.Kafka;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;
import com.rebu.Kafka.Models.Driver;
import com.rebu.Kafka.Models.GeoJson;
import com.rebu.Kafka.Models.UserLocation;

@RestController
@RequestMapping("/api/v1/Kafka")
@CrossOrigin(origins = "*")
public class KafkaController {

    @Autowired
    ProducerService producer;

    @PostMapping("/bookingEvent")
    public void getBookingEvent(@RequestBody Map<String, String> payload) {
        producer.bookingProducer(payload.get("message"));
    }

    @PostMapping("/dispatchEvent")
    public void getDispatchEvent(@RequestBody Map<String, String> payload) {
        producer.dispatchProducer(payload.get("message"));
    }

    @PostMapping("/taxiLocatorEvent")
    public void getTaxiLocatorEvent(@RequestBody Map<String, String> payload) {
        producer.taxiLocatorProducer(payload.get("message"));
    }

    @PostMapping("/chatEvent")
    public void getChatEvent(@RequestBody Map<String, String> payload) {
        producer.chatProducer(payload.get("message"));
    }

    @PostMapping("/findNearestTaxis")
    public List<Driver> findNearestTaxis(@RequestBody UserLocation user) {

        // Calling taxi availability API and parsing response as string
        String uri = "https://api.data.gov.sg/v1/transport/taxi-availability";
        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(uri, String.class);

        // Parsing the response as an object and extracting the taxi locations as
        // List<List<Double>>
        Gson gson = new Gson();
        GeoJson obj = gson.fromJson(result, GeoJson.class);
        List<List<Double>> taxis = obj.getFeatures().get(0).getGeometry().getCoordinates();

        // Computing the closest N=8 taxis
        List<Driver> driverList = new ArrayList<Driver>();
        Double distance;
        Integer index = 1;

        for (List<Double> taxi : taxis) {
            distance = Math.pow(taxi.get(0) - user.getLng(), 2) + Math.pow(taxi.get(1) - user.getLat(), 2);
            driverList.add(new Driver(distance, index, taxi.get(1), taxi.get(0)));
            index++;
        }

        Collections.sort(driverList);

        List<Driver> nearbyDrivers = driverList.subList(0, 8);       

        return nearbyDrivers;
    }
}
