package com.rebu.Booking;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.rebu.Location;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "customers")
@AllArgsConstructor
@Data
public class Booking {
    @Id
    private Integer bookingID;
    private Integer messageSubmittedTime;
    private Integer messageReceivedTime;
    private Integer customerID;
    private String customerName;
    private Integer phoneNumber;
    private Location pickUpLocation;
    private String pickUpTime;
    private Location dropLocation;
    private String taxiType;
    private String fareType;
    private String fare;

    // New Fields
    private String status;
    private Integer driverID;
    private Integer taxiID;
    private Float distance;
    private String paymentMethod;

    public Booking() {
    }

    public void CreateBooking(Integer messageSubmittedTime, Integer messageReceivedTime, Integer customerID,
            String customerName, Integer phoneNumber, String pickUpTime, String taxiType, String fareType, String fare,
            Float distance, String paymentMethod, Location pickUpPlace, Location dropOffPlace) {
        this.status = "Pending";
        this.messageSubmittedTime = messageSubmittedTime;
        this.messageReceivedTime = messageReceivedTime;
        this.customerID = customerID;
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
        this.pickUpTime = pickUpTime;
        this.taxiType = taxiType;
        this.fareType = fareType;
        this.fare = fare;
        this.distance = distance;
        this.paymentMethod = paymentMethod;
        this.pickUpLocation.SetLocation(pickUpPlace);
        this.dropLocation.SetLocation(dropOffPlace);
    }

    public void MatchedBooking(Integer driverID, Integer taxiID) {
        this.driverID = driverID;
        this.taxiID = taxiID;
        this.status = "Matched";
    }

    public void CompleteBooking() {
        this.status = "Completed";
    }

    public void CancelBooking() {
        this.status = "Cancelled";
    }

}
