package com.rebu.Taxi;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisteredDriver {
    @Id
    Integer DriverID;
    String DriverName;
    Integer DriverPhone;

    public RegisteredDriver() {
    }

    public void SetDriver(Integer DriverID, String DriverName, Integer DriverPhone) {
        this.DriverID = DriverID;
        this.DriverName = DriverName;
        this.DriverPhone = DriverPhone;
    }

    public void SetDriver(RegisteredDriver _driver) {
        this.DriverID = _driver.DriverID;
        this.DriverName = _driver.DriverName;
        this.DriverPhone = _driver.DriverPhone;
    }
}