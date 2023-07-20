// Controller: Defines endpoints to receive stream data from the frontend

package com.rebu.Kafka;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
