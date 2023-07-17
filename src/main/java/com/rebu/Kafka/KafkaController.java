package com.rebu.Kafka;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/Kafka")
@CrossOrigin(origins = "*")
public class KafkaController {

    @Autowired
    ProducerService producer;

    @PostMapping("/producerMsg")
    public void getMessage(@RequestBody Map<String, String> payload) {
        producer.sendMessage(payload.get("message"));
    }
}
