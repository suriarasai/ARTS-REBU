// Data class for defining a schema to use in APIs involving location data (ex. saved/favorite locations)

package com.rebu;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "Customer")
@Data
@AllArgsConstructor
public class LocationInterface {
    private Integer customerID;
    private Location location;
    // private String placeID;
    // private Float lat;
    // private Float lng;
    // private Integer postcode;
    // private String address;
    // private String placeName;

    public LocationInterface() {
    }

}