package com.rebu.Kafka.Models;

import com.rebu.Location;

import lombok.Data;

@Data
public class UserLocation {
    Float lat;
    Float lng;

    public UserLocation(Float lat, Float lng) {
        this.lat = lat;
        this.lng = lng;
    }

    public UserLocation(Location loc) {
        this.lat = loc.getLat();
        this.lng = loc.getLng();
    }
}
