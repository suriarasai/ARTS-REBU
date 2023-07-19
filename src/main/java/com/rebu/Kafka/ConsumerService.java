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

    @KafkaListener(topics = "firsttopic", groupId = "rebu")
    public void listenToTopic(String receivedMessage) {
        System.out.println("Consumer: " + receivedMessage + " @ " + Instant.now().toEpochMilli());
        this.template.convertAndSend("/topic/bookingEvent", receivedMessage);
    }
}
