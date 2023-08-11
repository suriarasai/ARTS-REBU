package com.rebu.Kafka.Models;

import com.rebu.Location;

import lombok.Data;

@Data
public class BookingEvent {
    Integer customerID;
    Long messageSubmittedTime;
    String customerName;
    String phoneNumber;
    String taxiType;
    String fareType;
    Double fare;
    Double distance;
    String paymentMethod;
    Double eta;
    Location pickUpLocation;
    Location dropLocation;
}
