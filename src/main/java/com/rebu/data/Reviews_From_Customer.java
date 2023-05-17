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
public class Reviews_From_Customer {
    @Id
    private ObjectId _id;
    private ObjectId driver_id;
    private String datetime;
    private Integer rating;
    private Integer politeness;
    private Integer cleanliness;
    private String body;
}
