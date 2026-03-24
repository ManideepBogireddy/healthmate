package com.healthmate.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthmate.model.Trainer;
import com.healthmate.model.DietPlan;
import com.healthmate.model.WorkoutPlan;
import com.healthmate.repository.TrainerRepository;
import com.healthmate.repository.DietPlanRepository;
import com.healthmate.repository.WorkoutPlanRepository;

@RestController
@RequestMapping("/api/seed")
public class SeedController {

    @Autowired
    private TrainerRepository trainerRepository;
    
    @Autowired
    private DietPlanRepository dietPlanRepository;
    
    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @GetMapping("/trainers")
    public String seedTrainers() {
        trainerRepository.deleteAll();
        dietPlanRepository.deleteAll();
        workoutPlanRepository.deleteAll();

        // Format: {Trainer, Gym, State, City, Address, Contact}
        List<String[]> data = Arrays.asList(
            new String[]{"Rahul Sharma", "Cult.fit", "Telangana", "Hyderabad", "Banjara Hills, Hyderabad", "support@cult.fit"},
            new String[]{"Anjali Verma", "Gold’s Gym", "Karnataka", "Bengaluru", "Indiranagar, Bengaluru", "info@goldsgym.in"},
            new String[]{"Karan Mehta", "Talwalkars Fitness", "Maharashtra", "Mumbai", "Andheri West, Mumbai", "support@talwalkars.net"},
            new String[]{"Arjun Reddy", "Cult.fit", "Andhra Pradesh", "Visakhapatnam", "Dwaraka Nagar, Vizag", "support@cult.fit"},
            new String[]{"Tsering Norbu", "Anytime Fitness", "Arunachal Pradesh", "Itanagar", "Bank Tinali Area, Itanagar", "info@anytimefitness.com"},
            new String[]{"Rohit Das", "Gold’s Gym", "Assam", "Guwahati", "GS Road, Guwahati", "info@goldsgym.in"},
            new String[]{"Amit Kumar", "Talwalkars", "Bihar", "Patna", "Boring Road, Patna", "support@talwalkars.net"},
            new String[]{"Rakesh Sahu", "Cult.fit", "Chhattisgarh", "Raipur", "GE Road, Raipur", "support@cult.fit"},
            new String[]{"Vikram Naik", "Anytime Fitness", "Goa", "Panaji", "Miramar Area, Panaji", "info@anytimefitness.com"},
            new String[]{"Jay Patel", "Gold’s Gym", "Gujarat", "Ahmedabad", "Satellite Road, Ahmedabad", "info@goldsgym.in"},
            new String[]{"Sandeep Malik", "Cult.fit", "Haryana", "Gurugram", "DLF Phase 2, Gurugram", "support@cult.fit"},
            new String[]{"Deepak Thakur", "Anytime Fitness", "Himachal Pradesh", "Shimla", "Mall Road Area, Shimla", "info@anytimefitness.com"},
            new String[]{"Ajay Singh", "Gold’s Gym", "Jharkhand", "Ranchi", "Lalpur Road, Ranchi", "info@goldsgym.in"},
            new String[]{"Manoj Nair", "Talwalkars", "Kerala", "Kochi", "MG Road, Kochi", "support@talwalkars.net"},
            new String[]{"Raj Sharma", "Cult.fit", "Madhya Pradesh", "Indore", "Vijay Nagar, Indore", "support@cult.fit"},
            new String[]{"Nongthombam Raj", "Fitness First", "Manipur", "Imphal", "Thangal Bazar, Imphal", "info@fitnessfirst.com"},
            new String[]{"David Kharkongor", "Anytime Fitness", "Meghalaya", "Shillong", "Police Bazar, Shillong", "info@anytimefitness.com"},
            new String[]{"Lalremruata", "Fitness Arena", "Mizoram", "Aizawl", "Dawrpui Area, Aizawl", "fitnessarena@gmail.com"},
            new String[]{"Imkong Walling", "Fitness Factory", "Nagaland", "Kohima", "PR Hill Area, Kohima", "fitnessfactory@gmail.com"},
            new String[]{"Subhajit Das", "Gold’s Gym", "Odisha", "Bhubaneswar", "Saheed Nagar, Bhubaneswar", "info@goldsgym.in"},
            new String[]{"Gurpreet Singh", "Talwalkars", "Punjab", "Chandigarh", "Sector 35, Chandigarh", "support@talwalkars.net"},
            new String[]{"Mahesh Sharma", "Cult.fit", "Rajasthan", "Jaipur", "Malviya Nagar, Jaipur", "support@cult.fit"},
            new String[]{"Tashi Lepcha", "Anytime Fitness", "Sikkim", "Gangtok", "MG Marg Area, Gangtok", "info@anytimefitness.com"},
            new String[]{"Prakash Iyer", "Cult.fit", "Tamil Nadu", "Chennai", "T Nagar, Chennai", "support@cult.fit"},
            new String[]{"Bikram Debbarma", "Fitness World", "Tripura", "Agartala", "Central Road, Agartala", "fitnessworld@gmail.com"},
            new String[]{"Amit Verma", "Gold’s Gym", "Uttar Pradesh", "Lucknow", "Gomti Nagar, Lucknow", "info@goldsgym.in"},
            new String[]{"Rohit Rawat", "Anytime Fitness", "Uttarakhand", "Dehradun", "Rajpur Road, Dehradun", "info@anytimefitness.com"},
            new String[]{"Sourav Sen", "Gold’s Gym", "West Bengal", "Kolkata", "Park Street, Kolkata", "info@goldsgym.in"}
        );

        Random random = new Random();
        List<String> specs = Arrays.asList("Strength Training", "Weight Loss Coaching", "Yoga & Wellness", "General Fitness");

        for (String[] row : data) {
            String name = row[0];
            String gym = row[1];
            String state = row[2];
            String city = row[3];
            String address = row[4];
            String contact = row[5];
            String spec = specs.get(random.nextInt(specs.size()));

            Trainer t = new Trainer();
            t.setName(name);
            t.setCountry("India");
            t.setState(state);
            t.setCity(city);
            t.setAddress(address);
            t.setEmail(contact);
            t.setPhoneNumber("+91-" + (70000 + random.nextInt(20000)) + "-" + (10000 + random.nextInt(89999)));
            t.setCertified(true);
            t.setExperience((5 + random.nextInt(10)) + " Years");
            t.setBio(String.format("Professional %s expert at %s. Dedicated to helping clients achieve their health goals with personalized training and expert guidance.", spec, gym));
            t.setSpecialties(Arrays.asList(spec, "General Fitness"));
            t.setRating(4.5 + (random.nextDouble() * 0.5));
            t.setReviewCount(50 + random.nextInt(200));
            t.setCompatibleGoals(generateGoals(spec));
            t.setImageUrl("https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200");
            
            t = trainerRepository.save(t);
            seedPlansForTrainer(t.getId(), spec, random);
        }

        return String.format("Successfully seeded exactly 28 real professional trainers from the provided dataset across all Indian states!");
    }

    @GetMapping("/telangana-yoga")
    public String seedTelanganaYoga() {
        List<Trainer> telanganaTrainers = new ArrayList<>();

        // 1. Venkatesh Sir
        Trainer v1 = new Trainer();
        v1.setName("Venkatesh Sir (Patanjali Yoga and Body Care)");
        v1.setBio("Affiliated with Patanjali Yoga Kendra; offers home-visit sessions. 20+ years of teaching experience.");
        v1.setExperience("20+ Years");
        v1.setSpecialties(Arrays.asList("Yoga", "Wellness", "Body Care", "Therapy"));
        v1.setCountry("India");
        v1.setState("Telangana");
        v1.setCity("Hyderabad");
        v1.setAddress("Nimboliadda, Ramkote, Hyderabad");
        v1.setPhoneNumber("+91 70709 99313");
        v1.setCertified(true);
        v1.setRating(4.9);
        v1.setReviewCount(150);
        v1.setCompatibleGoals(generateGoals("Yoga"));
        telanganaTrainers.add(v1);

        // 2. Abhiram Sir
        Trainer v2 = new Trainer();
        v2.setName("Abhiram Sir (Abhiram Yogashala)");
        v2.setBio("Professional coaching for weight loss and spine alignment. Level 3 certified by the Ministry of Ayush, Government of India.");
        v2.setExperience("Multiple Years");
        v2.setSpecialties(Arrays.asList("Yoga", "Weight Loss", "Spine Alignment"));
        v2.setCountry("India");
        v2.setState("Telangana");
        v2.setCity("Hyderabad");
        v2.setCertified(true);
        v2.setRating(4.8);
        v2.setReviewCount(85);
        v2.setCompatibleGoals(generateGoals("Yoga"));
        telanganaTrainers.add(v2);

        // 3. Suneetha G.
        Trainer v3 = new Trainer();
        v3.setName("Suneetha G. (UrbanPro)");
        v3.setBio("Verified Yoga Therapist profile. 13–15 years of experience helping clients through yoga therapy.");
        v3.setExperience("13-15 Years");
        v3.setSpecialties(Arrays.asList("Yoga", "Therapy"));
        v3.setCountry("India");
        v3.setState("Telangana");
        v3.setCity("Hyderabad");
        v3.setAddress("Sanath Nagar, Hyderabad");
        v3.setCertified(true);
        v3.setRating(4.7);
        v3.setReviewCount(110);
        v3.setCompatibleGoals(generateGoals("Yoga"));
        telanganaTrainers.add(v3);

        // 4. Saptharishi Yoga Vidyakendram
        Trainer v4 = new Trainer();
        v4.setName("Saptharishi Yoga Vidyakendram");
        v4.setBio("Established in 2000 (25+ years). Located at Road No. 9, Film Nagar, Hyderabad.");
        v4.setExperience("25+ Years");
        v4.setSpecialties(Arrays.asList("Yoga"));
        v4.setCountry("India");
        v4.setState("Telangana");
        v4.setCity("Hyderabad");
        v4.setAddress("Road No. 9, Film Nagar");
        v4.setCertified(true);
        v4.setRating(4.9);
        v4.setReviewCount(200);
        v4.setCompatibleGoals(generateGoals("Yoga"));
        telanganaTrainers.add(v4);

        trainerRepository.saveAll(telanganaTrainers);
        return "Successfully added 4 new yoga trainers for Telangana!";
    }

    @GetMapping("/india-yoga-all")
    public String seedIndiaYogaAll() {
        List<Trainer> trainers = new ArrayList<>();

        // Helper to create trainer
        // Format: {State, Name, Location, Bio/Details, Contact}
        List<String[]> data = Arrays.asList(
            new String[]{"Andhra Pradesh", "Yoga Consciousness Trust", "Vizianagaram", "Long-standing institution", "Member Directory"},
            new String[]{"Arunachal Pradesh", "Taku Mommpa", "State Coordinator", "Coordinator for Art of Living", "+91-9436041040"},
            new String[]{"Chhattisgarh", "Sarita Bajpai", "State Coordinator", "Professional Coordinator", "+91-9425215338"},
            new String[]{"Goa", "Alpesh Yoga", "Arambol/Dharamshala", "20+ years; Yoga Alliance", "+91-97193 04075"},
            new String[]{"Himachal Pradesh", "Manish Rana", "State Coordinator", "Professional Coordinator", "+91-9816295113"},
            new String[]{"Jammu & Kashmir", "Directorate of Ayush", "Srinagar / Jammu", "Government overseen", "0194-2496198"},
            new String[]{"Jharkhand", "Navin Chourasia", "State Coordinator", "Professional Coordinator", "+91-9431340030"},
            new String[]{"Manipur", "Ayush Health Centers", "Various Districts", "Ministry of Ayush verified", "Ayush Portal"},
            new String[]{"Meghalaya", "Local Ayush Centers", "Shillong", "Government Wellness Centers", "National Ayush Mission"},
            new String[]{"Mizoram", "Yoga Wellness Centers", "Aizawl", "AYUSH-affiliated instructors", "Ayush Health Portal"},
            new String[]{"Nagaland", "Ayush Wellness Units", "Kohima / Dimapur", "Verified under National Mission", "Ministry of Ayush"},
            new String[]{"Sikkim", "Ayush Wellness Units", "Gangtok", "Ministry of Ayush verified", "Ayush Wellness"},
            new String[]{"Tripura", "Ayush Wellness Units", "Agartala", "Verified Wellness Centers", "Ayush Portal"},
            new String[]{"Uttarakhand", "AYM Yoga School", "Rishikesh", "Led by Yogi Chetan Mahesh", "+91-75002 77709"}
        );

        for (String[] row : data) {
            Trainer t = new Trainer();
            t.setState(row[0]);
            t.setName(row[1]);
            t.setCity(row[2]);
            t.setBio(row[3]);
            t.setPhoneNumber(row[4]);
            t.setCountry("India");
            t.setSpecialties(Arrays.asList("Yoga", "Wellness"));
            t.setCertified(true);
            t.setExperience("Professional");
            t.setRating(4.5 + (new Random().nextDouble() * 0.5));
            t.setReviewCount(30 + new Random().nextInt(100));
            t.setCompatibleGoals(generateGoals("Yoga"));
            trainers.add(t);
        }

        trainerRepository.saveAll(trainers);
        return "Successfully added " + trainers.size() + " new yoga trainers across India!";
    }

    @GetMapping("/telangana-strength")
    public String seedTelanganaStrength() {
        List<Trainer> trainers = new ArrayList<>();

        // 1. Venkatesh Sir (Same as Yoga but with Strength focus)
        Trainer t1 = new Trainer();
        t1.setName("Venkatesh Sir (Patanjali Yoga and Body Care)");
        t1.setBio("Specializing in Strength training and body building, including home-visit services. 20+ years of experience.");
        t1.setExperience("20+ Years");
        t1.setSpecialties(Arrays.asList("Strength Training", "Bodybuilding", "Yoga", "Home Services"));
        t1.setCountry("India");
        t1.setState("Telangana");
        t1.setCity("Hyderabad");
        t1.setAddress("Nimboliadda, Ramkote, Hyderabad");
        t1.setPhoneNumber("+91 70709 99313");
        t1.setCertified(true);
        t1.setRating(4.9);
        t1.setReviewCount(180);
        t1.setCompatibleGoals(generateGoals("Strength"));
        trainers.add(t1);

        // 2. Sachin Kanvinde
        Trainer t2 = new Trainer();
        t2.setName("Sachin Kanvinde (Sreenidhi Sports Academy)");
        t2.setBio("ISSA Certified Strength & Conditioning Coach; Level 1 Cricket Coach (ICC Academy). 14 years of professional coaching.");
        t2.setExperience("14 Years");
        t2.setSpecialties(Arrays.asList("Strength Training", "Conditioning", "Sports Coaching"));
        t2.setCountry("India");
        t2.setState("Telangana");
        t2.setCertified(true);
        t2.setRating(4.8);
        t2.setReviewCount(95);
        t2.setCompatibleGoals(generateGoals("Strength"));
        trainers.add(t2);

        // 3. Sridhar Uppal
        Trainer t3 = new Trainer();
        t3.setName("Sridhar Uppal (Personal Trainer)");
        t3.setBio("Internationally certified Personal Fitness Coach and Advanced Yoga Trainer. Custom wellness programs for strength and nutrition.");
        t3.setExperience("10+ Years");
        t3.setSpecialties(Arrays.asList("Strength Training", "Yoga", "Nutrition", "Wellness"));
        t3.setCountry("India");
        t3.setState("Telangana");
        t3.setCity("Hyderabad");
        t3.setCertified(true);
        t3.setRating(4.8);
        t3.setReviewCount(120);
        t3.setCompatibleGoals(generateGoals("Strength"));
        trainers.add(t3);

        // 4. Naveed
        Trainer t4 = new Trainer();
        t4.setName("Naveed (Personal Fitness Trainer)");
        t4.setBio("Body transformation, toning, and endurance using methods like TRX, German Volume Training, and CrossFit.");
        t4.setExperience("10 Years");
        t4.setSpecialties(Arrays.asList("Strength Training", "TRX", "CrossFit", "Body Transformation"));
        t4.setCountry("India");
        t4.setState("Telangana");
        t4.setCertified(true);
        t4.setRating(4.7);
        t4.setReviewCount(88);
        t4.setCompatibleGoals(generateGoals("Strength"));
        trainers.add(t4);

        // 5. Prime Strength (Cult.fit)
        Trainer t5 = new Trainer();
        t5.setName("Prime Strength (Cult.fit)");
        t5.setBio("High-quality equipment for powerlifting, CrossFit, and personalized fitness plans.");
        t5.setSpecialties(Arrays.asList("Powerlifting", "CrossFit", "Strength Training"));
        t5.setCountry("India");
        t5.setState("Telangana");
        t5.setCity("Gandi Maisamma, Hyderabad");
        t5.setPhoneNumber("+91 90305 88894");
        t5.setCertified(true);
        t5.setRating(4.6);
        t5.setReviewCount(210);
        t5.setCompatibleGoals(generateGoals("Strength"));
        trainers.add(t5);

        // 6. RK Body and Soul
        Trainer t6 = new Trainer();
        t6.setName("RK Body and Soul");
        t6.setBio("Certified trainers (Rakesh Rathod and Bharath Kumar) for strength building and body toning. 11 years in home training.");
        t6.setExperience("11 Years");
        t6.setSpecialties(Arrays.asList("Strength Building", "Body Toning", "Home Training"));
        t6.setCountry("India");
        t6.setState("Telangana");
        t6.setCity("Gachibowli/Kondapur/Kukatapally, Hyderabad");
        t6.setPhoneNumber("+91 98669 93858");
        t6.setCertified(true);
        t6.setRating(4.7);
        t6.setReviewCount(135);
        t6.setCompatibleGoals(generateGoals("Strength"));
        trainers.add(t6);

        // 7. Inner Strength (Studio)
        Trainer t7 = new Trainer();
        t7.setName("Inner Strength (Studio)");
        t7.setBio("Strength and conditioning studio focused on weight training and bodyweight exercises.");
        t7.setExperience("9 Years");
        t7.setSpecialties(Arrays.asList("Weight Training", "Bodyweight Exercises", "Strength Training"));
        t7.setCountry("India");
        t7.setState("Telangana");
        t7.setCity("Tarnaka, Hyderabad");
        t7.setCertified(true);
        t7.setRating(4.5);
        t7.setReviewCount(65);
        t7.setCompatibleGoals(generateGoals("Strength"));
        trainers.add(t7);

        // 8. MeerXFit
        Trainer t8 = new Trainer();
        t8.setName("MeerXFit");
        t8.setBio("Internationally certified coaching for lean muscle, bodybuilding, and contest prep (Offline & Online).");
        t8.setSpecialties(Arrays.asList("Bodybuilding", "Lean Muscle", "Contest Prep"));
        t8.setCountry("India");
        t8.setState("Telangana");
        t8.setCity("Secunderabad, Hyderabad");
        t8.setPhoneNumber("+91 72076 67164");
        t8.setCertified(true);
        t8.setRating(4.9);
        t8.setReviewCount(142);
        t8.setCompatibleGoals(generateGoals("Strength"));
        trainers.add(t8);

        trainerRepository.saveAll(trainers);
        return "Successfully added 8 new strength trainers for Telangana!";
    }

    @GetMapping("/andhra-pradesh-trainers")
    public String seedAndhraPradeshTrainers() {
        List<Trainer> trainers = new ArrayList<>();

        // Helper for consistent goal generation
        // 1. Yoga Trainers (AP)
        trainers.add(createTrainer("Sphoorthi Yoga Therapy", "Machavaram, Vijayawada", "Senior Faculty", 
            "Clinical Yoga specialized in Diabetes, PCOD, and Obesity management.", "+91 98496 70541", "Yoga", "Andhra Pradesh", 4.9, 150));
        
        trainers.add(createTrainer("Sri Sai Sakthi Yoga", "AP (Online Focused)", "Ministry of AYUSH Certified", 
            "Globally recognized, providing home-visit & online yoga sessions.", "+91 94907 29705", "Yoga", "Andhra Pradesh", 4.8, 120));
        
        trainers.add(createTrainer("AdiGuru Yogapeetham", "Ramaraopeta, Kakinada", "10+ Years", 
            "Traditional Hatha Yoga & Yoga Teacher Training specialist.", "+91 93921 87954", "Yoga", "Andhra Pradesh", 4.8, 95));
        
        trainers.add(createTrainer("Yoga Village (AU)", "RK Beach, Visakhapatnam", "Institutional", 
            "Academic Yoga & Stress Management programs by Andhra University.", "Official Portal", "Yoga", "Andhra Pradesh", 4.7, 300));

        // 2. Strength Training (AP)
        trainers.add(createTrainer("JB Personal Training Gym", "Vishalakshi Nagar, Visakhapatnam", "K11 Certified", 
            "Specializes in Powerlifting, Muscle Gain, and Natural Bodybuilding.", "+91 62811 09369", "Strength Training", "Andhra Pradesh", 4.9, 85));
        
        trainers.add(createTrainer("Varun Fitness", "Siripuram, Visakhapatnam", "Highly Experienced", 
            "Highly rated for experienced trainers and imported professional strength equipment.", "Justdial Listing", "Strength Training", "Andhra Pradesh", 4.8, 210));
        
        trainers.add(createTrainer("Teja Kalla", "Gayatri Nagar, Vijayawada", "Mr. Andhra Medalist", 
            "Physique transformation and advanced strength training specialist.", "UrbanPro Profile", "Strength Training", "Andhra Pradesh", 5.0, 45));
        
        trainers.add(createTrainer("Aquib Fitness", "Chittoor", "ASCA Level 1", 
            "Australian Strength and Conditioning Association certified coach.", "LinkedIn", "Strength Training", "Andhra Pradesh", 4.7, 30));
        
        trainers.add(createTrainer("Combat Gym & Fitness", "Satram Centre, Guntur", "Specialist Unit", 
            "First original combat-style strength center in Guntur focusing on functional power.", "+91 73827 27393", "Strength Training", "Andhra Pradesh", 4.8, 65));
        
        trainers.add(createTrainer("RB Gym AC", "Air Bypass Road, Tirupati", "Senior Staff", 
            "Well-equipped for heavy resistance training with knowledgeable personal trainers.", "+91 93909 08590", "Strength Training", "Andhra Pradesh", 4.6, 110));

        trainers.add(createTrainer("Darur Life Studio", "Anantapur", "Established 2023", 
            "Multi-facility center providing gym, swimming, and yoga with personal gym trainers.", "+91 91107 43339", "Strength Training", "Andhra Pradesh", 4.7, 75));
        
        trainers.add(createTrainer("Classic Gym Fitness", "Khammam Border/AP", "National Level Powerlifters", 
            "Specializing in strength building with national-level powerlifting players.", "Justdial Listing", "Strength Training", "Andhra Pradesh", 4.8, 55));
        
        trainers.add(createTrainer("Indian Gold'S Fitness", "Gajuwaka, Visakhapatnam", "5-Star Rated", 
            "Offers specialized strength training in a spacious, professional environment.", "Justdial Listing", "Strength Training", "Andhra Pradesh", 4.9, 140));

        // 3. General Fitness (AP)
        trainers.add(createTrainer("D. Sasikanth", "Vijayawada", "10+ Years (ISSA)", 
            "ISSA Certified Personal Trainer; expert in functional and lifestyle fitness.", "UrbanPro Profile", "General Fitness", "Andhra Pradesh", 4.9, 60));
        
        trainers.add(createTrainer("Home Personal Trainer", "Patamata, Vijayawada", "Senior Staff", 
            "Provides certified trainers for home-visit gym & yoga sessions.", "+91 85002 44344", "General Fitness", "Andhra Pradesh", 5.0, 90));
        
        trainers.add(createTrainer("V Fitness", "Singh Nagar, Vijayawada", "Professional Team", 
            "Known for knowledgeable trainers and multiple accessible package options.", "+91 866 244 3444", "General Fitness", "Andhra Pradesh", 4.7, 180));
        
        trainers.add(createTrainer("Platinum Gym", "Kalidindi, Krishna", "Well-Experienced", 
            "Recognized as one of the best local gyms with experienced trainers.", "Justdial Listing", "General Fitness", "Andhra Pradesh", 4.8, 70));
        
        trainers.add(createTrainer("Steel Gym", "Mylavaram", "Personalized Team", 
            "Provides personalized fitness plans and functional training programs.", "Justdial Listing", "General Fitness", "Andhra Pradesh", 4.6, 50));

        // 4. Weight Loss (AP)
        trainers.add(createTrainer("My Health My Care", "Maharanipeta, Visakhapatnam", "Clinical Staff", 
            "Specialists in both weight loss and gain with dedicated diet counseling.", "+91 891 250 8822", "Weight Loss", "Andhra Pradesh", 4.9, 230));
        
        trainers.add(createTrainer("HFNC Weight Loss Center", "CBM Compound, Visakhapatnam", "Result-Oriented", 
            "Noted for tasty diet plans and high-level caring supervision for transformation.", "+91 891 663 3333", "Weight Loss", "Andhra Pradesh", 4.8, 190));
        
        trainers.add(createTrainer("Dr. Mohan's Diabetes Specialties Centre", "Vijayawada/Vizag", "30+ Years Group", 
            "Specialized medical team focusing on weight management for metabolic health.", "Official Website", "Weight Loss", "Andhra Pradesh", 4.7, 500));
        
        trainers.add(createTrainer("Lifestyle Nutrition Wellness", "Devi Chowk, Rajahmundry", "Expert Dietitians", 
            "Provides expert dietitians for scientific weight loss without side effects.", "Justdial Listing", "Weight Loss", "Andhra Pradesh", 4.8, 80));
        
        trainers.add(createTrainer("Moulika Tekumudi", "Kakinada / Online", "8+ Years", 
            "Certified Dietitian (Swastha Nutricure); specialist in sustainable weight loss.", "Official Site", "Weight Loss", "Andhra Pradesh", 5.0, 40));
        
        trainers.add(createTrainer("C Pro Gym", "Satram Centre, Guntur", "Transformation Experts", 
            "Specialized fat-loss batches with integrated nutrition tracking.", "+91 863 223 3444", "Weight Loss", "Andhra Pradesh", 4.7, 55));

        trainerRepository.saveAll(trainers);
        return "Successfully added " + trainers.size() + " new trainers for Andhra Pradesh!";
    }

    @GetMapping("/karnataka-trainers")
    public String seedKarnatakaTrainers() {
        List<Trainer> trainers = new ArrayList<>();

        // 1. Yoga (Karnataka)
        trainers.add(createTrainer("Vivekananda School of Yoga", "Jayanagar, Bengaluru", "25+ Years", 
            "Therapeutic yoga specialist focusing on traditional Hatha and wellness.", "+91 94480 50058", "Yoga", "Karnataka", 4.9, 210));
        
        trainers.add(createTrainer("Aakash Yoga Centre", "Indiranagar, Bengaluru", "15+ Years", 
            "Specializes in Hatha & Power Yoga for modern lifestyle balance.", "+91 98860 12345", "Yoga", "Karnataka", 4.8, 145));
        
        trainers.add(createTrainer("Pradipika Yoga", "JP Nagar, Bengaluru", "Yoga Alliance International", 
            "Registered TTC center offering professional yoga teacher training.", "+91 96113 06611", "Yoga", "Karnataka", 4.7, 90));
        
        trainers.add(createTrainer("S-VYASA University", "Jigani, Bengaluru", "35+ Years", 
            "Global research hub for yoga therapy and academic excellence.", "+91 80 2263 9961", "Yoga", "Karnataka", 5.0, 550));

        // 2. Strength (Karnataka)
        trainers.add(createTrainer("The Outfit", "Indiranagar, Bengaluru", "CrossFit Specialist", 
            "Premier CrossFit and functional strength training destination.", "+91 99166 12344", "Strength Training", "Karnataka", 4.9, 180));
        
        trainers.add(createTrainer("Leon Maestro De Fitness", "HRBR Layout, Bengaluru", "Advanced Bodybuilding", 
            "Specialized in contest prep and advanced bodybuilding techniques.", "+91 80 4371 4344", "Strength Training", "Karnataka", 4.8, 120));
        
        trainers.add(createTrainer("Coach Shajahan A.K.", "Online/Home, Bengaluru", "15 Years", 
            "International professional coach for personalized strength and hypertrophy.", "+91 80471 08460", "Strength Training", "Karnataka", 4.9, 65));
        
        trainers.add(createTrainer("The Flux Studio", "Indiranagar, Bengaluru", "Athletic Conditioning", 
            "Focuses on professional athletic conditioning and explosive power.", "+91 96634 32101", "Strength Training", "Karnataka", 4.7, 95));

        // 3. General Fitness (Karnataka)
        trainers.add(createTrainer("O2 The Fitness", "JP Nagar, Bengaluru", "Certified Staff", 
            "Well-equipped gym providing expert general fitness guidance.", "+91 80 4324 4344", "General Fitness", "Karnataka", 4.6, 110));
        
        trainers.add(createTrainer("Snap Fitness 24/7", "Koramangala, Bengaluru", "Global Standards", 
            "24/7 accessible fitness center with globally certified internal trainers.", "+91 80 4152 4344", "General Fitness", "Karnataka", 4.7, 200));
        
        trainers.add(createTrainer("Cult.fit (HQ)", "Multiple, Bengaluru", "App-Based Certified", 
            "Structured group workouts led by elite fitness professionals.", "1800-123-4567", "General Fitness", "Karnataka", 4.8, 1200));
        
        trainers.add(createTrainer("Gold's Gym", "Lavelle Road, Bengaluru", "Accredited Staff", 
            "Premium fitness experience with internationally accredited personal trainers.", "+91 80 4112 4344", "General Fitness", "Karnataka", 4.8, 320));

        // 4. Weight Loss (Karnataka)
        trainers.add(createTrainer("Liger Fitness", "BTM Layout, Bengaluru", "Transformation Specialist", 
            "Expert coaching in fat loss and sustainable body transformation.", "+91 90355 12345", "Weight Loss", "Karnataka", 4.9, 130));
        
        trainers.add(createTrainer("BodyCraft Fitness", "Frazer Town, Bengaluru", "Clinical Nutrition", 
            "Combines clinical nutrition with effective fat loss exercise programs.", "+91 80 4160 4344", "Weight Loss", "Karnataka", 4.7, 85));
        
        trainers.add(createTrainer("Figurette", "Jayanagar, Bengaluru", "Women's Specialist", 
            "Specialized weight loss and wellness programs exclusively for women.", "+91 80 2664 4344", "Weight Loss", "Karnataka", 4.8, 150));
        
        trainers.add(createTrainer("Fit iN", "HSR Layout, Bengaluru", "Metabolic Management", 
            "Focuses on metabolic health and lifestyle-led weight management.", "+91 98450 12345", "Weight Loss", "Karnataka", 4.6, 70));

        trainerRepository.saveAll(trainers);
        return "Successfully added 16 new trainers for Karnataka!";
    }

    @GetMapping("/maharashtra-trainers")
    public String seedMaharashtraTrainers() {
        List<Trainer> trainers = new ArrayList<>();

        // 1. Yoga (Maharashtra)
        trainers.add(createTrainer("The Yoga Institute", "Santacruz, Mumbai", "Est. 1918", 
            "The world's oldest organized center for classical yoga and yoga therapy.", "+91 22 2611 0506", "Yoga", "Maharashtra", 5.0, 900));
        
        trainers.add(createTrainer("Kaivalyadhama", "Lonavala/Mumbai", "100 Years", 
            "Scientific yoga research and traditional training institute.", "+91 22 2283 1356", "Yoga", "Maharashtra", 4.9, 450));
        
        trainers.add(createTrainer("Bharat Thakur Artistic Yoga", "Andheri, Mumbai", "Celebrity Trainers", 
            "Dynamic Power Yoga programs led by celebrity-favorite instructors.", "+91 90040 12345", "Yoga", "Maharashtra", 4.8, 220));
        
        trainers.add(createTrainer("Isha Life", "Worli, Mumbai", "Sadhguru-Trained", 
            "Classical Hatha Yoga programs facilitated by highly trained Isha instructors.", "+91 22 2494 4344", "Yoga", "Maharashtra", 4.9, 310));

        // 2. Strength (Maharashtra)
        trainers.add(createTrainer("Bodyholics", "Versova, Mumbai", "Functional Specialist", 
            "Specialized in combined functional strength and athletic performance.", "+91 98200 12345", "Strength Training", "Maharashtra", 4.8, 115));
        
        trainers.add(createTrainer("Orion Fitness", "Pune", "Muscle Building", 
            "Dedicated to powerlifting and heavy muscle-building programs.", "+91 20 2544 4344", "Strength Training", "Maharashtra", 4.7, 85));
        
        trainers.add(createTrainer("Physique Global", "Mumbai", "Elite Coaches", 
            "Personalized strength transformation with coaches to Bollywood stars.", "+91 22 2673 4344", "Strength Training", "Maharashtra", 4.9, 140));
        
        trainers.add(createTrainer("K11 Academy of Fitness", "Santacruz, Mumbai", "Premier Hub", 
            "India’s leading academy for strength certification and science-based training.", "+91 22 2648 4344", "Strength Training", "Maharashtra", 4.9, 600));

        // 3. General Fitness (Maharashtra)
        trainers.add(createTrainer("Waves Gym", "Andheri West, Mumbai", "5-Star Rated", 
            "Top-tier fitness center focusing on comprehensive general health.", "+91 22 6678 4344", "General Fitness", "Maharashtra", 4.8, 280));
        
        trainers.add(createTrainer("Nitish Singh (Fit7)", "Pune", "Chain by MS Dhoni", 
            "General wellness and endurance focused workouts part of Dhoni’s fitness chain.", "+91 20 6720 4344", "General Fitness", "Maharashtra", 4.7, 195));
        
        trainers.add(createTrainer("MultiFit", "Pune/Mumbai", "Functional Specialist", 
            "Focuses on functional movement and multi-disciplinary fitness.", "+91 80106 12345", "General Fitness", "Maharashtra", 4.8, 340));
        
        trainers.add(createTrainer("Fitness First", "BKC, Mumbai", "Premium Global", 
            "Premium health club featuring international trainers and high-end tech.", "+91 22 6127 4344", "General Fitness", "Maharashtra", 4.9, 410));

        // 4. Weight Loss (Maharashtra)
        trainers.add(createTrainer("Leena Mogre's Fitness", "Bandra, Mumbai", "25+ Years", 
            "Led by the 'Transformation Guru', focusing on long-term fat loss.", "+91 22 2642 4344", "Weight Loss", "Maharashtra", 4.9, 180));
        
        trainers.add(createTrainer("Dr. Mickey Mehta", "Mumbai", "Holistic Specialist", 
            "World-renowned specialist for holistic health and weight management.", "+91 22 2367 4344", "Weight Loss", "Maharashtra", 5.0, 520));
        
        trainers.add(createTrainer("Talwalkars", "Multiple Locations", "Legacy Brand", 
            "An established legacy in providing reliable weight loss programs nationwide.", "+91 22 2432 4344", "Weight Loss", "Maharashtra", 4.6, 1100));
        
        trainers.add(createTrainer("Sheru Classic Gym", "Mumbai", "Transformation Pro", 
            "Intense transformation protocols for high-burn fat loss results.", "+91 22 2614 4344", "Weight Loss", "Maharashtra", 4.8, 150));

        trainerRepository.saveAll(trainers);
        return "Successfully added 16 new trainers for Maharashtra!";
    }

    @GetMapping("/tamilnadu-trainers")
    public String seedTamilNaduTrainers() {
        List<Trainer> trainers = new ArrayList<>();

        // 1. Yoga (Tamil Nadu)
        trainers.add(createTrainer("Krishnamacharya Yoga Mandiram", "Chennai", "45+ Years", 
            "A premier center for yoga therapy and studies in the Vedic tradition.", "+91 44 2493 7998", "Yoga", "Tamil Nadu", 4.9, 380));
        
        trainers.add(createTrainer("Isha Foundation", "Coimbatore", "Global Hub", 
            "The international headquarters for Isha Hatha Yoga teacher training.", "+91 83000 83111", "Yoga", "Tamil Nadu", 5.0, 1500));
        
        trainers.add(createTrainer("1to1 Yoga", "Adyar, Chennai", "Personalized", 
            "Offers personalized home-visit yoga sessions tailored to individual needs.", "+91 44 4211 4344", "Yoga", "Tamil Nadu", 4.7, 65));
        
        trainers.add(createTrainer("Asana Andiappan", "Anna Nagar, Chennai", "60+ Years", 
            "Traditional lineage-based yoga school specializing in Hatha Yoga.", "+91 44 2626 4344", "Yoga", "Tamil Nadu", 4.8, 140));

        // 2. Strength (Tamil Nadu)
        trainers.add(createTrainer("Coach Kannan", "Koyambedu, Chennai", "10+ Years", 
            "Expert coach for professional athletes focusing on advanced conditioning.", "+91 98400 12345", "Strength Training", "Tamil Nadu", 4.9, 75));
        
        trainers.add(createTrainer("Slam Fitness", "Multiple Locations, Chennai", "Hardcore Strength", 
            "Known for hardcore strength training and professional powerlifting support.", "+91 44 4355 4344", "Strength Training", "Tamil Nadu", 4.7, 320));
        
        trainers.add(createTrainer("The Unit", "Nungambakkam, Chennai", "Advanced Conditioning", 
            "Specialized in high-performance conditioning and elite strength training.", "+91 44 4213 4344", "Strength Training", "Tamil Nadu", 4.8, 110));
        
        trainers.add(createTrainer("O2 Health Studio", "Besant Nagar, Chennai", "Resistance Experts", 
            "Features senior resistance coaches for science-based strength building.", "+91 44 2491 4344", "Strength Training", "Tamil Nadu", 4.7, 210));

        // 3. General Fitness (Tamil Nadu)
        trainers.add(createTrainer("Fitness Factory", "KK Nagar, Chennai", "Family Fitness", 
            "Comprehensive family fitness center with expert general health support.", "+91 44 2366 4344", "General Fitness", "Tamil Nadu", 4.6, 95));
        
        trainers.add(createTrainer("Gold's Gym", "Adyar, Chennai", "Accredited Staff", 
            "Premium fitness center featuring internationally accredited personal trainers.", "+91 44 2445 4344", "General Fitness", "Tamil Nadu", 4.8, 260));
        
        trainers.add(createTrainer("The Quad", "Alwarpet, Chennai", "Functional Specialist", 
            "Specialized in functional daily fitness and group-led wellness.", "+91 44 4210 4344", "General Fitness", "Tamil Nadu", 4.9, 180));
        
        trainers.add(createTrainer("Fuel Fitness", "T. Nagar, Chennai", "Versatile Support", 
            "Modern gym facility with versatile floor support for all fitness levels.", "+91 44 4260 4344", "General Fitness", "Tamil Nadu", 4.7, 130));

        // 4. Weight Loss (Tamil Nadu)
        trainers.add(createTrainer("The Good Weight", "OMR, Chennai", "Medical Specialist", 
            "Focuses on post-pregnancy and medical-supervised weight loss programs.", "+91 98840 12345", "Weight Loss", "Tamil Nadu", 4.9, 55));
        
        trainers.add(createTrainer("VLCC Wellness", "Nungambakkam, Chennai", "Scientific Management", 
            "Scientific approach to weight management and clinical beauty wellness.", "+91 44 2822 4344", "Weight Loss", "Tamil Nadu", 4.6, 400));
        
        trainers.add(createTrainer("Healthifyme (Offices)", "Chennai", "Tech-Led", 
            "Tech-driven weight loss coaching with data-led nutrition tracking.", "1800-419-9505", "Weight Loss", "Tamil Nadu", 4.7, 850));
        
        trainers.add(createTrainer("Tone Fitness", "Anna Nagar, Chennai", "Result-Oriented", 
            "Specialized fat-loss batch programs with high success rates.", "+91 44 4217 4344", "Weight Loss", "Tamil Nadu", 4.8, 120));

        trainerRepository.saveAll(trainers);
        return "Successfully added 16 new trainers for Tamil Nadu!";
    }

    @GetMapping("/delhi-trainers")
    public String seedDelhiTrainers() {
        List<Trainer> trainers = new ArrayList<>();

        // 1. Yoga (Delhi NCR)
        trainers.add(createTrainer("MDNIY (Govt)", "Ashoka Road, Delhi", "Ministry of AYUSH", 
            "The premier national institute for yoga under the Government of India.", "011-23730417", "Yoga", "Delhi", 5.0, 1200));
        
        trainers.add(createTrainer("Seema Sondhi Studio", "Hauz Khas, Delhi", "20+ Years", 
            "Authentic Ashtanga Yoga specialist helping individuals find balance and strength.", "+91 11 2651 4344", "Yoga", "Delhi", 4.9, 210));
        
        trainers.add(createTrainer("Sivananda Yoga Centre", "Dwarka, Delhi", "Global Tradition", 
            "Part of the world-renowned Sivananda Yoga Vedanta Centres network.", "+91 11 2508 4344", "Yoga", "Delhi", 4.8, 150));
        
        trainers.add(createTrainer("Om Mantra Yoga", "Vasant Vihar, Delhi", "Holistic Guru", 
            "Mini Shastri led center focusing on holistic wellness and traditional mantras.", "+91 98100 12345", "Yoga", "Delhi", 4.7, 85));

        // 2. Strength (Delhi NCR)
        trainers.add(createTrainer("Genes Fitness", "Vikaspuri, Delhi", "IFBB Pro Managed", 
            "Managed by IFBB Pro coaches, focusing on elite bodybuilding and strength.", "+91 98110 12345", "Strength Training", "Delhi", 4.9, 130));
        
        trainers.add(createTrainer("Boss Fitness", "Lajpat Nagar, Delhi", "Conditioning Focus", 
            "Known for heavy weightlifting and intense athletic conditioning programs.", "+91 11 4100 4344", "Strength Training", "Delhi", 4.8, 110));
        
        trainers.add(createTrainer("Chisel Gym", "South Ex, Delhi", "Virat Kohli Chain", 
            "A premium fitness chain co-founded by Virat Kohli focusing on high-end strength.", "+91 11 4654 4344", "Strength Training", "Delhi", 4.9, 450));
        
        trainers.add(createTrainer("The Gym (Vikram)", "Janakpuri, Delhi", "15+ Years", 
            "Veteran coach specialized in hardcore bodybuilding and resistance training.", "+91 98180 12345", "Strength Training", "Delhi", 4.7, 95));

        // 3. General Fitness (Delhi NCR)
        trainers.add(createTrainer("Anytime Fitness", "Model Town, Delhi", "Global Standards", 
            "24/7 accessible fitness center maintaining high global gym standards.", "+91 11 4750 4344", "General Fitness", "Delhi", 4.7, 310));
        
        trainers.add(createTrainer("Fitness First", "Saket, Delhi", "Certified Staff", 
            "Leading global health club with internationally certified fitness staff.", "+91 11 4057 4344", "General Fitness", "Delhi", 4.8, 420));
        
        trainers.add(createTrainer("Viva Fit", "GK 1, Delhi", "Women-Centric", 
            "A fitness and wellness hub exclusively designed for women.", "+91 11 4163 4344", "General Fitness", "Delhi", 4.6, 120));
        
        trainers.add(createTrainer("Fitso", "Multiple Locations, Delhi", "Multi-Sport", 
            "Provides expert coaching across swimming, gym, and other athletic sports.", "+91 80100 12345", "General Fitness", "Delhi", 4.8, 800));

        // 4. Weight Loss (Delhi NCR)
        trainers.add(createTrainer("Universal Yoga School", "Faridabad", "Diet Specialized", 
            "Integration of yoga and specific diet protocols for effective weight loss.", "+91 98100 54321", "Weight Loss", "Delhi", 4.9, 75));
        
        trainers.add(createTrainer("Dr. Shikha’s NutriHealth", "South Ex, Delhi", "Nutri-Genomics", 
            "Personalized weight management through the science of Nutri-Genomics.", "1800-103-6630", "Weight Loss", "Delhi", 4.8, 600));
        
        trainers.add(createTrainer("Fitness Fusion", "Greater Kailash, Delhi", "High-Burn Cardio", 
            "High-intensity cardio transformations for rapid calorie burn and fat loss.", "+91 93100 12345", "Weight Loss", "Delhi", 4.7, 140));
        
        trainers.add(createTrainer("Obino", "Online/Delhi", "Health Coaching", 
            "Comprehensive health coaching platform for goal-based weight reduction.", "+91 11 4650 4344", "Weight Loss", "Delhi", 4.6, 250));

        trainerRepository.saveAll(trainers);
        return "Successfully added 16 new trainers for Delhi!";
    }

    @GetMapping("/gujarat-trainers")
    public String seedGujaratTrainers() {
        List<Trainer> trainers = new ArrayList<>();

        // 1. Yoga (Gujarat)
        trainers.add(createTrainer("Spandan Yoga", "Panjrapole, Ahmedabad", "QCI/AYUSH Certified", 
            "Specialized in therapeutic yoga and postural correction with AYUSH certification.", "+91 79 2630 4344", "Yoga", "Gujarat", 4.9, 110));
        
        trainers.add(createTrainer("Lakulish Yoga University", "Chharodi, Ahmedabad", "15+ Years", 
            "Academic yoga institution providing structured certification and deep Hatha training.", "+91 2717 244344", "Yoga", "Gujarat", 4.8, 430));
        
        trainers.add(createTrainer("Yogasthali", "Satellite, Ahmedabad", "Hatha Specialist", 
            "Focuses on traditional Hatha Yoga and mindfulness meditation techniques.", "+91 98250 12345", "Yoga", "Gujarat", 4.7, 95));
        
        trainers.add(createTrainer("Aum Yoga Center", "Bodakdev, Ahmedabad", "Therapeutic & Power", 
            "Dynamic programs combining the strength of Power Yoga with therapeutic healing.", "+91 79 4005 4344", "Yoga", "Gujarat", 4.6, 125));

        // 2. Strength (Gujarat)
        trainers.add(createTrainer("Priyanka Parikh", "Ahmedabad", "Master's in Exercise Science", 
            "Scientifically backed strength and conditioning programs led by an exercise scientist.", "+91 98240 12345", "Strength Training", "Gujarat", 5.0, 65));
        
        trainers.add(createTrainer("Force Fitness", "CG Road, Ahmedabad", "Powerlifting Hub", 
            "Professional hub for powerlifters and heavy resistance training enthusiasts.", "+91 79 2646 4344", "Strength Training", "Gujarat", 4.8, 140));
        
        trainers.add(createTrainer("U-Turn Fitness", "Prahlad Nagar, Ahmedabad", "Heavy Resistance", 
            "Specializes in progressive overload and high-end strength equipment use.", "+91 79 4008 4344", "Strength Training", "Gujarat", 4.7, 115));
        
        trainers.add(createTrainer("The Unit", "Vastrapur, Ahmedabad", "Hypertrophy Coach", 
            "Dedicated to muscle growth (hypertrophy) and specialized strength coaching.", "+91 98790 12345", "Strength Training", "Gujarat", 4.9, 80));

        // 3. General Fitness (Gujarat)
        trainers.add(createTrainer("K-Fitness", "Ambawadi, Ahmedabad", "Certified Trainers", 
            "Multidisciplinary gym providing expert guidance in general health and cardio.", "+91 79 2630 1234", "General Fitness", "Gujarat", 4.6, 105));
        
        trainers.add(createTrainer("Life Fitness", "Gurukul, Ahmedabad", "Daily Wellness", 
            "Focuses on functional daily wellness and personalized gym floor support.", "+91 79 2749 4344", "General Fitness", "Gujarat", 4.7, 160));
        
        trainers.add(createTrainer("Snap Fitness", "Thaltej, Ahmedabad", "Globally Certified", 
            "High-standard fitness facility with certified trainers for all health levels.", "+91 79 4004 4344", "General Fitness", "Gujarat", 4.8, 230));
        
        trainers.add(createTrainer("Revive Fitness", "Sindhu Bhavan, Ahmedabad", "Modern Functional", 
            "Modern facilities specializing in functional training and recovery.", "+91 79 4890 4344", "General Fitness", "Gujarat", 4.7, 145));

        // 4. Weight Loss (Gujarat)
        trainers.add(createTrainer("Swastha Nutricure", "Online/Ahmedabad", "Diet & Exercise", 
            "Personalized weight loss through sustainable diet and targeted exercise plans.", "+91 93921 87954", "Weight Loss", "Gujarat", 5.0, 95));
        
        trainers.add(createTrainer("Etheal", "Satellite, Ahmedabad", "Scientific Management", 
            "Scientific approach to fast but healthy weight reduction programs.", "+91 79 4006 4344", "Weight Loss", "Gujarat", 4.8, 110));
        
        trainers.add(createTrainer("Wellspun Weight Loss", "Drive-In Road, Ahmedabad", "Holistic Fat Loss", 
            "Holistic programs integrating diet, movement, and mindset for fat loss.", "+91 79 2685 4344", "Weight Loss", "Gujarat", 4.7, 130));
        
        trainers.add(createTrainer("Slimming Point", "Bodakdev, Ahmedabad", "Non-Surgical", 
            "Specialized non-surgical methods and nutritional coaching for weight loss.", "+91 79 2687 4344", "Weight Loss", "Gujarat", 4.6, 180));

        trainerRepository.saveAll(trainers);
        return "Successfully added 16 new trainers for Gujarat!";
    }

    @GetMapping("/kerala-trainers")
    public String seedKeralaTrainers() {
        List<Trainer> trainers = new ArrayList<>();

        // 1. Yoga (Kerala)
        trainers.add(createTrainer("Sivananda Ashram", "Neyyar Dam, Kerala", "60+ Years", 
            "Part of the world-renowned Sivananda Yoga Vedanta Centres with deep spiritual lineage.", "+91 471 2273093", "Yoga", "Kerala", 5.0, 850));
        
        trainers.add(createTrainer("Yoga Amber", "Kochi, Kerala", "Traditional Hatha", 
            "Focuses on traditional Hatha Yoga and therapy-based wellness practices.", "+91 98470 12345", "Yoga", "Kerala", 4.7, 85));
        
        trainers.add(createTrainer("Bodhi Yoga", "Trivandrum, Kerala", "Meditation Specialist", 
            "Specializes in mindfulness meditation and stress reduction through yoga.", "+91 471 2334344", "Yoga", "Kerala", 4.8, 110));
        
        trainers.add(createTrainer("Agasthya Yoga", "Varkala, Kerala", "Ayurvedic Integrated", 
            "Traditional yoga practice integrated with Ayurvedic wellness principles.", "+91 98950 12345", "Yoga", "Kerala", 4.9, 130));

        // 2. Strength (Kerala)
        trainers.add(createTrainer("Fitness Soul", "Kochi, Kerala", "Performance Pro", 
            "Strength and conditioning facility led by performance-focused professional coaches.", "+91 484 405 4344", "Strength Training", "Kerala", 4.8, 75));
        
        trainers.add(createTrainer("Power House Gym", "Kozhikode, Kerala", "Heavy Lift Focus", 
            "Focused on powerlifting and heavy bodybuilding for peak physical performance.", "+91 495 272 4344", "Strength Training", "Kerala", 4.7, 60));
        
        trainers.add(createTrainer("The Tribe", "Kochi, Kerala", "Functional Performance", 
            "Specializes in functional strength training and body conditioning.", "+91 484 231 4344", "Strength Training", "Kerala", 4.9, 95));
        
        trainers.add(createTrainer("Oxy Gym", "Trivandrum, Kerala", "Resistance Focus", 
            "Well-equipped facility with a major focus on resistance and muscle mechanics.", "+91 471 406 4344", "Strength Training", "Kerala", 4.6, 110));

        // 3. General Fitness (Kerala)
        trainers.add(createTrainer("Fit & Fine Gym", "Trivandrum, Kerala", "Daily Toning", 
            "Expert floor trainers helping members with daily fitness and body toning goals.", "+91 471 247 4344", "General Fitness", "Kerala", 4.6, 90));
        
        trainers.add(createTrainer("Gold's Gym", "Kochi, Kerala", "International Standards", 
            "Premium gym experience with internationally certified staff and modern equipment.", "+91 484 402 4344", "General Fitness", "Kerala", 4.8, 180));
        
        trainers.add(createTrainer("Workout Lifestyle", "Palakkad, Kerala", "Personalized Support", 
            "Provides expert personal training and floor support for daily health management.", "+91 491 250 4344", "General Fitness", "Kerala", 4.7, 75));
        
        trainers.add(createTrainer("Life Fitness", "Kannur, Kerala", "Comprehensive Health", 
            "Multi-disciplinary fitness center offering holistic health and gym facilities.", "+91 497 270 4344", "General Fitness", "Kerala", 4.7, 120));

        // 4. Weight Loss (Kerala)
        trainers.add(createTrainer("House of TransKerala", "Varkala, Kerala", "Residential Immersive", 
            "Unique residential transformation programs combining yoga, diet, and immersion.", "+91 98460 12345", "Weight Loss", "Kerala", 4.9, 45));
        
        trainers.add(createTrainer("P4 Professional", "Kochi, Kerala", "Transformation Expert", 
            "Expert fat loss programs focusing on sustainable body transformation results.", "+91 484 404 4344", "Weight Loss", "Kerala", 4.8, 115));
        
        trainers.add(createTrainer("Sculpt Gym", "Kottayam, Kerala", "High-Intensity Plans", 
            "High-burn calorie programs and high-intensity plans for significant fat loss.", "+91 481 256 4344", "Weight Loss", "Kerala", 4.7, 95));
        
        trainers.add(createTrainer("Healthy Way", "Calicut, Kerala", "Diet-Integrated", 
            "Weight management programs deeply integrated with scientific dietetics.", "+91 495 401 4344", "Weight Loss", "Kerala", 4.6, 130));

        trainerRepository.saveAll(trainers);
        return "Successfully added 16 new trainers for Kerala!";
    }

    private Trainer createTrainer(String name, String city, String exp, String bio, String contact, String specialty, String state, double rating, int reviews) {
        Trainer t = new Trainer();
        t.setName(name);
        t.setCity(city);
        t.setExperience(exp);
        t.setBio(bio);
        t.setPhoneNumber(contact);
        t.setSpecialties(Arrays.asList(specialty));
        t.setState(state);
        t.setCountry("India");
        t.setCertified(true);
        t.setRating(rating);
        t.setReviewCount(reviews);
        t.setCompatibleGoals(generateGoals(specialty));
        return t;
    }

    private void seedPlansForTrainer(String trainerId, String spec, Random random) {
        // Seed 1 Diet Plan
        DietPlan diet = new DietPlan();
        diet.setTrainerId(trainerId);
        diet.setGoal(generateGoals(spec).get(0));
        diet.setDescription("A comprehensive nutrition guide designed to complement your " + spec + " journey.");
        diet.setMealSuggestions(Arrays.asList("High Protein Breakfast", "Lean Green Lunch", "Balanced Power Dinner"));
        dietPlanRepository.save(diet);

        // Seed 1 Workout Plan
        WorkoutPlan workout = new WorkoutPlan();
        workout.setTrainerId(trainerId);
        workout.setProgramName(spec + " Foundation");
        workout.setDuration((4 + random.nextInt(8)) + " Weeks");
        workout.setTargetGoal(generateGoals(spec).get(0));
        workout.setExercises(Arrays.asList("Target Guided Warmup", "Core Compound Movement", "Endurance Finisher"));
        workoutPlanRepository.save(workout);
    }

    private List<String> generateGoals(String spec) {
        if (spec.contains("Weight Loss")) return Arrays.asList("weight loss", "stay fit");
        if (spec.contains("Strength")) return Arrays.asList("muscle gain", "strength training");
        if (spec.contains("Yoga")) return Arrays.asList("stay fit", "flexibility");
        if (spec.contains("Nutrition")) return Arrays.asList("weight loss", "muscle gain", "stay fit");
        return Arrays.asList("stay fit", "general health");
    }
}
