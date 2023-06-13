// Data class for defining a schema to use in APIs involving location data (ex. saved/favorite locations)

package com.rebu;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Location {
    private String PlaceID;
    private Float lat;
    private Float lng;
    private Integer Postcode;
    private String Address;
    private String PlaceName;

    public Location() {
    }

    public void SetLocation(String PlaceID, Float lat, Float lng, Integer Postcode, String Address,
            String PlaceName) {
        this.PlaceID = PlaceID;
        this.lat = lat;
        this.lng = lng;
        this.Postcode = Postcode;
        this.Address = Address;
        this.PlaceName = PlaceName;
    }

    public void SetLocation(Location _place) {
        this.PlaceID = _place.PlaceID;
        this.lat = _place.lat;
        this.lng = _place.lng;
        this.Postcode = _place.Postcode;
        this.Address = _place.Address;
        this.PlaceName = _place.PlaceName;
    }
}