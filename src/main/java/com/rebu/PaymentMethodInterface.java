// Essentially a custom object to parse incoming API payloads
// this is so we can assign types (ex. int) to incoming data as opposed to assuming it's a string

package com.rebu;

import org.springframework.data.mongodb.core.mapping.Document;
import com.rebu.Customer.PaymentMethod;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "Customer")
@Data
@AllArgsConstructor
public class PaymentMethodInterface {
    private Integer customerID;
    private PaymentMethod paymentMethod;

    public PaymentMethodInterface() {
    }

}