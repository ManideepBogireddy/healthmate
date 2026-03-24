package com.healthmate.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.healthmate.model.ModerationLog;

public interface ModerationLogRepository extends MongoRepository<ModerationLog, String> {
}
