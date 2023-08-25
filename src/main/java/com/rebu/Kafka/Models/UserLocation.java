package com.rebu.Kafka.Models;

import com.rebu.Location;

import lombok.Data;

@Data
public class UserLocation {
    Float lat;
    Float lng;
    Integer n;

    public UserLocation(Float lat, Float lng, Integer n) {
        this.lat = lat;
        this.lng = lng;
        this.n = n != null ? n : 6;
    }

    public UserLocation(Location loc) {
        this.lat = loc.getLat();
        this.lng = loc.getLng();
        this.n = 6;
    }
}
