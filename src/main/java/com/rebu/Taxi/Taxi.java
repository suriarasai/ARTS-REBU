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
    String TaxiNumber;
    Integer Sno;
    String TaxiType;
    String TMDTID;
    TaxiFeature TaxiFeature = new TaxiFeature();
    List<RegisteredDriver> RegisteredDrivers = new ArrayList<RegisteredDriver>();

    public Taxi() {
    }

    public void UpsertTaxi(String TaxiNumber, Integer Sno, String TaxiType, String TMDTID, TaxiFeature TaxiFeature) {
        this.TaxiNumber = TaxiNumber;
        this.Sno = Sno;
        this.TaxiType = TaxiType;
        this.TMDTID = TMDTID;
        this.TaxiFeature.SetFeatures(TaxiFeature);
    }

    public void RegisterDriver(Integer DriverID, String DriverName, Integer DriverPhone) {
        RegisteredDriver _driver = new RegisteredDriver();
        _driver.SetDriver(DriverID, DriverName, DriverPhone);
        this.RegisteredDrivers.add(_driver);
    }

}
