// Consumer: Reads the data from the Kafka stream

package com.rebu.Kafka;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.rebu.Kafka.Models.BookingEvent;
import com.rebu.Kafka.Models.ChatEvent;
import com.rebu.Kafka.Models.DispatchEvent;
import com.rebu.Kafka.Models.Driver;
import com.rebu.Kafka.Models.UserLocation;

@Service
public class ConsumerService {

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    ProducerService producer;

    @KafkaListener(topics = "bookingEvent", groupId = "rebu")
    public void bookingConsumer(String receivedMessage) {
        System.out.println("Booking Event: " + receivedMessage + " @ " + Instant.now().toEpochMilli());

        Gson gson = new Gson();
        BookingEvent event = gson.fromJson(receivedMessage, BookingEvent.class);

        List<Driver> drivers = producer.findNearestTaxis(new UserLocation(event.getPickUpLocation()));

        for (Driver driver : drivers) {
            this.template.convertAndSendToUser("d" + driver.getDriverID().toString(), "/queue/bookingEvent",
                    receivedMessage);
        }

        System.out.println(drivers);
    }

    @KafkaListener(topics = "dispatchEvent", groupId = "rebu")
    public void dispatchConsumer(String receivedMessage) {
        Gson gson = new Gson();
        DispatchEvent event = gson.fromJson(receivedMessage, DispatchEvent.class);
        System.out.println("Dispatch Event: " + event + " @ " + Instant.now().toEpochMilli());
        this.template.convertAndSendToUser("c" + event.getCustomerID().toString(), "/queue/dispatchEvent",
                receivedMessage);
    }

    @KafkaListener(topics = "taxiLocatorEvent", groupId = "rebu")
    public void taxiLocatorConsumer(String receivedMessage) {
        System.out.println("Taxi Location: " + receivedMessage + " @ " + Instant.now().toEpochMilli());
        this.template.convertAndSend("/topic/taxiLocatorEvent", receivedMessage);
    }

    @KafkaListener(topics = "chatEvent", groupId = "rebu")
    public void chatConsumer(String receivedMessage) {
        Gson gson = new Gson();
        ChatEvent event = gson.fromJson(receivedMessage, ChatEvent.class);
        System.out.println("Chat Event: " + event + " @ " + Instant.now().toEpochMilli());

        this.template.convertAndSendToUser(event.getRecipientID(), "/queue/chatEvent", receivedMessage);
    }
}
