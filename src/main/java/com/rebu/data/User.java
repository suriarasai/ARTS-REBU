package com.rebu.data;

import java.time.LocalDate;
import java.util.ArrayList;
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
    private Integer rewardPoints = 0;
    private List<String> favoriteLocations = new ArrayList<String>();
    private Activity activity = new Activity();
    private Saved_Locations savedLocations = new Saved_Locations();
    private List<Reward_History> rewardHistory = new ArrayList<Reward_History>();
    private List<Reviews_About_Customer> reviewsAboutCustomer = new ArrayList<Reviews_About_Customer>();
    private List<Reviews_From_Customer> reviewsFromCustomer = new ArrayList<Reviews_From_Customer>();

    public User(Integer countryCode, String mobileNumber) {
        this.countryCode = countryCode;
        this.mobileNumber = mobileNumber;
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

    public void setHome(String home) {
        this.savedLocations.setHome(home);
    }

    public void setWork(String work) {
        this.savedLocations.setHome(work);
    }

    public void addSignInTime() {
        this.activity.appendSignInTime();
    }

    public void addSignOutTime() {
        this.activity.appendSignOutTime();
    }

    public void updateRewardPoints(Integer newCount) {
        this.rewardPoints = newCount;
    }

    public List<String> getSignInTimes() {
        return this.activity.getSignInTimes();
    }

    public List<String> getSignOutTimes() {
        return this.activity.getSignOutTimes();
    }

    public void addFavoriteLocation(String savedLocation) {
        this.favoriteLocations.add(savedLocation);
    }
}
