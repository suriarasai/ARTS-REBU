// Data object containing information on a specific booking

package com.rebu.Booking;

import java.time.Instant;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Booking")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Booking {
    /*
     * @param bookingID : unique ID associated with a booking
     * 
     * @param messageSubmittedTime : when the booking request was submitted (in
     * miliseconds)
     * 
     * @param messageReceivedTime : when the booking request was received (in
     * miliseconds)
     * 
     * @param customerID : unique ID associated with a customer
     * 
     * @param customerName : customer name
     * 
     * @param phoneNumber : customer phone number
     * 
     * @param pickUpLocation : pickup location
     * 
     * @param pickUpTime : taxi ETA
     * 
     * @param dropLocation : dropoff location
     * 
     * @param taxiType : requested vehicle type (ex. car/van)
     * 
     * @param fareType : [metered, fixed]
     * 
     * @param fare : price (in dollars)
     * 
     * @param status : [requested, dispatched, cancelled, completed]
     * 
     * @param driverID : unique ID associated with a driver
     * 
     * @param sno : unique ID associated with a taxi
     * 
     * @param distance : distance travelled (in kilometers)
     * 
     * @param paymentMethod : how the customer paid the fare
     */
    @Id
    private ObjectId _id;
    private Integer bookingID;
    private Long messageSubmittedTime;
    private Long messageReceivedTime;
    private Integer customerID;
    private String customerName;
    private Integer phoneNumber;
    private Location pickUpLocation;
    private Long pickUpTime;
    private Location dropLocation;
    private String taxiType;
    private String fareType;
    private String fare;
    private Integer eta;

    // New Fields
    private String status;
    private Integer driverID;
    private Integer sno;
    private Float distance;
    private String paymentMethod;
    private Long dropTime;

    // Initial setter for when customers post a request
    public Booking(Integer bookingID) {
        this.bookingID = bookingID;
    }

    // Integer messageSubmittedTime, Integer messageReceivedTime, Integer
    // customerID,
    // String customerName, Integer phoneNumber, String pickUpTime, String taxiType,
    // String fareType, String fare,
    // Float distance, String paymentMethod, Location pickUpLocation, Location
    // dropLocation
    public void setBooking(Booking data) {
        this.status = "requested";
        this.messageSubmittedTime = data.messageSubmittedTime;
        this.messageReceivedTime = Instant.now().toEpochMilli(); // TODO: Remove? Is this done after Kafka?
        this.customerID = data.customerID;
        this.customerName = data.customerName;
        this.distance = data.distance;
        this.phoneNumber = data.phoneNumber;
        this.pickUpTime = data.pickUpTime;
        this.taxiType = data.taxiType;
        this.fareType = data.fareType;
        this.fare = data.fare;
        this.distance = data.distance;
        this.paymentMethod = data.paymentMethod;
        this.pickUpLocation = data.pickUpLocation;
        this.dropLocation = data.dropLocation;
        this.eta = data.eta;
    }

    // Matching a driver to the booking request
    public void MatchedBooking(Integer driverID, Integer sno) {
        this.driverID = driverID;
        this.sno = sno;
        this.status = "dispatched";
    }

    // On taxi arrival, log the pickUpTime
    public void taxiArrived(Long pickUpTime) {
        this.pickUpTime = pickUpTime;
    }

    // Completing the booking request
    public void CompleteBooking(Long droptime) {
        this.dropTime = droptime;
        this.status = "completed";
    }

    // Set the payment method
    public void SetPaymentMethod(String cardNumber) {
        this.paymentMethod = cardNumber;
    }

    // Either customer or driver cancels the request
    public void CancelBooking() {
        this.status = "cancelled";
    }

}
