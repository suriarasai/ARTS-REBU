// Processes the data received by APIs and/or queries the database

package com.rebu.Booking;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    // Database object for accessing data
    @Autowired
    private BookingRepository BookingRepository;

    // (unused) API: Returns all bookings and their associated data
    public List<Booking> getAllBookings() {
        return BookingRepository.findAll();
    }

    // (unused) API: Returns all bookings associated with a bookingID
    public Booking getByBookingID(Integer _id) {
        return BookingRepository.findByBookingID(_id);
    }

    // (unused) API: Returns all bookings associated with a sno
    public List<Booking> getByTaxiSno(Integer _id) {
        return BookingRepository.findBySno(_id);
    }

    // (unused) API: Returns all bookings associated with a driverID
    public List<Booking> getByDriverID(Integer _id) {
        return BookingRepository.findByDriverID(_id);
    }

    // API: Returns all bookings associated with a customerID
    public List<Booking> getByCustomerID(Integer _id) {
        return BookingRepository.findByCustomerID(_id);
    }

    // API: Creates a new booking (ie. customer requests a ride)
    public Booking createBooking(Booking data) {
        // Manually setting the Booking ID by incrementing the ID of the last booking
        Booking prevBooking = BookingRepository.findFirstByOrderByBookingIDDesc();
        Integer bookingID = prevBooking == null ? 1 : prevBooking.getBookingID() + 1;

        Booking booking = BookingRepository
                .insert(new Booking(bookingID));

        booking.setBooking(data); // Updating the new booking object

        // booking.setBookingID(bookingID);
        BookingRepository.save(booking);

        return booking;
    }

    public String taxiArrived(Booking data) {
        Booking booking = BookingRepository.findByBookingID(data.getBookingID());
        booking.taxiArrived(data.getPickUpTime());
        BookingRepository.save(booking);

        return null;
    }

    public String matchedBooking(Booking data) {
        Booking booking = BookingRepository.findByBookingID(data.getBookingID());
        booking.MatchedBooking(data.getDriverID(), data.getSno());
        BookingRepository.save(booking);

        return null;
    }

    public String cancelBooking(Booking data) {
        Booking booking = BookingRepository.findByBookingID(data.getBookingID());
        booking.CancelBooking();
        BookingRepository.save(booking);

        return null;
    }

    public String completeBooking(Booking data) {
        Booking booking = BookingRepository.findByBookingID(data.getBookingID());
        booking.CompleteBooking(data.getDropTime());
        BookingRepository.save(booking);

        return null;
    }

    public String setPaymentMethod(Booking data) {
        Booking booking = BookingRepository.findByBookingID(data.getBookingID());
        booking.SetPaymentMethod(data.getPaymentMethod());
        BookingRepository.save(booking);

        return null;
    }

}