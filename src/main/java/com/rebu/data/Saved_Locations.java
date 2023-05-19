package com.rebu.data;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "customers")
@Data
@AllArgsConstructor
public class Saved_Locations {
    private String home;
    private String work;

    public Saved_Locations() {
        this.home = null;
        this.work = null;
    }
}
