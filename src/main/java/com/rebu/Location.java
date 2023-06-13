// Data class for defining a schema to use in APIs involving location data (ex. saved/favorite locations)

package com.rebu;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Location {
    private String placeID;
    private Float lat;
    private Float lng;
    private Integer postcode;
    private String address;
    private String placeName;

    public Location() {
    }

    public void SetLocation(String placeID, Float lat, Float lng, Integer postcode, String address,
            String placeName) {
        this.placeID = placeID;
        this.lat = lat;
        this.lng = lng;
        this.postcode = postcode;
        this.address = address;
        this.placeName = placeName;
    }

    public void SetLocation(Location _place) {
        this.placeID = _place.placeID;
        this.lat = _place.lat;
        this.lng = _place.lng;
        this.postcode = _place.postcode;
        this.address = _place.address;
        this.placeName = _place.placeName;
    }
}