package com.rebu.Kafka.Models;

import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "Kafka")
public class ChatEvent {
    String recipientID; // 'd' for driver, 'c' for customer + ID
    String type; // chat | cancelTrip | arrivedToUser | arrivedToDestination
    String body;
}
