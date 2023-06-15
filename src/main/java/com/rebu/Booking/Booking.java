// Data object containing information on a specific booking

package com.rebu.Booking;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.rebu.Location;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "Booking")
@AllArgsConstructor
@Data
public class Booking {
    /*
     * @param bookingID             : unique ID associated with a booking
     * @param messageSubmittedTime  : when the booking request was submitted (in miliseconds)
     * @param messageReceivedTime   : when the booking request was received (in miliseconds)
     * @param customerID            : unique ID associated with a customer
     * @param customerName          : customer name
     * @param phoneNumber           : customer phone number
     * @param pickUpLocation        : pickup location
     * @param pickUpTime            : taxi ETA
     * @param dropLocation          : dropoff location
     * @param taxiType              : requested vehicle type (ex. car/van)
     * @param fareType              : [metered, fixed]
     * @param fare                  : price (in dollars)
     * @param status                : [requested, dispatched, cancelled, completed]
     * @param driverID              : unique ID associated with a driver
     * @param taxiID                : unique ID associated with a taxi
     * @param distance              : distance travelled (in kilometers)
     * @param paymentMethod         : how the customer paid the fare
     */
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

    // Initial setter for when customers post a request
    public void CreateBooking(Integer messageSubmittedTime, Integer messageReceivedTime, Integer customerID,
            String customerName, Integer phoneNumber, String pickUpTime, String taxiType, String fareType, String fare,
            Float distance, String paymentMethod, Location pickUpPlace, Location dropOffPlace) {
        this.status = "requested";
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

    // Matching a driver to the booking request
    public void MatchedBooking(Integer driverID, Integer taxiID) {
        this.driverID = driverID;
        this.taxiID = taxiID;
        this.status = "dispatched";
    }

    // Completing the booking request
    public void CompleteBooking() {
        this.status = "completed";
    }

    // Either customer or driver cancels the request
    public void CancelBooking() {
        this.status = "cancelled";
    }

}
