package com.healthmate.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.healthmate.model.ERole;
import com.healthmate.model.Role;

public interface RoleRepository extends MongoRepository<Role, String> {
  Optional<Role> findByName(ERole name);
}
