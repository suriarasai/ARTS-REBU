package com.rebu.data;

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
    @Id
    private ObjectId _id;
    private String firstName;
    private String lastName;
    private Integer countryCode;
    private String email;
    private String password;
    private String mobileNumber;
    private String joinedDate;
    private Integer rating;
    private List<String> favoriteLocations;
    private Integer rewardPoints;
    private Activity activity;
    private Saved_Locations savedLocations;
    private List<Reward_History> rewardHistory;
    private List<Reviews_About_Customer> reviewsAboutCustomer;
    private List<Reviews_From_Customer> reviewsFromCustomer;

    public User(Integer countryCode, String mobileNumber) {
        this.countryCode = countryCode;
        this.mobileNumber = mobileNumber;
    }
}
