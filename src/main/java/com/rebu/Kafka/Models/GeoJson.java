package com.rebu.Kafka.Models;

import java.util.List;

import lombok.Data;

@Data
public class GeoJson {
    String type;
    Crs crs;
    List<Feature> features;

    @Data
    public class Crs {
        String type;
        CrsProperties properties;
    }

    @Data
    public class CrsProperties {
        String href;
        String type;
    }

    @Data
    public class Feature {
        String type;
        Geometry geometry;
        FeatureProperties properties;
    }

    @Data
    public class Geometry {
        String type;
        List<List<Float>> coordinates;
    }

    @Data
    public class FeatureProperties {
        String timestamp;
        Integer taxi_count;
        ApiInfo api_info;
    }

    @Data
    public class ApiInfo {
        String status;
    }

}