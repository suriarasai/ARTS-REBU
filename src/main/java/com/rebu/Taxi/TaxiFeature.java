// Sub-component for the Taxi object. Details physical specifications of the taxi

package com.rebu.Taxi;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TaxiFeature {
    /*
     * @param taxiMakeModel             : vehicle make (ex. Honda Civic 2000)
     * @param taxiPassengerCapacity     : available seats
     * @param taxiColor                 : vehicle color
     */
    private String taxiMakeModel;
    private Integer taxiPassengerCapacity;
    private String taxiColor;

    public TaxiFeature() {
    }

    // Setter
    public void SetFeatures(String TaxiMakeModel, Integer TaxiPassengerCapacity, String TaxiColor) {
        this.taxiMakeModel = TaxiMakeModel;
        this.taxiPassengerCapacity = TaxiPassengerCapacity;
        this.taxiColor = TaxiColor;
    }

    // Setter
    public void SetFeatures(TaxiFeature _features) {
        this.taxiMakeModel = _features.taxiMakeModel;
        this.taxiPassengerCapacity = _features.taxiPassengerCapacity;
        this.taxiColor = _features.taxiColor;
    }
}