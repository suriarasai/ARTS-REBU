package com.rebu.data.interfaces;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LocationInterface {
    private String MobileNumber;
    private ArrayList<Float> work;
    private ArrayList<Float> home;

    public LocationInterface() {
    }
}