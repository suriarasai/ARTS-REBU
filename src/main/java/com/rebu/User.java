package com.rebu;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "user")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    private ObjectId _id;
    private String first_name;
    private String last_name;
    private Integer country_code;
    private String email;
    private String password;
    private Integer mobile_number;
    private String joined_date;
    private Integer rating;
    private List<String> favorite_locations;
    private Integer reward_points;
    private Activity activity;
    private Saved_Locations saved_locations;
    private List<Reward_History> reward_history;
    private List<Reviews_About_Customer> reviews_about_customer;
    private List<Reviews_From_Customer> reviews_from_customer;
}
