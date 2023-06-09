package com.rebu.data;

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
public class Reviews_About_Customer {
    @Id
    private ObjectId _id;
    private ObjectId driver_id;
    private String datetime;
    private Integer rating;
    private String body;

    public Reviews_About_Customer(ObjectId driver_id, String datetime, Integer rating, String body) {
        this.driver_id = driver_id;
        this.datetime = datetime;
        this.rating = rating;
        this.body = body;
    }
}
