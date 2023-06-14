// Defines API endpoints for MongoDB and receives data from POST requests for processing

package com.rebu.Customer;

import java.util.List;
import java.util.Map;

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

import com.rebu.Location;

@RestController
@RequestMapping("/api/v1/Customer") // Access DB through this URL
@CrossOrigin(origins = "*") // Cross origins due to app running on 3000 but server running on 8080
public class CustomerController {

    // Functions that pre-process the data before sending it back to the user
    @Autowired
    private CustomerService query;

    // GET: Returns all users and their associated data
    @GetMapping
    public ResponseEntity<List<Customer>> getAllUsers() {
        return new ResponseEntity<List<Customer>>(query.allCustomers(), HttpStatus.OK);
    }

    // GET: Returns a single user based on their id
    @GetMapping("/{_id}")
    public ResponseEntity<Customer> getSingleUser(@PathVariable Integer _id) {
        return new ResponseEntity<Customer>(query.singleCustomer(_id), HttpStatus.OK);
    }

    // POST: Checks whether a user exists by their mobile number
    @PostMapping("/exists")
    public ResponseEntity<Customer> getByPhoneNumber(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Customer>(
                query.findByPhoneNumber(payload.get("phoneNumber"), payload.get("phoneCountryCode")),
                HttpStatus.OK);
    }

    // POST: (Not used) Upserts (update/insert if non-existant) users based on
    // mobile number
    @PostMapping("/signIn")
    public ResponseEntity<Integer> signInWithPhoneNumber(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Integer>(
                query.signInWithPhoneNumber(payload.get("phoneCountryCode"), payload.get("phoneNumber")),
                HttpStatus.OK);
    }

    // POST: Creates a new user
    @PostMapping
    public ResponseEntity<Customer> createUser(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Customer>(
                query.createCustomer(payload.get("phoneCountryCode"), payload.get("phoneNumber")), HttpStatus.CREATED);
    }

    // POST: Registers a new user by adding information to existing users
    @PostMapping("/updateUser")
    public ResponseEntity<Customer> updateUser(@RequestBody Map<String, String> payload) {

        return new ResponseEntity<Customer>(
                query.updateCustomer(
                        payload.get("customerName"),
                        payload.get("memberCategory"),
                        payload.get("age"),
                        payload.get("gender"),
                        payload.get("contactTitle"),
                        payload.get("countryCode"),
                        payload.get("email"),
                        payload.get("password"),
                        payload.get("phoneCountryCode"),
                        payload.get("phoneNumber"),
                        payload.get("customerID")),
                HttpStatus.OK);
    }

    // POST: Checks a user's password matches by querying their email for the
    // associated password
    @PostMapping("/validateCredentials")
    public ResponseEntity<Customer> validateCredentials(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Customer>(
                query.signInWithEmail(payload.get("email"),
                        payload.get("password")),
                HttpStatus.OK);
    }

    // // Sets the home location to a coordinate pair [lat, lng]
    // @PostMapping("/setHome")
    // public ResponseEntity<String> setHome(@RequestBody Location payload) {
    //     return new ResponseEntity<String>(
    //             query.setHome(payload.getId(), payload.getHome(), payload.getHomeName()),
    //             HttpStatus.OK);
    // }

    // // Sets the work location to a coordinate pair [lat, lng]
    // @PostMapping("/setWork")
    // public ResponseEntity<String> setWork(@RequestBody Location payload) {
    //     return new ResponseEntity<String>(
    //             query.setWork(payload.getId(), payload.getWork(), payload.getWorkName()),
    //             HttpStatus.OK);
    // }

    // // Adds a favorite location
    // @PostMapping("/addSavedLocation")
    // public ResponseEntity<String> addSavedLocation(@RequestBody Location SavedLocation) {
    //     return new ResponseEntity<String>(
    //             query.AddFavoriteLocation(SavedLocation),
    //             HttpStatus.OK);
    // }

    // // Removes a favorite location
    // @PostMapping("/removeFavoriteLocation")
    // public ResponseEntity<String> removeFavoriteLocation(@RequestBody Location payload) {
    //     return new ResponseEntity<String>(
    //             query.removeFavoriteLocation(payload.getId(), payload.getName()),
    //             HttpStatus.OK);
    // }
}
