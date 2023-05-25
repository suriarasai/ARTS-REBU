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
    private List<Float> work;

    public Saved_Locations() {
    }

    public void setHome(List<Float> newHome) {
        this.home = newHome;
    }

    public void setWork(List<Float> newWork) {
        this.work = newWork;
    }
}
