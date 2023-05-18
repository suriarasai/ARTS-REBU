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
@RequestMapping("/api/v1/customers")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<List<User>>(userService.allUsers(), HttpStatus.OK);
    }

    @GetMapping("/{_id}")
    public ResponseEntity<Optional<User>> getSingleUser(@PathVariable ObjectId _id) {
        return new ResponseEntity<Optional<User>>(userService.singleUser(_id), HttpStatus.OK);
    }

    @PostMapping("/exists")
    public ResponseEntity<Optional<User>> getByMobileNumber(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Optional<User>>(
                userService.findByMobileNumber(payload.get("mobileNumber")),
                HttpStatus.OK);
    }

    @PostMapping("/signIn")
    public ResponseEntity<Optional<User>> signInWithMobileNumber(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Optional<User>>(
                userService.signInWithMobileNumber(payload.get("mobileNumber"), payload.get("countryCode")),
                HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<User>(
                userService.createUser(payload.get("countryCode"), payload.get("mobileNumber")), HttpStatus.CREATED);
    }

    @PostMapping("/update_user")
    public ResponseEntity<Optional<User>> modifyUser(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Optional<User>>(
                userService.modifyUser(payload.get("_id"),
                        payload.get("countryCode"),
                        payload.get("mobileNumber"),
                        payload.get("firstName"),
                        payload.get("lastName"),
                        payload.get("email"),
                        payload.get("password"),
                        payload.get("joinedDate"),
                        payload.get("rating"),
                        payload.get("rewardPoints"),
                        payload.get("favoriteLocations")),
                HttpStatus.OK);
    }

}
