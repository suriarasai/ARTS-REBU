// Taxi object to store physical and logistic information associated with a certain vehicle

package com.rebu.Taxi;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Taxi")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Taxi {
    /*
     * @param taxiNumber : main ID parameter for querrying
     * 
     * @param sno : serial number
     * 
     * @param taxiType : type of vehicle (car/van/etc.)
     * 
     * @param tmdtid : vehicle identification number for corporate use
     * 
     * @param taxiFeature : physical features (make, color, seats, etc.)
     * 
     * @param RegisterdDrivers : logistic features (driver information)
     */
    @Id
    ObjectId _id;
    String taxiNumber;
    Integer sno;
    String taxiType;
    String tmdtid;
    TaxiFeature taxiFeature = new TaxiFeature();
    List<RegisteredDriver> registeredDrivers = new ArrayList<RegisteredDriver>();

    public Taxi(Integer sno) {
        this.sno = sno;
    }

    // Add or update a taxi
    public void UpsertTaxi(Taxi data) {
        this.taxiNumber = data.taxiNumber;
        this.taxiType = data.taxiType;
        this.tmdtid = data.tmdtid;
        this.taxiFeature.SetFeatures(data.taxiFeature);
    }

    // Associate a new driver to the vehicle
    public void RegisterDriver(RegisteredDriver data) {
        RegisteredDriver _driver = new RegisteredDriver();
        _driver.SetDriver(data);
        this.registeredDrivers.add(_driver);
    }

}
