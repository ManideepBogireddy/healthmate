package com.healthmate.service;

import com.healthmate.model.DietPlan;
import com.healthmate.repository.DietPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DietPlanService {
    @Autowired
    private DietPlanRepository dietPlanRepository;

    public DietPlan createDietPlan(DietPlan dietPlan) {
        return dietPlanRepository.save(dietPlan);
    }

    public List<DietPlan> getDietPlansByTrainer(String trainerId) {
        return dietPlanRepository.findByTrainerId(trainerId);
    }

    public void deleteDietPlan(String id) {
        dietPlanRepository.deleteById(id);
    }
}
