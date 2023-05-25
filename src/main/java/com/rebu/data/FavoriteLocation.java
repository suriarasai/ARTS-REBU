package com.rebu.data;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class FavoriteLocation {
    private String name;
    private String address;
    private ArrayList<Float> coordinates;

    public FavoriteLocation() {
    }

    public void setLocation(String name, String address, ArrayList<Float> coordinates) {
        this.name = name;
        this.address = address;
        this.coordinates = coordinates;
    }

}
