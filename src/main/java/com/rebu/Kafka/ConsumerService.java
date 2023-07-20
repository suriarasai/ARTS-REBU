// Consumer: Reads the data from the Kafka stream

package com.rebu.Kafka;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ConsumerService {

    @Autowired
    private SimpMessagingTemplate template;

    @KafkaListener(topics = "bookingEvent", groupId = "rebu")
    public void bookingConsumer(String receivedMessage) {
        System.out.println("Booking Event: " + receivedMessage + " @ " + Instant.now().toEpochMilli());
        this.template.convertAndSend("/topic/bookingEvent", receivedMessage);
    }

    @KafkaListener(topics = "dispatchEvent", groupId = "rebu")
    public void dispatchConsumer(String receivedMessage) {
        System.out.println("Dispatch Event: " + receivedMessage + " @ " + Instant.now().toEpochMilli());
        this.template.convertAndSend("/topic/dispatchEvent", receivedMessage);
    }

    @KafkaListener(topics = "taxiLocatorEvent", groupId = "rebu")
    public void taxiLocatorConsumer(String receivedMessage) {
        System.out.println("Taxi Location: " + receivedMessage + " @ " + Instant.now().toEpochMilli());
        this.template.convertAndSend("/topic/taxiLocatorEvent", receivedMessage);
    }
}
