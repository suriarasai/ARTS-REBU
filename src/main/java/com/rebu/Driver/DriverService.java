// Processes the data received by APIs and/or queries the database

package com.rebu.Driver;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rebu.Booking.Booking;
import com.rebu.Booking.BookingRepository;

@Service
public class DriverService {

    // Database object for accessing data
    @Autowired
    private DriverRepository DriverRepository;

    // (unused) API: Returns all drivers
    public List<Driver> getAllDrivers() {
        return DriverRepository.findAll();
    }

    // API: Find driver by ID
    public Driver getByDriverID(Integer _id) {
        return DriverRepository.findByDriverID(_id);
    }

    // API: Adds a new driver
    public Driver createDriver(Driver data) {

        // Auto-incrementing driverID
        Driver prevDriver = DriverRepository.findFirstByOrderByDriverIDDesc();
        Integer DriverID = prevDriver == null ? 1 : prevDriver.getDriverID() + 1;

        Driver Driver = DriverRepository.insert(new Driver(DriverID));
        Driver.setDriver(data);
        DriverRepository.save(Driver);

        return Driver;
    }

    // API: Sets the driver's rating
    public String setRating(Driver data) {
        Driver Driver = DriverRepository.findByDriverID(data.getDriverID());
        Driver.setRating(data.getRating());
        DriverRepository.save(Driver);
        return null;
    }

}