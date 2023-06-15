// Location object for all data involving location data

package com.rebu;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "Customer")
@Data
@AllArgsConstructor
public class Location {
    /*
     * @param placeID   : unique ID returned by the Google Maps API
     * @param lat       : latitude
     * @param lng       : longitude
     * @param postcode  : postcode
     * @param address   : address
     * @param placeName : (optional) name of the building / institution 
     */
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