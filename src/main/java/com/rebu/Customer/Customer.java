package com.rebu.Customer;

import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.rebu.Location;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "customers")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Customer {
    @Id
    private Integer CustomerID;
    private String CustomerName;
    private String MemberCategory;
    private Integer Age;
    private String Gender;
    private Double AmountSpent;
    private Location Address;
    private String City;
    private String CountryCode;
    private String ContactTitle;
    private Integer PhoneNumber;

    // New Fields
    private String Email;
    private String Password;
    private Integer PhoneCountryCode;

    // Misc Fields
    private Location Home = new Location();
    private Location Work = new Location();
    private List<Location> SavedLocations = new ArrayList<Location>();

    public Customer(Integer PhoneCountryCode, Integer PhoneNumber) {
        this.PhoneCountryCode = PhoneCountryCode;
        this.PhoneNumber = PhoneNumber;
    }

    public void UpdateUser(String CustomerName, String MemberCategory, Integer Age, String Gender,
            String ContactTitle, String CountryCode, String Email, String Password, Integer PhoneCountryCode,
            Integer PhoneNumber) {
        this.CustomerName = CustomerName;
        this.MemberCategory = MemberCategory;
        this.Age = Age;
        this.Gender = Gender;
        this.ContactTitle = ContactTitle;
        this.CountryCode = CountryCode;
        this.Email = Email;
        this.Password = Password;
        this.PhoneCountryCode = PhoneCountryCode;
        this.PhoneNumber = PhoneNumber;
    }

    public void SetUserHome(Location HomeLocation) {
        this.Home.SetLocation(HomeLocation);
    }

    public void SetUserWork(Location WorkLocation) {
        this.Work.SetLocation(WorkLocation);
    }

    public void AddSavedLocation(Location SavedLocation) {
        Location _place = new Location();
        _place.SetLocation(SavedLocation);
        this.SavedLocations.add(_place);
    }

    public void RemoveSavedLocation(String PlaceID) {
        for (Iterator<Location> iter = this.SavedLocations.listIterator(); iter.hasNext();) {
            Location _place = iter.next();
            if (_place.getPlaceID().equals(PlaceID)) {
                iter.remove();
            }
        }
    }

    public void SetAmountSpent(Double amount) {
        this.AmountSpent = amount;
    }

}
