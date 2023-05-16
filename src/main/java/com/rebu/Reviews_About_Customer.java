package com.rebu;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "user")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reviews_About_Customer {
    @Id
    private ObjectId _id;
    private String datetime;
    @DocumentReference
    private ObjectId driver_id;
    private Integer rating;
    private String body;
}
