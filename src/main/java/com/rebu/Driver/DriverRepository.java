// Database access object, custom queries go here (ex. find by customerID)
package com.rebu.Driver;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriverRepository extends MongoRepository<Driver, Integer> {
    public Driver findByDriverID(Integer DriverID);
    public Driver findFirstByOrderByDriverIDDesc();
}
