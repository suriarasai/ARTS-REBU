// Processes the data received by APIs and/or queries the database

package com.rebu.Taxi;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rebu.Taxi.TaxiRepository;

@Service
public class TaxiService {

    @Autowired
    private TaxiRepository TaxiRepository;

    // (unused) API: Returns all Taxis and their associated data
    public List<Taxi> getAllTaxis() {
        return TaxiRepository.findAll();
    }

    // API: Queries for a taxi by the ID (sno)
    public Taxi getByTaxiID(Integer _id) {
        return TaxiRepository.findBySno(_id);
    }

    // API: Adds a new taxi
    public Taxi createTaxi(Taxi data) {

        // Auto-incrementing TaxiID
        Taxi prevTaxi = TaxiRepository.findFirstByOrderBySnoDesc();
        Integer sno = prevTaxi == null ? 1 : prevTaxi.getSno() + 1;

        Taxi Taxi = TaxiRepository.insert(new Taxi(sno));
        Taxi.UpsertTaxi(data);
        TaxiRepository.save(Taxi);

        return Taxi;
    }

    // API: Appends a driver to a taxi
    public String addDriver(Taxi data) {
        Taxi Taxi = TaxiRepository.findBySno(data.getSno());
        Taxi.RegisterDriver(data.getRegisteredDrivers().get(0));
        TaxiRepository.save(Taxi);
        return null;
    }

}