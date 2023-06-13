// Processes the data received by APIs and/or queries the database

package com.rebu.Customer;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.rebu.Location;

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
        Customer customer = CustomerRepository
                .insert(new Customer(Integer.parseInt(PhoneCountryCode), Integer.parseInt(PhoneNumber)));
        return customer;
    }

    // API: Registers/Updates a customer by adding information to existing customers
    public Customer updateCustomer(String CustomerName, String MemberCategory, String Age, String Gender,
            String ContactTitle, String CountryCode, String Email, String Password, String PhoneCountryCode,
            String PhoneNumber, String CustomerID) {
        Update update = new Update();
        update.set("CustomerName", CustomerName);
        update.set("MemberCategory", MemberCategory);
        update.set("Age", Integer.parseInt(Age));
        update.set("Gender", Gender);
        update.set("ContactTitle", ContactTitle);
        update.set("CountryCode", Integer.parseInt(CountryCode));
        update.set("Email", Email);
        update.set("Password", Password);

        if (PhoneNumber != null && PhoneCountryCode != null) {
            update.set("PhoneCountryCode", Integer.parseInt(PhoneCountryCode));
            update.set("PhoneNumber", Integer.parseInt(PhoneNumber));
        }

        mongoTemplate.update(Customer.class)
                .matching(Criteria.where("CustomerID").is(Integer.parseInt(CustomerID)))
                .apply(update)
                .first();

        return CustomerRepository.findByCustomerID(Integer.parseInt(CustomerID));
    }

    // API: Finds a customer by their mobile number
    public Customer findByMobileNumber(String mobileNumber) {
        Customer customer = CustomerRepository.findFirstByPhoneNumber(mobileNumber);

        if (customer != null) {
            CustomerRepository.save(customer);
        }

        return customer;
    }

    // API: (Not used) Upserts (update/insert if non-existant) customers by mobile #
    public Integer signInWithMobileNumber(String mobileNumber, String countryCode) {

        Query query = new Query();
        query.addCriteria(Criteria.where("mobileNumber").is(mobileNumber));
        Update update = new Update();
        update.set("mobileNumber", mobileNumber);
        update.set("countryCode", Integer.parseInt(countryCode));
        mongoTemplate.upsert(query, update, Customer.class);

        Customer customer = CustomerRepository.findFirstByPhoneNumber(mobileNumber);

        if (customer.getCustomerID() != null) {
            CustomerRepository.save(customer);
        }

        return customer.getCustomerID();
    }

    // API: Return customer password/credential
    public Customer signInWithEmail(String email, String password) {

        Customer customer = CustomerRepository.findFirstByEmail(email);

        if (customer != null && customer.getPassword().equals(password)) {
            CustomerRepository.save(customer);
            return customer;
        } else {
            return null;
        }
    }

    // // Sets Home location
    // public void setHome(String CustomerID, ArrayList<Float> home, String homeName) {
    //     Customer customer = CustomerRepository.findByCustomerID(Integer.parseInt(CustomerID));
    //     customer.SetUserHome(home, homeName);
    //     CustomerRepository.save(customer);
    // }

    // // Sets Work location
    // public void setWork(String CustomerID, ArrayList<Float> work, String workName) {
    //     Customer customer = CustomerRepository.findByCustomerID(Integer.parseInt(CustomerID));
    //     customer.SetUserWork(work, workName);
    //     CustomerRepository.save(customer);
    // }

    // // Sets a favorite location
    // public void AddSavedLocation(Location SavedLocation) {
    //     Customer customer = CustomerRepository.findByCustomerID(Integer.parseInt(CustomerID));
    //     customer.AddSavedLocation(SavedLocation);
    //     CustomerRepository.save(customer);
    // }

    // // Sets a favorite location
    // public void removeFavoriteLocation(String CustomerID, String name) {
    //     Customer customer = CustomerRepository.findByCustomerID(Integer.parseInt(CustomerID));
    //     customer.RemoveSavedLocation(name);
    //     CustomerRepository.save(customer);
    // }

}
