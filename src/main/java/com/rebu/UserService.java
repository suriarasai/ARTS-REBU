package com.rebu;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    public List<User> allUsers() {
        return userRepository.findAll();
    }
    public Optional<User> singleUser(ObjectId id) {
        return userRepository.findById(id);
    }
}
