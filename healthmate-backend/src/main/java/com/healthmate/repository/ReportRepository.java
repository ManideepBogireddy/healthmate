package com.healthmate.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.healthmate.model.Report;

public interface ReportRepository extends MongoRepository<Report, String> {
    List<Report> findByStatus(String status);
}
