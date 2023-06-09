package com.rebu.data;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "customers")
@Data
@AllArgsConstructor
public class Saved_Locations {
    private List<Float> home;
    private String homeName;
    private List<Float> work;
    private String workName;

    public Saved_Locations() {
    }

    public void setHome(List<Float> newHome, String homeName) {
        this.home = newHome;
        this.homeName = homeName;
    }

    public void setWork(List<Float> newWork, String workName) {
        this.work = newWork;
        this.workName = workName;
    }
}
