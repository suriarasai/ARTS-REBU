// Database access object, custom queries go here (ex. find by mobile number)
package com.rebu.Customer;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, Integer> {
    public Customer findFirstByPhoneNumber(Integer phoneNumber);
    public Customer findFirstByEmail(String email);
    public Customer findByCustomerID(Integer customerID);
    public Customer findByPhoneNumberAndPhoneCountryCode(Integer phoneNumber, Integer phoneCountryCode);
    public Customer findFirstByOrderByCustomerIDDesc();
}
