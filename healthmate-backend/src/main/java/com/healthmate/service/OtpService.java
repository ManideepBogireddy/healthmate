package com.healthmate.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    // Store OTPs: Email -> OtpData (OTP code, Expiry Time)
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private static final long OTP_VALID_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

    private static class OtpData {
        String otp;
        long expiryTime;

        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }

    public String generateOtp(String email) {
        // Generate 6-digit OTP
        SecureRandom random = new SecureRandom();
        int otpValue = 100000 + random.nextInt(900000);
        String otp = String.valueOf(otpValue);

        // Save to storage with expiry
        otpStorage.put(email, new OtpData(otp, System.currentTimeMillis() + OTP_VALID_DURATION));

        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        OtpData data = otpStorage.get(email);

        if (data == null) {
            return false;
        }

        // Check expiry
        if (System.currentTimeMillis() > data.expiryTime) {
            otpStorage.remove(email); // Cleanup expired
            return false;
        }

        // Check match
        if (data.otp.equals(otp)) {
            otpStorage.remove(email); // Invalidate after successful use
            return true;
        }

        return false;
    }

    public boolean isOtpValid(String email, String otp) {
        OtpData data = otpStorage.get(email);
        if (data == null)
            return false;
        if (System.currentTimeMillis() > data.expiryTime) {
            otpStorage.remove(email);
            return false;
        }
        return data.otp.equals(otp);
    }
}
