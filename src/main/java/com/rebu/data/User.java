package com.rebu.data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import java.util.Iterator;

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

    public void setHome(List<Float> home, String homeName) {
        this.savedLocations.setHome(home, homeName);
    }

    public void setWork(List<Float> work, String workName) {
        this.savedLocations.setWork(work, workName);
    }

    public void addSignInTime() {
        this.activity.appendSignInTime();
    }

    private void addRewardHistory(Integer points) {
        Reward_History rewardEntry = new Reward_History();
        rewardEntry.setEntry(this.rewardPoints-points, points);
        this.rewardHistory.add(rewardEntry);
    }

    public void addSignOutTime() {
        this.activity.appendSignOutTime();
    }

    public void updateRewardPoints(Integer newCount) {
        this.addRewardHistory(newCount);
        this.rewardPoints = newCount;
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

    public void removeFavoriteLocation(String name) {
        for (Iterator<FavoriteLocation> iter = this.favoriteLocations.listIterator(); iter.hasNext();) {
            FavoriteLocation location = iter.next();
            if (location.getName().equals(name)) {
                iter.remove();
            }
        }
    }
}
