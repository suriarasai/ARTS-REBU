package com.rebu.Review;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    // Database object for accessing data
    @Autowired
    private ReviewRepository ReviewRepository;

    // API: Returns all Reviews and their associated data
    public List<Review> allReviews() {
        return ReviewRepository.findAll();
    }

    // API: Returns a single Review based on their id
    public Review singleReview(Integer _id) {
        return ReviewRepository.findByReviewID(_id);
    }

    // API: Creates a new Review
    public Review createReview(Review userReview) {

        // Manually incrementing the Review ID by finding the ID of the last review
        Review review = ReviewRepository.findFirstByOrderByReviewIDDesc();
        Integer reviewID = review == null ? 1 : review.getReviewID() + 1;

        Review Review = ReviewRepository.insert(userReview);

        Review.setReviewID(reviewID);

        ReviewRepository.save(Review);

        return Review;
    }

}
