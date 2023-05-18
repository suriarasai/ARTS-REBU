package com.rebu.data;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "customers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Travel_History {
    @Id
    private ObjectId _id;
    private String from;
    private String to;
    private String status;
    private String time_booked;
    private String time_boarded;
    private String time_arrived;
    private String time_cancelled;
    private Integer time_travelled;
    private Integer time_expected;
    private Boolean voucher_used;
    private Float fare;
    private Float tips;
    private Float surcharges;
    private Float peak_charges;
    private String payment_method;
    private String payment_model;
    private ObjectId driver_id;
    private Float distance;
    private ObjectId car_id;
}