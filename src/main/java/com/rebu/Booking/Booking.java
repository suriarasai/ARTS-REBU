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
    private Integer BookingID;
    private Integer MessageSubmittedTime;
    private Integer MessageReceivedTime;
    private Integer CustomerID;
    private String CustomerName;
    private Integer PhoneNumber;
    private Location PickUpLocation;
    private String PickUpTime;
    private Location DropLocation;
    private String TaxiType;
    private String FareType;
    private String Fare;

    // New Fields
    private String Status;
    private Integer DriverID;
    private Integer TaxiID;
    private Float Distance;
    private String PaymentMethod;

    public Booking() {
    }

    public void CreateBooking(Integer MessageSubmittedTime, Integer MessageReceivedTime, Integer CustomerID,
            String CustomerName, Integer PhoneNumber, String PickUpTime, String TaxiType, String FareType, String Fare,
            Float Distance, String PaymentMethod, Location PickUpPlace, Location DropOffPlace) {
        this.Status = "Pending";
        this.MessageSubmittedTime = MessageSubmittedTime;
        this.MessageReceivedTime = MessageReceivedTime;
        this.CustomerID = CustomerID;
        this.CustomerName = CustomerName;
        this.PhoneNumber = PhoneNumber;
        this.PickUpTime = PickUpTime;
        this.TaxiType = TaxiType;
        this.FareType = FareType;
        this.Fare = Fare;
        this.Distance = Distance;
        this.PaymentMethod = PaymentMethod;
        this.PickUpLocation.SetLocation(PickUpPlace);
        this.DropLocation.SetLocation(DropOffPlace);
    }

    public void MatchedBooking(Integer DriverID, Integer TaxiID) {
        this.DriverID = DriverID;
        this.TaxiID = TaxiID;
        this.Status = "Matched";
    }

    public void CompleteBooking() {
        this.Status = "Completed";
    }

    public void CancelBooking() {
        this.Status = "Cancelled";
    }

}
