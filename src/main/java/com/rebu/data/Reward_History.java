package com.rebu.data;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "customers")
@Data
@AllArgsConstructor
public class Reward_History {
    @Id
    private ObjectId _id;
    private String datetime;
    private Integer points;

    public Reward_History() {
        this.datetime = null;
        this.points = null;
    }
}
