package com.rebu.Driver;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/Driver")
@CrossOrigin(origins = "*")
public class DriverController {

    @Autowired
    private DriverService query;

    // (unused) GET: Returns all drivers
    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return new ResponseEntity<List<Driver>>(query.getAllDrivers(), HttpStatus.OK);
    }

    // GET: Query drivers by ID
    @GetMapping("/{_id}")
    public ResponseEntity<Driver> getByDriverID(@PathVariable Integer _id) {
        return new ResponseEntity<Driver>(query.getByDriverID(_id), HttpStatus.OK);
    }

    // POST: Add a new driver
    @PostMapping("/createDriver")
    public ResponseEntity<Driver> createDriver(@RequestBody Driver payload) {
        return new ResponseEntity<Driver>(
                query.createDriver(payload),
                HttpStatus.OK);
    }

    // POST: Set the driver's rating
    @PostMapping("/setRating")
    public ResponseEntity<String> setRating(@RequestBody Driver payload) {
        return new ResponseEntity<String>(
                query.setRating(payload),
                HttpStatus.OK);
    }

}