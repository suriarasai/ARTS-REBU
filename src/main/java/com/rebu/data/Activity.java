package com.rebu.data;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "customers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Activity {
    private List<String> sign_in;
    private List<String> sign_out;
    private List<Travel_History> travel_history;
    private List<String> receipts;
}
