package com.healthmate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import com.healthmate.model.ERole;
import com.healthmate.model.Role;
import com.healthmate.model.Trainer;
import com.healthmate.repository.RoleRepository;
import com.healthmate.repository.TrainerRepository;

import java.util.Arrays;

@SpringBootApplication
@EnableMongoAuditing
public class HealthMateApplication {

	public static void main(String[] args) {
		SpringApplication.run(HealthMateApplication.class, args);
	}

	@Autowired
	private TrainerRepository trainerRepository;

	@Bean
	CommandLineRunner init(RoleRepository roleRepository) {
		return args -> {
			if (!roleRepository.findByName(ERole.ROLE_USER).isPresent()) {
				roleRepository.save(new Role(ERole.ROLE_USER));
			}
			if (!roleRepository.findByName(ERole.ROLE_ADMIN).isPresent()) {
				roleRepository.save(new Role(ERole.ROLE_ADMIN));
			}
			if (!roleRepository.findByName(ERole.ROLE_TRAINER).isPresent()) {
				roleRepository.save(new Role(ERole.ROLE_TRAINER));
			}

			// Seed Trainers if not present
			if (trainerRepository.count() == 0) {
				Trainer t1 = new Trainer();
				t1.setName("Alex Rivera");
				t1.setBio("Bodybuilding specialist with 10 years experience.");
				t1.setExperience("10 Years");
				t1.setSpecialties(Arrays.asList("Bodybuilding", "Nutrition", "Strength"));
				t1.setCompatibleGoals(Arrays.asList("Build Muscle", "Weight Loss"));
				t1.setRating(4.9);
				t1.setReviewCount(128);

				Trainer t2 = new Trainer();
				t2.setName("Sarah Chen");
				t2.setBio("Yoga and mindfulness coach helping you find balance.");
				t2.setExperience("6 Years");
				t2.setSpecialties(Arrays.asList("Yoga", "Flexibility", "Mindfulness"));
				t2.setCompatibleGoals(Arrays.asList("Flexibility", "Stress Reduction", "Maintenance"));
				t2.setRating(4.8);
				t2.setReviewCount(95);

				trainerRepository.saveAll(Arrays.asList(t1, t2));
			}
		};
	}

}
