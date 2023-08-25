package com.rebu.Taxi;

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
    Integer driverID;
    String driverName;
    Integer driverPhone;

    public RegisteredDriver() {
    }

    // Setter
    public void SetDriver(RegisteredDriver _driver) {
        this.driverID = _driver.driverID;
        this.driverName = _driver.driverName;
        this.driverPhone = _driver.driverPhone;
    }
}