// Database access object, custom queries go here (ex. find by customerID)
package com.rebu.Booking;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends MongoRepository<Booking, Integer> {
    public Booking findByBookingID(Integer bookingID);
    public List<Booking> findByCustomerID(Integer customerID);
    public List<Booking> findByDriverID(Integer driverID);
    public List<Booking> findBySno(Integer sno);
    public Booking findFirstByOrderByBookingIDDesc();
}
