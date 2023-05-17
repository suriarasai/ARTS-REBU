package com.rebu.data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "customers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reviews_From_Customer {
    @Id
    private Integer _id;
    private Integer driver_id;
    private String datetime;
    private Integer rating;
    private Integer politeness;
    private Integer cleanliness;
    private String body;
}
