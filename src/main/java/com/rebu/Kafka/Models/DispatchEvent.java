package com.rebu.Kafka.Models;

import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "Kafka")
public class DispatchEvent {
    Integer customerID;
    String customerName;
    Integer customerPhoneNumber;
    String status;
    Integer tmdtid;
    String taxiNumber;
    Integer taxiPassengerCapacity;
    String taxiMakeModel;
    String taxiColor;
    Integer driverID;
    String driverName;
    Integer driverPhoneNumber;
    Integer sno;
    Double rating;
}
