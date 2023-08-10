// Producer: Sends the message to the Kafka stream

package com.rebu.Kafka;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

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

}
