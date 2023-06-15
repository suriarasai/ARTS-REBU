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

import com.rebu.LocationInterface;

@RestController
@RequestMapping("/api/v1/Customer") // Access DB through this URL
@CrossOrigin(origins = "*") // Cross origins due to app running on 3000 but server running on 8080
public class CustomerController {

    // Functions that pre-process the data before sending it back to the user
    @Autowired
    private CustomerService query;

    // (unused) GET: Returns all users and their associated data
    @GetMapping
    public ResponseEntity<List<Customer>> getAllUsers() {
        return new ResponseEntity<List<Customer>>(query.allCustomers(), HttpStatus.OK);
    }

    // (unused) GET: Returns a single user based on their customer id
    @GetMapping("/{_id}")
    public ResponseEntity<Customer> getSingleUser(@PathVariable Integer _id) {
        return new ResponseEntity<Customer>(query.singleCustomer(_id), HttpStatus.OK);
    }

    // POST: Checks whether a user exists by their mobile number
    // Used during initial sign in to see if a mobile number already exists - if not, then create the user
    @PostMapping("/exists")
    public ResponseEntity<Customer> getByPhoneNumber(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Customer>(
                query.findByPhoneNumber(payload.get("phoneNumber"), payload.get("phoneCountryCode")),
                HttpStatus.OK);
    }

    // (unused) POST: Upserts users based on mobile number
    @PostMapping("/signIn")
    public ResponseEntity<Integer> signInWithPhoneNumber(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Integer>(
                query.signInWithPhoneNumber(payload.get("phoneCountryCode"), payload.get("phoneNumber")),
                HttpStatus.OK);
    }

    // POST: Creates a new user
    // Used during sign in process if the user doesn't already exist
    @PostMapping
    public ResponseEntity<Customer> createUser(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Customer>(
                query.createCustomer(payload.get("phoneCountryCode"), payload.get("phoneNumber")), HttpStatus.CREATED);
    }

    // POST: Registers a new user by adding information to existing users
    // Used during the regisration process to append data to the customer profile
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

    // POST: Checks a user's password matches by querying their email for the associated password
    // Used during sign-in via email and password
    @PostMapping("/validateCredentials")
    public ResponseEntity<Customer> validateCredentials(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Customer>(
                query.signInWithEmail(payload.get("email"),
                        payload.get("password")),
                HttpStatus.OK);
    }

    // POST: Sets the home location
    // Used when setting home location in the saved location screen
    @PostMapping("/setHome")
    public ResponseEntity<String> setHome(@RequestBody LocationInterface payload) {
        return new ResponseEntity<String>(
                query.setHome(payload.getCustomerID(), payload.getLocation()),
                HttpStatus.OK);
    }

    // POST: Sets the work location
    // Used when setting work location in the saved location screen
    @PostMapping("/setWork")
    public ResponseEntity<String> setWork(@RequestBody LocationInterface payload) {
        return new ResponseEntity<String>(
                query.setWork(payload.getCustomerID(), payload.getLocation()),
                HttpStatus.OK);
    }

    // POST: Adds a favorite location
    // Used when setting a favorite location in the saved location screen
    @PostMapping("/addSavedLocation")
    public ResponseEntity<String> addSavedLocation(@RequestBody LocationInterface payload) {
        return new ResponseEntity<String>(
                query.addSavedLocation(payload.getLocation(), payload.getCustomerID()),
                HttpStatus.OK);
    }

    // POST: Removes a favorite location
    // Used when removing a saved location the saved location screen
    @PostMapping("/removeSavedLocation")
    public ResponseEntity<String> removeFavoriteLocation(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<String>(
                query.removeSavedLocation(payload.get("placeID"), payload.get("customerID")),
                HttpStatus.OK);
    }
}
