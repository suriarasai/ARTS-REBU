// Processes the data received by APIs and/or queries the database

package com.rebu.Customer;

import java.util.List;

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

        Customer user = CustomerRepository.findFirstByOrderByCustomerIDDesc();
        Integer userID = user == null ? 1 : user.getCustomerID() + 1;

        Customer customer = CustomerRepository
                .insert(new Customer(Integer.parseInt(PhoneCountryCode), Integer.parseInt(PhoneNumber)));

        customer.setCustomerID(userID);

        CustomerRepository.save(customer);

        return customer;
    }

    // API: Registers/Updates a customer by adding information to existing customers
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
    public Customer findByPhoneNumber(String phoneNumber, String phoneCountryCode) {
        Customer customer = CustomerRepository.findByPhoneNumberAndPhoneCountryCode(Integer.parseInt(phoneNumber),
                Integer.parseInt(phoneCountryCode));

        if (customer != null) {
            CustomerRepository.save(customer);
        }

        return customer;
    }

    // API: (Not used) Upserts (update/insert if non-existant) customers by mobile #
    public Integer signInWithPhoneNumber(String phoneNumber, String phoneCountryCode) {

        Query query = new Query();
        query.addCriteria(Criteria.where("phoneNumber").is(Integer.parseInt(phoneNumber)));
        Update update = new Update();
        update.set("phoneNumber", Integer.parseInt(phoneNumber));
        update.set("phoneCountryCode", Integer.parseInt(phoneCountryCode));
        mongoTemplate.upsert(query, update, Customer.class);

        Customer customer = CustomerRepository.findByPhoneNumberAndPhoneCountryCode(Integer.parseInt(phoneNumber),
                Integer.parseInt(phoneCountryCode));

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
    // public void setHome(String CustomerID, ArrayList<Float> home, String
    // homeName) {
    // Customer customer =
    // CustomerRepository.findByCustomerID(Integer.parseInt(CustomerID));
    // customer.SetUserHome(home, homeName);
    // CustomerRepository.save(customer);
    // }

    // // Sets Work location
    // public void setWork(String CustomerID, ArrayList<Float> work, String
    // workName) {
    // Customer customer =
    // CustomerRepository.findByCustomerID(Integer.parseInt(CustomerID));
    // customer.SetUserWork(work, workName);
    // CustomerRepository.save(customer);
    // }

    // // Sets a favorite location
    // public void AddSavedLocation(Location SavedLocation) {
    // Customer customer =
    // CustomerRepository.findByCustomerID(Integer.parseInt(CustomerID));
    // customer.AddSavedLocation(SavedLocation);
    // CustomerRepository.save(customer);
    // }

    // // Sets a favorite location
    // public void removeFavoriteLocation(String CustomerID, String name) {
    // Customer customer =
    // CustomerRepository.findByCustomerID(Integer.parseInt(CustomerID));
    // customer.RemoveSavedLocation(name);
    // CustomerRepository.save(customer);
    // }

}
