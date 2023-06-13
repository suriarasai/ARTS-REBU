// Database access object, custom queries go here (ex. find by mobile number)
package com.rebu.Customer;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, Integer> {
    public Customer findFirstByPhoneNumber(String PhoneNumber);
    public Customer findFirstByEmail(String Email);
    public Customer findByCustomerID(Integer CustomerID);
}
