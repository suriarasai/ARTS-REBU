package com.rebu;

import java.util.List;
import java.util.Optional;

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
    public List<User> allUsers() {
        return userRepository.findAll();
    }
    public Optional<User> singleUser(Integer _id) {
        return userRepository.findById(_id);
    }

    @Autowired
    private MongoTemplate mongoTemplate;

    public User createUser(String _id, String country_code, String mobile_number) {
        User user = userRepository.insert(new User(Integer.parseInt(_id), Integer.parseInt(country_code), mobile_number));

        mongoTemplate.update(User.class)
                .matching(Criteria.where("_id").is(_id))
                .apply(new Update().push("_id").value(_id))
                .first();

        return user;
    }
}
