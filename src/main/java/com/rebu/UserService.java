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

    // API: Registers/Updates a user by adding information to existing users
    public Optional<User> updateUser(String _id, String firstName, String last_name, String prefix,
            String birthdate, String email, String password, String countryCode, String mobileNumber) {
        Update update = new Update();
        update.set("firstName", firstName);
        update.set("lastName", last_name);
        update.set("prefix", prefix);
        update.set("birthdate", birthdate);
        update.set("email", email);
        update.set("password", password);

        if (mobileNumber != null && countryCode != null) {
            update.set("countryCode", countryCode);
            update.set("mobileNumber", mobileNumber);
        }

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

    // API: (Not used) Upserts (update/insert if non-existant) users by mobile #
    public String signInWithMobileNumber(String mobileNumber, String countryCode) {

        Query query = new Query();
        query.addCriteria(Criteria.where("mobileNumber").is(mobileNumber));
        Update update = new Update();
        update.set("mobileNumber", mobileNumber);
        update.set("countryCode", Integer.parseInt(countryCode));
        mongoTemplate.upsert(query, update, User.class);

        User user = userRepository.findFirstByMobileNumber(mobileNumber);

        if (user.getId() != null) {
            user.addSignInTime(); // Adds a Sign-in timestamp
        }

        return user.getId();
    }

    // API: Return user password/credential
    public User signInWithEmail(String email, String password) {

        User user = userRepository.findFirstByEmail(email);

        if (user != null && user.getPassword().equals(password)) {
            user.addSignInTime(); // Adds a Sign-in timestamp
            return user;
        } else {
            return null;
        }

    }
    
    public String addSignOutTime(String mobileNumber) {
        User user = userRepository.findFirstByMobileNumber(mobileNumber);
        user.addSignOutTime();
        userRepository.save(user);

        return "Done";
    }

    public List<String> getSignOutTimes(String mobileNumber) {
        User user = userRepository.findFirstByMobileNumber(mobileNumber);
        return user.getSignOutTimes();
    }

    public List<String> getSignInTimes(String mobileNumber) {
        User user = userRepository.findFirstByMobileNumber(mobileNumber);
        return user.getSignInTimes();
    }
    
}
