// Defines API endpoints for MongoDB and receives data from POST requests for processing

package com.rebu;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.bson.types.ObjectId;
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

import com.rebu.data.User;

@RestController
@RequestMapping("/api/v1/customers") // Access DB through this URL
@CrossOrigin(origins = "*") // Cross origins due to app running on 3000 but server running on 8080
public class UserController {

    // Functions that perform pre-processing/querying on data before sending it back
    // to the user
    @Autowired
    private UserService userService;

    // GET: Returns all users and their associated data
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<List<User>>(userService.allUsers(), HttpStatus.OK);
    }

    // GET: Returns a single user based on their id
    @GetMapping("/{_id}")
    public ResponseEntity<Optional<User>> getSingleUser(@PathVariable ObjectId _id) {
        return new ResponseEntity<Optional<User>>(userService.singleUser(_id), HttpStatus.OK);
    }

    // POST: Checks whether a user exists by their mobile number
    @PostMapping("/exists")
    public ResponseEntity<User> getByMobileNumber(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<User>(
                userService.findByMobileNumber(payload.get("mobileNumber")),
                HttpStatus.OK);
    }

    // POST: (Not used) Upserts (update/insert if non-existant) users based on
    // mobile number
    @PostMapping("/signIn")
    public ResponseEntity<String> signInWithMobileNumber(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<String>(
                userService.signInWithMobileNumber(payload.get("mobileNumber"), payload.get("countryCode")),
                HttpStatus.OK);
    }

    // POST: Creates a new user
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<User>(
                userService.createUser(payload.get("countryCode"), payload.get("mobileNumber")), HttpStatus.CREATED);
    }

    // POST: Registers a new user by adding information to existing users
    @PostMapping("/updateUser")
    public ResponseEntity<Optional<User>> updateUser(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Optional<User>>(
                userService.updateUser(payload.get("_id"),
                        payload.get("firstName"),
                        payload.get("lastName"),
                        payload.get("prefix"),
                        payload.get("birthdate"),
                        payload.get("email"),
                        payload.get("password"),
                        payload.get("countryCode"),
                        payload.get("mobileNumber")),
                HttpStatus.OK);
    }

    // POST: Checks a user's password matches by querying their email for the
    // associated password
    @PostMapping("/validateCredentials")
    public ResponseEntity<User> validateCredentials(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<User>(
                userService.signInWithEmail(payload.get("email"),
                        payload.get("password")),
                HttpStatus.OK);
    }

    // POST: Adds the current datetime to the arraylist of sign out times
    @PostMapping("/addSignOutTime")
    public ResponseEntity<String> addSignInTime(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<String>(
                userService.addSignOutTime(payload.get("mobileNumber")),
                HttpStatus.OK);
    }

    // GET: Returns the list of all sign in times
    @GetMapping("/getSignInTimes")
    public ResponseEntity<List<String>> getSignInTimes(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<List<String>>(
                userService.getSignInTimes(payload.get("mobileNumber")),
                HttpStatus.OK);
    }

    // GET: Returns the list of all sign out times
    @GetMapping("/getSignOutTimes")
    public ResponseEntity<List<String>> getSignOutTimes(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<List<String>>(
                userService.getSignInTimes(payload.get("mobileNumber")),
                HttpStatus.OK);
    }

    // Updates reward points by the given number
    @PostMapping("/updateRewardPoints")
    public ResponseEntity<String> updateRewardPoints(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<String>(
                userService.updateRewardPoints(payload.get("mobileNumber"), payload.get("newCount")),
                HttpStatus.OK);
    }

    // Sets the home location to a coordinate pair [lat, lng]
    @PostMapping("/setHome")
    public ResponseEntity<String> setHome(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<String>(
                userService.setHome(payload.get("mobileNumber"), payload.get("home")),
                HttpStatus.OK);
    }

    // Sets the home location to a coordinate pair [lat, lng]
    @PostMapping("/setWork")
    public ResponseEntity<String> setWork(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<String>(
                userService.setHome(payload.get("mobileNumber"), payload.get("work")),
                HttpStatus.OK);
    }
}
