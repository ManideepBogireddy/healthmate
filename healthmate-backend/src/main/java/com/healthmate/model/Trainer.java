package com.healthmate.model;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Document(collection = "trainers")
public class Trainer {
    @Id
    private String id;
    private String userId; // Reference to User ID
    @NotBlank
    private String name;
    @NotBlank
    private String bio;
    private List<String> specialties = new ArrayList<>(); // e.g., Yoga, HIIT, Strength
    private String experience;
    private double rating = 0.0;
    private int reviewCount = 0;
    private boolean certified;
    private String country;
    private String state;
    private String city;
    private String address;
    private String email;
    private String phoneNumber;
    private String location; // Keeping for legacy matching temporarily if needed

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
    private String availability; // Weekly/Flexible
    private List<String> compatibleGoals = new ArrayList<>(); // weight loss, muscle gain
    private String imageUrl;

    public Trainer() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public List<String> getSpecialties() {
        return specialties;
    }

    public void setSpecialties(List<String> specialties) {
        this.specialties = specialties;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(int reviewCount) {
        this.reviewCount = reviewCount;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public List<String> getCompatibleGoals() {
        return compatibleGoals;
    }

    public void setCompatibleGoals(List<String> compatibleGoals) {
        this.compatibleGoals = compatibleGoals;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public boolean isCertified() {
        return certified;
    }

    public void setCertified(boolean certified) {
        this.certified = certified;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
