// Location object for all data involving location data

package com.rebu.Customer;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "Customer")
@Data
@AllArgsConstructor
public class PaymentMethod {
    private String cardHolder;
    private Long cardNumber;
    private String expiryDate;
    private Integer cvv;

    public PaymentMethod() {
    }

    public void addPaymentMethod(PaymentMethod _data) {
        this.cardHolder = _data.cardHolder;
        this.cardNumber = _data.cardNumber;
        this.expiryDate = _data.expiryDate;
        this.cvv = _data.cvv;
    }
}