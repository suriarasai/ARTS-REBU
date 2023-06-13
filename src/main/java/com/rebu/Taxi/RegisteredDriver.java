package com.rebu.Taxi;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisteredDriver {
    @Id
    Integer driverID;
    String driverName;
    Integer driverPhone;

    public RegisteredDriver() {
    }

    public void SetDriver(Integer driverID, String driverName, Integer driverPhone) {
        this.driverID = driverID;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
    }

    public void SetDriver(RegisteredDriver _driver) {
        this.driverID = _driver.driverID;
        this.driverName = _driver.driverName;
        this.driverPhone = _driver.driverPhone;
    }
}