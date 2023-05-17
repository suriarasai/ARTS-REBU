package com.rebu;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.rebu.data.User;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<User> allUsers() {
        return userRepository.findAll();
    }

    public Optional<User> singleUser(ObjectId _id) {
        return userRepository.findById(_id);
    }

    public User createUser(String country_code, String mobile_number) {
        User user = userRepository.insert(new User(Integer.parseInt(country_code), mobile_number));
        return user;
    }

    public Optional<User> modifyUser(String _id, String country_code, String mobile_number) {
        Update update = new Update();
        update.set("country_code", Integer.parseInt(country_code));
        update.set("mobile_number", mobile_number);

        ObjectId id = new ObjectId(_id);

        mongoTemplate.update(User.class)
                .matching(Criteria.where("_id").is(id))
                .apply(update)
                .first();

        return userRepository.findById(id);
    }
}
