// Processes the data received by APIs and/or queries the database

package com.rebu.Customer;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    // Database object for accessing data
    @Autowired
    private CustomerRepository CustomerRepository;

    // Built-in method to reduce boilerplate code when operating on DB
    @Autowired
    private MongoTemplate mongoTemplate;

    // API: Returns all customers and their associated data
    public List<Customer> allCustomers() {
        return CustomerRepository.findAll();
    }

    // API: Returns a single customer based on their id
    public Customer singleCustomer(Integer _id) {
        return CustomerRepository.findByCustomerID(_id);
    }

    // API: Creates a new customer
    public Customer createCustomer(String PhoneCountryCode, String PhoneNumber) {

        // Manually incrementing the Customer ID by finding the ID of the last user
        Customer user = CustomerRepository.findFirstByOrderByCustomerIDDesc();
        Integer userID = user == null ? 1 : user.getCustomerID() + 1;

        Customer customer = CustomerRepository
                .insert(new Customer(Integer.parseInt(PhoneCountryCode), Integer.parseInt(PhoneNumber)));

        customer.setCustomerID(userID);

        CustomerRepository.save(customer);

        return customer;
    }

    // API: Registers/Updates a customer by adding information to existing customers
    // Used during both registration and when editing acount information
    public Customer updateCustomer(String CustomerName, String MemberCategory, String Age, String Gender,
            String ContactTitle, String CountryCode, String Email, String Password, String PhoneCountryCode,
            String PhoneNumber, String CustomerID) {
        Update update = new Update();
        update.set("customerName", CustomerName);
        update.set("memberCategory", MemberCategory);
        update.set("age", Integer.parseInt(Age));
        update.set("gender", Gender);
        update.set("contactTitle", ContactTitle);
        update.set("countryCode", CountryCode);
        update.set("email", Email);
        update.set("password", Password);

        // Do not change these fields (during the registration process)
        if (PhoneNumber != null && PhoneCountryCode != null) {
            update.set("phoneCountryCode", Integer.parseInt(PhoneCountryCode));
            update.set("phoneNumber", Integer.parseInt(PhoneNumber));
        }

        mongoTemplate.update(Customer.class)
                .matching(Criteria.where("customerID").is(Integer.parseInt(CustomerID)))
                .apply(update)
                .first();

        return CustomerRepository.findByCustomerID(Integer.parseInt(CustomerID));
    }

    // API: Finds a customer by their mobile number
    public Customer findByPhoneNumber(String phoneNumber, String phoneCountryCode) {
        Customer customer = CustomerRepository.findFirstByPhoneNumberAndPhoneCountryCode(Integer.parseInt(phoneNumber),
                Integer.parseInt(phoneCountryCode));

        if (customer != null) {
            CustomerRepository.save(customer);
        }

        return customer;
    }

    // API: (unused) Upserts (update/insert if non-existant) customers by mobile #
    public Integer signInWithPhoneNumber(String phoneNumber, String phoneCountryCode) {

        Query query = new Query();
        query.addCriteria(Criteria.where("phoneNumber").is(Integer.parseInt(phoneNumber)));
        Update update = new Update();
        update.set("phoneNumber", Integer.parseInt(phoneNumber));
        update.set("phoneCountryCode", Integer.parseInt(phoneCountryCode));
        mongoTemplate.upsert(query, update, Customer.class);

        Customer customer = CustomerRepository.findFirstByPhoneNumberAndPhoneCountryCode(Integer.parseInt(phoneNumber),
                Integer.parseInt(phoneCountryCode));

        if (customer.getCustomerID() != null) {
            CustomerRepository.save(customer);
        }

        return customer.getCustomerID();
    }

    // API: Return customer details if their email and password are correct
    public Customer signInWithEmail(String email, String password) {

        Customer customer = CustomerRepository.findFirstByEmail(email);

        if (customer != null && customer.getPassword().equals(password)) {
            CustomerRepository.save(customer);
            return customer;
        } else {
            return null;
        }
    }

    // API: Sets Home location
    public String setHome(Integer CustomerID, Location location) {
        Customer customer = CustomerRepository.findByCustomerID(CustomerID);
        customer.SetUserHome(location);
        CustomerRepository.save(customer);
        return null;
    }

    // API: Sets Work location
    public String setWork(Integer CustomerID, Location location) {
        Customer customer = CustomerRepository.findByCustomerID(CustomerID);
        customer.SetUserWork(location);
        CustomerRepository.save(customer);
        return null;
    }

    // API: Sets a favorite location
    public String addSavedLocation(Location savedLocation, Integer customerID) {
        Customer customer = CustomerRepository.findByCustomerID(customerID);
        customer.AddSavedLocation(savedLocation);
        CustomerRepository.save(customer);
        return null;
    }

    // API: Removes a favorite location
    public String removeSavedLocation(String placeID, String customerID) {
        Customer customer = CustomerRepository.findByCustomerID(Integer.parseInt(customerID));
        customer.RemoveSavedLocation(placeID);
        CustomerRepository.save(customer);
        return null;
    }

}
