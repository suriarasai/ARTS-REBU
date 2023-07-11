// Defines API endpoints for MongoDB and receives data from POST requests for processing

package com.rebu.Taxi;

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
@RequestMapping("/api/v1/Taxi") // Access DB through this URL
@CrossOrigin(origins = "*") // Cross origins due to app running on 3000 but server running on 8080
public class TaxiController {

    // Functions that pre-process the data before sending it back to the user
    @Autowired
    private TaxiService query;

    // (unused) GET: Returns all Taxis
    @GetMapping
    public ResponseEntity<List<Taxi>> getAllTaxis() {
        return new ResponseEntity<List<Taxi>>(query.getAllTaxis(), HttpStatus.OK);
    }

    // GET: Returns a single Taxi based on Taxi ID
    @GetMapping("/{_id}")
    public ResponseEntity<Taxi> getByTaxiID(@PathVariable Integer _id) {
        return new ResponseEntity<Taxi>(query.getByTaxiID(_id), HttpStatus.OK);
    }

    // POST: Add a new taxi
    @PostMapping("/addTaxi")
    public ResponseEntity<Taxi> addTaxi(@RequestBody Taxi payload) {
        return new ResponseEntity<Taxi>(
                query.createTaxi(payload),
                HttpStatus.OK);
    }

    // POST: Register a driver with the vehicle
    @PostMapping("/registerDriver")
    public ResponseEntity<String> registerDriver(@RequestBody Taxi payload) {
        return new ResponseEntity<String>(
                query.addDriver(payload),
                HttpStatus.OK);
    }

}