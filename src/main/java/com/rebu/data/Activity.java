package com.rebu.data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "customers")
@Data
@AllArgsConstructor
// @NoArgsConstructor
public class Activity {

    private List<String> signIn;
    private List<String> signOut;
    private List<String> receipts;
    private List<Travel_History> travelHistory;

    public Activity() {
        this.signIn = new ArrayList<String>();
        this.signOut = new ArrayList<String>();
        this.receipts = new ArrayList<String>();
    }

    public void appendSignInTime() {
        this.signIn.add(LocalDateTime.now().toString());
    }

    public void appendSignOutTime() {
        this.signOut.add(LocalDateTime.now().toString());
    }

    public List<String> getSignInTimes() {
        return this.signIn;
    }

    public List<String> getSignOutTimes() {
        return this.signOut;
    }
}
