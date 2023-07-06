package com.rebu.Review;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Document(collection = "Taxi")
public class FormFields {
    Boolean cleanliness = false;
    Boolean politeness = false;
    Boolean punctuality = false;
    Boolean bookingProcess = false;
    Boolean waitTime = false;

    public FormFields() {
    }

    // Setter
    public void SetDriver(Boolean cleanliness, Boolean politeness, Boolean punctuality, Boolean bookingProcess,
            Boolean waitTime) {
        this.cleanliness = cleanliness;
        this.politeness = politeness;
        this.punctuality = punctuality;
        this.bookingProcess = bookingProcess;
        this.waitTime = waitTime;
    }
}