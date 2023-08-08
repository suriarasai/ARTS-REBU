// Controller: Defines endpoints to receive stream data from the frontend

package com.rebu.Kafka;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import org.json.JSONArray;
import org.json.JSONObject;

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
    public List<List<Double>> findNearestTaxis(@RequestBody Map<String, String> payload) {
        // ArrayList<Double> nearbyTaxis = new ArrayList<Double>();

        producer.findNearestTaxis(payload.get("message"));
        
        // JSONObject obj = new JSONObject(result);

        // Object distances = obj.getJSONArray("features").get(0);
        // String test = obj.getJSONObject("geometry").getJSONArray("coordinates").toString();



        // System.out.println(obj);
        // System.out.println(distances);
        // System.out.println(test);
        // System.out.println(event.features[0].geometry.coordinates)

        return null;
    }
}
