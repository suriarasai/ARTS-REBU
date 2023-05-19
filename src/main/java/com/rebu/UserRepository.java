// Database access object, custom queries go here (ex. find by mobile number)

package com.rebu;

import org.bson.types.ObjectId;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.rebu.data.User;

@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
    public User findFirstByMobileNumber(String mobileNumber);
    public User findFirstByEmail(String email);
}
