// Processes the data received by APIs and/or queries the database

package com.rebu.Taxi;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class TaxiService {

    // Database object for accessing data
    @Autowired
    private TaxiRepository TaxiRepository;

    // Built-in method to reduce boilerplate code when operating on DB
    @Autowired
    private MongoTemplate mongoTemplate;

    // (unused) API: Returns all Taxis and their associated data
    public List<Taxi> getAllTaxis() {
        return TaxiRepository.findAll();
    }

    // API: Queries for a taxi by the ID (sno)
    public Taxi getByTaxiID(Integer _id) {
        return TaxiRepository.findBySno(_id);
    }

}