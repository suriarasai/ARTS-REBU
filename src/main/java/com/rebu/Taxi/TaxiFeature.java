package com.rebu.Taxi;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TaxiFeature {
    private String taxiMakeModel;
    private Integer taxiPassengerCapacity;
    private String taxiColor;

    public TaxiFeature() {
    }

    public void SetFeatures(String TaxiMakeModel, Integer TaxiPassengerCapacity, String TaxiColor) {
        this.taxiMakeModel = TaxiMakeModel;
        this.taxiPassengerCapacity = TaxiPassengerCapacity;
        this.taxiColor = TaxiColor;
    }

    public void SetFeatures(TaxiFeature _features) {
        this.taxiMakeModel = _features.taxiMakeModel;
        this.taxiPassengerCapacity = _features.taxiPassengerCapacity;
        this.taxiColor = _features.taxiColor;
    }
}