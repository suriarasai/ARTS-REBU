// Essentially a custom object to parse incoming API payloads
// this is so we can assign types (ex. int) to incoming data as opposed to assuming it's a string

package com.rebu;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "Customer")
@Data
@AllArgsConstructor
public class LocationInterface {
    /*
     * @customerID  : unique ID associated with a customer
     * @location    : location details
     */
    private Integer customerID;
    private Location location;

    public LocationInterface() {
    }

}