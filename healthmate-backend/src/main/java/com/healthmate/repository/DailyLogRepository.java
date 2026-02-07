package com.healthmate.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.healthmate.model.DailyLog;

public interface DailyLogRepository extends MongoRepository<DailyLog, String> {
    List<DailyLog> findByUserIdOrderByDateAsc(String userId);

    Optional<DailyLog> findByUserIdAndDate(String userId, LocalDate date);
}
