package com.rebu.data;

import java.time.LocalDate;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "customers")
@Data
@AllArgsConstructor
public class Reward_History {
    private String date;
    private Integer points;
    private Integer totalPoints;

    public Reward_History(Integer points, Integer totalPoints) {
        this.date = LocalDate.now().toString();
        this.points = points;
        this.totalPoints = totalPoints;
    }
}
