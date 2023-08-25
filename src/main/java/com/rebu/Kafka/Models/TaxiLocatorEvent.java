package com.rebu.Kafka.Models;

import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "Kafka")
public class TaxiLocatorEvent {
    Integer tmdtid;
    Integer driverID;
    String taxiNumber;
    CurrentPosition currentPosition;
    Boolean availabilityStatus;
}

class CurrentPosition {
    Float lat;
    Float lng;
}