// Defines API endpoints for MongoDB and receives data from POST requests for processing

package com.rebu.Booking;

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
@RequestMapping("/api/v1/Booking") // Access DB through this URL
// TODO: Remove CrossOrigin
@CrossOrigin(origins = "*") // Cross origins due to app running on 3000 but server running on 8080
public class BookingController {

    // Functions that pre-process the data before sending it back to the user
    @Autowired
    private BookingService query;

    // (unused) GET: Returns all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return new ResponseEntity<List<Booking>>(query.getAllBookings(), HttpStatus.OK);
    }

    // (unused) GET: Returns a single booking based on booking ID
    @GetMapping("/{_id}")
    public ResponseEntity<Booking> getByBookingID(@PathVariable Integer _id) {
        return new ResponseEntity<Booking>(query.getByBookingID(_id), HttpStatus.OK);
    }

    // (unused) GET: Returns all bookings associated with a taxi driver
    @GetMapping("/driver/{_id}")
    public ResponseEntity<List<Booking>> getByDriverID(@PathVariable Integer _id) {
        return new ResponseEntity<List<Booking>>(query.getByDriverID(_id), HttpStatus.OK);
    }

    // (unused) GET: Returns all bookings associated with a taxi driver
    @GetMapping("/taxi/{_id}")
    public ResponseEntity<List<Booking>> getByTaxiID(@PathVariable Integer _id) {
        return new ResponseEntity<List<Booking>>(query.getByTaxiID(_id), HttpStatus.OK);
    }

    // GET: Returns all bookings associated with a user
    @GetMapping("/customer/{_id}")
    public ResponseEntity<List<Booking>> getByCustomerID(@PathVariable Integer _id) {
        return new ResponseEntity<List<Booking>>(query.getByCustomerID(_id), HttpStatus.OK);
    }

    // POST: Create a new booking (ie. requesting a taxi)
    @PostMapping("/createBooking")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking payload) {
        return new ResponseEntity<Booking>(
                query.createBooking(payload),
                HttpStatus.OK);
    }

    // POST: Match a customer to a driver/taxi (ie. driver approves a request)
    @PostMapping("/matchedBooking")
    public ResponseEntity<String> matchedBooking(@RequestBody Booking payload) {
        return new ResponseEntity<String>(
                query.matchedBooking(payload),
                HttpStatus.OK);
    }

    // Cancelled
    @PostMapping("/cancelBooking")
    public ResponseEntity<String> cancelBooking(@RequestBody Booking payload) {
        return new ResponseEntity<String>(
                query.cancelBooking(payload),
                HttpStatus.OK);
    }

    // Completed
    @PostMapping("/completeBooking")
    public ResponseEntity<String> completeBooking(@RequestBody Booking payload) {
        return new ResponseEntity<String>(
                query.completeBooking(payload),
                HttpStatus.OK);
    }

}