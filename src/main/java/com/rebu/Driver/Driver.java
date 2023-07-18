// Data object containing information on a specific Driver

package com.rebu.Driver;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Driver")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Driver {
    @Id
    private ObjectId _id;
    private Integer driverID;
    private String driverName;
    private Integer driverNumber;
    private Integer sno;
    private Double rating;

    public Driver(Integer driverID) {
        this.driverID = driverID;
    }

    public void setDriver(Driver data) {
        this.driverName = data.driverName;
        this.driverNumber = data.driverNumber;
        this.sno = data.sno;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

}
