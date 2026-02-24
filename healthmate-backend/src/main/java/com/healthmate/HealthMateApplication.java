package com.healthmate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.healthmate.model.ERole;
import com.healthmate.model.Role;
import com.healthmate.repository.RoleRepository;

@SpringBootApplication
public class HealthMateApplication {

	public static void main(String[] args) {
		SpringApplication.run(HealthMateApplication.class, args);
	}

	@Bean
	CommandLineRunner init(RoleRepository roleRepository) {
		return args -> {
			if (!roleRepository.findByName(ERole.ROLE_USER).isPresent()) {
				roleRepository.save(new Role(ERole.ROLE_USER));
			}
			if (!roleRepository.findByName(ERole.ROLE_ADMIN).isPresent()) {
				roleRepository.save(new Role(ERole.ROLE_ADMIN));
			}
		};
	}

}
