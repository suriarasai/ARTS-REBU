package com.rebu;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "user")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Activity {
    private String sign_in;
    private String sign_out;
    private List<Travel_History> travel_history;
    private List<String> receipts;
}
