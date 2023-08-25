package com.rebu.Review;


import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "Review")
@AllArgsConstructor
@Data
public class Review {
    @Id
    private ObjectId _id;
    private Integer reviewID;
    private Integer customerID;
    private Integer driverID;
    private Long messageReceivedTime;
    private Integer rating;
    private String reviewBody;
    private FormFields areasOfImprovement;

    // Constructor
    public Review() {
    }

    // Setter
    public void UpdateUser(Review review) {
        // Integer reviewID, Integer customerID, Integer driverID, Long messageReceivedTime,
        //     Integer rating, String reviewBody, FormFields areasOfImprovement
        this.reviewID = review.reviewID;
        this.customerID = review.customerID;
        this.driverID = review.driverID;
        this.messageReceivedTime = review.messageReceivedTime;
        this.rating = review.rating;
        this.reviewBody = review.reviewBody;
        this.areasOfImprovement = review.areasOfImprovement;
    }

}
