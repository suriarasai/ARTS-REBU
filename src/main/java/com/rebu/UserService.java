// Processes the data received by APIs and/or queries the database

package com.rebu;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.rebu.data.Activity;
import com.rebu.data.Reviews_About_Customer;
import com.rebu.data.Reviews_From_Customer;
import com.rebu.data.Reward_History;
import com.rebu.data.Saved_Locations;
import com.rebu.data.User;

@Service
public class UserService {

    // Database object for accessing data
    @Autowired
    private UserRepository userRepository;

    // Built-in method to reduce boilerplate code when operating on DB
    @Autowired
    private MongoTemplate mongoTemplate;

    // API: Returns all users and their associated data
    public List<User> allUsers() {
        return userRepository.findAll();
    }

    // API: Returns a single user based on their id
    public Optional<User> singleUser(ObjectId _id) {
        return userRepository.findById(_id);
    }

    // API: Creates a new user
    public User createUser(String countryCode, String mobileNumber) {
        User user = userRepository.insert(new User(Integer.parseInt(countryCode), mobileNumber));
        return user;
    }

    // API: Registers a new user by adding information to existing users
    public Optional<User> registerUser(String _id, String firstName, String last_name, String prefix,
            String birthdate, String email, String password) {
        Update update = new Update();
        update.set("firstName", firstName);
        update.set("lastName", last_name);
        update.set("prefix", prefix);
        update.set("birthdate", birthdate);
        update.set("email", email);
        update.set("password", password);
        // update.set("activity", new Activity());
        // update.set("saved_locations", new Saved_Locations());
        // update.set("favorite_locations",
        // Arrays.asList(favorite_locations.replaceAll("[\\[\\](){}]", "").split("\\,
        // ")));
        // update.set("reward_history", new Reward_History());
        // update.set("reviews_about_customer", new Reviews_About_Customer);
        // update.set("reviews_from_customer", new Reviews_From_Customer());

        ObjectId id = new ObjectId(_id);

        mongoTemplate.update(User.class)
                .matching(Criteria.where("_id").is(id))
                .apply(update)
                .first();

        return userRepository.findById(id);
    }

    // API: Finds a user by their mobile number
    public User findByMobileNumber(String mobileNumber) {
        return userRepository.findFirstByMobileNumber(mobileNumber);
    }

    // API: (Not used) Upserts (update/insert if non-existant) users based on mobile
    // number
    public String signInWithMobileNumber(String mobileNumber, String countryCode) {

        Query query = new Query();
        query.addCriteria(Criteria.where("mobileNumber").is(mobileNumber));
        Update update = new Update();
        update.set("mobileNumber", mobileNumber);
        update.set("countryCode", Integer.parseInt(countryCode));
        mongoTemplate.upsert(query, update, User.class);

        return userRepository.findFirstByMobileNumber(mobileNumber).getId();
    }
}
