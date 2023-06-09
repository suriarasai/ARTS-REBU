package com.rebu.data;

import java.time.LocalDate;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "customers")
@Data
@AllArgsConstructor
public class Reward_History {
    private String date = LocalDate.now().toString();
    private Integer points;
    private Integer totalPoints;

    public Reward_History() {}

    public void setEntry(Integer points, Integer totalPoints) {
        this.points = points;
        this.totalPoints = totalPoints;
    }
}
