// Database access object, custom queries go here (ex. find by customerID)
package com.rebu.Booking;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends MongoRepository<Booking, Integer> {
    public Booking findByBookingID(Integer bookingID);
    public Booking findByCustomerID(Integer customerID);
    public Booking findByDriverID(Integer driverID);
    public Booking findByTaxiID(Integer taxiID);
    public Booking findFirstByOrderByBookingIDDesc();
}
