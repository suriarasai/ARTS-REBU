package com.rebu.Taxi;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "customers")
@AllArgsConstructor
@Data
public class Taxi {
    @Id
    String taxiNumber;
    Integer sno;
    String taxiType;
    String tmdtid;
    TaxiFeature taxiFeature = new TaxiFeature();
    List<RegisteredDriver> RegisteredDrivers = new ArrayList<RegisteredDriver>();

    public Taxi() {
    }

    public void UpsertTaxi(String taxiNumber, Integer sno, String taxiType, String tmdtid, TaxiFeature taxiFeature) {
        this.taxiNumber = taxiNumber;
        this.sno = sno;
        this.taxiType = taxiType;
        this.tmdtid = tmdtid;
        this.taxiFeature.SetFeatures(taxiFeature);
    }

    public void RegisterDriver(Integer DriverID, String DriverName, Integer DriverPhone) {
        RegisteredDriver _driver = new RegisteredDriver();
        _driver.SetDriver(DriverID, DriverName, DriverPhone);
        this.RegisteredDrivers.add(_driver);
    }

}
