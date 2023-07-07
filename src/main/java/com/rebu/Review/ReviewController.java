package com.rebu.Review;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/Review")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService query;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return new ResponseEntity<List<Review>>(query.allReviews(), HttpStatus.OK);
    }

    @GetMapping("/{_id}")
    public ResponseEntity<Review> getSingleReview(@PathVariable Integer _id) {
        return new ResponseEntity<Review>(query.singleReview(_id), HttpStatus.OK);
    }

    @PostMapping("/createReview")
    public ResponseEntity<Review> createReview(@RequestBody Review payload) {
        return new ResponseEntity<Review>(
                query.createReview(payload), HttpStatus.CREATED);
    }

}