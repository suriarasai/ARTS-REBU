package com.rebu.Customer;

import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Customer")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Customer {
    /*
     * @param _id : (unused) auto-generated ID by MongoDB
     * 
     * @param customerID : auto-incremented ID for querying
     * 
     * @param customerName : full name
     * 
     * @param memberCategory : category (ex. driver/passenger/infant)
     * 
     * @param age : age
     * 
     * @param gender : [M/F/NA]
     * 
     * @param amountSpent : amount spent (in dollars)
     * 
     * @param address : [TODO: Remove?] address
     * 
     * @param city : [TODO: Remove?] city
     * 
     * @param countryCode : 3 letter country code (ex. Malaysia = MLY)
     * 
     * @param contactTitle : prefixes (mr/ms/mrs/other)
     * 
     * @param phoneNumber : phone number (8-digits)
     * 
     * @param email : email address
     * 
     * @param password : [TODO: Encrypt] password for email sign in
     * 
     * @param phoneCountryCode : 2-3 digit country dial code (ex. Singapore = 65)
     * 
     * @param home : home address details
     * 
     * @param work : work address details
     * 
     * @param savedLocations : list of saved locations
     * [TODO: recentLocations]
     */
    @Id
    private ObjectId _id;
    private Integer customerID;
    private String customerName;
    private String memberCategory;
    private Integer age;
    private String gender;
    private Double amountSpent;
    private Location address;
    private String city;
    private String countryCode;
    private String contactTitle;
    private Integer phoneNumber;

    // New Fields
    private String email;
    private String password;
    private Integer phoneCountryCode;

    // Misc Fields
    private Location home = new Location();
    private Location work = new Location();
    private List<Location> savedLocations = new ArrayList<Location>();
    private List<PaymentMethod> paymentMethods = new ArrayList<PaymentMethod>();

    // Constructor
    public Customer(Integer phoneCountryCode, Integer phoneNumber) {
        this.phoneCountryCode = phoneCountryCode;
        this.phoneNumber = phoneNumber;
    }

    // Setter
    public void UpdateUser(String customerName, String memberCategory, Integer age, String gender,
            String contactTitle, String countryCode, String email, String password, Integer phoneCountryCode,
            Integer phoneNumber) {
        this.customerName = customerName;
        this.memberCategory = memberCategory;
        this.age = age;
        this.gender = gender;
        this.contactTitle = contactTitle;
        this.countryCode = countryCode;
        this.email = email;
        this.password = password;
        this.phoneCountryCode = phoneCountryCode;
        this.phoneNumber = phoneNumber;
    }

    // Set home location
    public void SetUserHome(Location homeLocation) {
        this.home.SetLocation(homeLocation);
    }

    // Set work location
    public void SetUserWork(Location workLocation) {
        this.work.SetLocation(workLocation);
    }

    // Add a saved location
    public void AddSavedLocation(Location savedLocation) {
        Location _place = new Location();
        _place.SetLocation(savedLocation);
        this.savedLocations.add(_place);
    }

    // Remove a saved location
    public void RemoveSavedLocation(String placeID) {
        for (Iterator<Location> iter = this.savedLocations.listIterator(); iter.hasNext();) {
            Location _place = iter.next();
            if (_place.getPlaceID().equals(placeID)) {
                iter.remove();
            }
        }
    }

    // Add a payment method
    public void AddPaymentMethod(PaymentMethod paymentMethod) {
        PaymentMethod _paymentMethod = new PaymentMethod();
        _paymentMethod.addPaymentMethod(paymentMethod);
        this.paymentMethods.add(_paymentMethod);
    }

    // Remove a payment method
    public void RemovePaymentMethod(Long _cardNumber) {
        for (Iterator<PaymentMethod> iter = this.paymentMethods.listIterator(); iter.hasNext();) {
            PaymentMethod _paymentMethod = iter.next();
            if (Long.toString(_paymentMethod.getCardNumber()).equals(Long.toString(_cardNumber))) {
                _paymentMethod.setCardHolder("Matched");
                iter.remove();
            }
        }
    }

    // Set default payment method
    public void SetDefaultPaymentMethod(Long _cardNumber) {
        for (Iterator<PaymentMethod> iter = this.paymentMethods.listIterator(); iter.hasNext();) {
            PaymentMethod _paymentMethod = iter.next();
            if (Long.toString(_paymentMethod.getCardNumber()).equals(Long.toString(_cardNumber))) {
                _paymentMethod.setDefaultPaymentMethod(true);
            } else {
                _paymentMethod.setDefaultPaymentMethod(false);
            }
        }
    }

    public List<PaymentMethod> GetPaymentMethods() {
        return this.paymentMethods;
    }

    // Set amount spent
    public void SetAmountSpent(Double amount) {
        this.amountSpent = amount;
    }

}
