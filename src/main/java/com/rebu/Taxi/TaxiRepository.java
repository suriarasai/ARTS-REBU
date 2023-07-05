// Database access object, custom queries go here (ex. find by customerID)
package com.rebu.Taxi;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaxiRepository extends MongoRepository<Taxi, Integer> {
    public Taxi findBySno(Integer sno);
}
