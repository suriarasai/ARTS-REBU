// Data class for defining a schema to use in APIs involving location data (ex. saved/favorite locations)

package com.rebu.data.interfaces;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LocationInterface {
    private String MobileNumber;
    private String name;
    private String address;
    private ArrayList<Float> coordinates;
    private ArrayList<Float> work;
    private String workName;
    private ArrayList<Float> home;
    private String homeName;

    public LocationInterface() {
    }
}