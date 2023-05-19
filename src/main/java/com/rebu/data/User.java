package com.rebu.data;

import java.time.LocalDate;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "customers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    // TODO: Date objects
    @Id
    private ObjectId _id;
    private String firstName;
    private String lastName;
    private String prefix;
    private String birthdate;
    private Integer countryCode;
    private String email;
    private String password;
    private String mobileNumber;
    private String joinedDate = LocalDate.now().toString();
    private Integer rating;
    private List<String> favoriteLocations;
    private Integer rewardPoints = 0;
    private Activity activity;
    private Saved_Locations savedLocations;
    private List<Reward_History> rewardHistory;
    private List<Reviews_About_Customer> reviewsAboutCustomer;
    private List<Reviews_From_Customer> reviewsFromCustomer;

    public User(Integer countryCode, String mobileNumber) {
        this.countryCode = countryCode;
        this.mobileNumber = mobileNumber;
        // this.firstName = firstName;
        // this.lastName = lastName;
        // this.prefix = prefix;
        // this.birthdate = birthdate;
        // this.email = email;
        // this.password = password;
        // this.rewardPoints = 0;

        // , String firstName, String lastName, String prefix,
        // String birthdate, String email, String password
    }

    public String getId() {
        return this._id.toString();
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }
}
