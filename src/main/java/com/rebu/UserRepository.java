package com.rebu;

// import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.rebu.data.User;

@Repository
public interface UserRepository extends MongoRepository<User, Integer> {
    // Optional<User> findUserById(Integer _id);
}
