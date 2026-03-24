package com.healthmate.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.healthmate.model.Trainer;

public interface TrainerRepository extends MongoRepository<Trainer, String> {
    Optional<Trainer> findByUserId(String userId);
}
