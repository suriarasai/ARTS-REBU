package com.rebu.Taxi;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TaxiFeature {
    private String TaxiMakeModel;
    private Integer TaxiPassengerCapacity;
    private String TaxiColor;

    public TaxiFeature() {
    }

    public void SetFeatures(String TaxiMakeModel, Integer TaxiPassengerCapacity, String TaxiColor) {
        this.TaxiMakeModel = TaxiMakeModel;
        this.TaxiPassengerCapacity = TaxiPassengerCapacity;
        this.TaxiColor = TaxiColor;
    }

    public void SetFeatures(TaxiFeature _features) {
        this.TaxiMakeModel = _features.TaxiMakeModel;
        this.TaxiPassengerCapacity = _features.TaxiPassengerCapacity;
        this.TaxiColor = _features.TaxiColor;
    }
}