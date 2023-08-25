// Essentially a custom object to parse incoming API payloads
// this is so we can assign types (ex. int) to incoming data as opposed to assuming it's a string

package com.rebu;

import org.springframework.data.mongodb.core.mapping.Document;
import com.rebu.Taxi.RegisteredDriver;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "Taxi")
@Data
@AllArgsConstructor
public class RegisterDriverInterface {
    private Integer sno;
    private RegisteredDriver registeredDriver;

    public RegisterDriverInterface() {
    }

}