// Database access object, custom queries go here (ex. find by mobile number)
package com.rebu.Review;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends MongoRepository<Review, Integer> {
    public Review findByReviewID(Integer reviewID);
    public Review findFirstByOrderByReviewIDDesc();
}
