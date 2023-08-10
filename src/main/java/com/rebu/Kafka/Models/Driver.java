package com.rebu.Kafka.Models;

import lombok.Data;

@Data
public class Driver implements Comparable<Driver> {
    Double distance;
    Integer driverID;
    Double lng;
    Double lat;

    public Driver(Double distance, Integer driverID, Double lng, Double lat) {
        this.distance = distance;
        this.driverID = driverID;
        this.lng = lng;
        this.lat = lat;
    }

    @Override
    public int compareTo(Driver driver) {
        return Double.compare(this.distance, driver.distance);
    }
}
