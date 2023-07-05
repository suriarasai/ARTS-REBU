package com.rebu.Taxi;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Document(collection = "Taxi")
public class RegisteredDriver {
    /*
     * @param driverID      : unique ID associated with a driver
     * @param driverName    : driver's name
     * @param driverPhone   : driver's phone number
     */
    @Id
    Integer driverID;
    String driverName;
    Integer driverPhone;

    public RegisteredDriver() {
    }

    // Setter
    public void SetDriver(Integer driverID, String driverName, Integer driverPhone) {
        this.driverID = driverID;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
    }

    // Setter
    public void SetDriver(RegisteredDriver _driver) {
        this.driverID = _driver.driverID;
        this.driverName = _driver.driverName;
        this.driverPhone = _driver.driverPhone;
    }
}