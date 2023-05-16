package com.rebu;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user")
public class User {
    private ObjectId id;
    private String user;
}
