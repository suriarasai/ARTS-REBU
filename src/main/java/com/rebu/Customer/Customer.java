package com.rebu.Customer;

import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.rebu.Location;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Customer")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Customer {
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

    public Customer(Integer phoneCountryCode, Integer phoneNumber) {
        this.phoneCountryCode = phoneCountryCode;
        this.phoneNumber = phoneNumber;
    }

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

    public void SetUserHome(Location homeLocation) {
        this.home.SetLocation(homeLocation);
    }

    public void SetUserWork(Location workLocation) {
        this.work.SetLocation(workLocation);
    }

    public void AddSavedLocation(Location savedLocation) {
        Location _place = new Location();
        _place.SetLocation(savedLocation);
        this.savedLocations.add(_place);
    }

    public void RemoveSavedLocation(String placeID) {
        for (Iterator<Location> iter = this.savedLocations.listIterator(); iter.hasNext();) {
            Location _place = iter.next();
            if (_place.getPlaceID().equals(placeID)) {
                iter.remove();
            }
        }
    }

    public void SetAmountSpent(Double amount) {
        this.amountSpent = amount;
    }

}
