package com.rebu.Kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class ConsumerService {

    @KafkaListener(topics = "firsttopic", groupId = "my-first-application")
    public void listenToTopic(String receivedMessage) {
        System.out.println("Received Message: " + receivedMessage);
    }
}
