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
@AllArgsConstructor
@NoArgsConstructor
@Data
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
    private List<FavoriteLocation> favoriteLocations = new ArrayList<FavoriteLocation>();
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

    public void setHome(List<Float> home) {
        this.savedLocations.setHome(home);
    }

    public void setWork(List<Float> work) {
        this.savedLocations.setWork(work);
    }

    public void addSignInTime() {
        this.activity.appendSignInTime();
    }

    private void addRewardHistory(Integer points) {
        Reward_History rewardEntry = new Reward_History();
        rewardEntry.setEntry(points, this.rewardPoints - points);
        this.rewardHistory.add(rewardEntry);
    }

    public void addSignOutTime() {
        this.activity.appendSignOutTime();
    }

    public void updateRewardPoints(Integer newCount) {
        this.rewardPoints = newCount;
        this.addRewardHistory(newCount);
    }

    public List<String> getSignInTimes() {
        return this.activity.getSignInTimes();
    }

    public List<String> getSignOutTimes() {
        return this.activity.getSignOutTimes();
    }

    public void addFavoriteLocation(String name, String address, ArrayList<Float> coordinates) {
        FavoriteLocation location = new FavoriteLocation();
        location.setLocation(name, address, coordinates);
        this.favoriteLocations.add(location);
    }
}
