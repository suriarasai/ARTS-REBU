package com.rebu.Kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/api")
public class KafkaController {
    
    @Autowired
    ProducerService producer;

    @GetMapping("/producerMsg")
    public void getMessage(@RequestParam("message") String message) {
        producer.sendMessage(message);
    }
}
