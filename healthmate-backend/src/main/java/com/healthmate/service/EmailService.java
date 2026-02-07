package com.healthmate.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp, String type) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);

        String subject = "HealthMate OTP";
        if ("password_reset".equals(type)) {
            subject = "Password Reset OTP - HealthMate";
        } else if ("username_recovery".equals(type)) {
            subject = "Username Recovery OTP - HealthMate";
        } else if ("email_verification".equals(type)) {
            subject = "Verify Your Email - HealthMate";
        }

        String htmlContent = String.format(
                "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; max-width: 500px; margin: 0 auto;'>"
                        + "<h2 style='color: #6366f1; text-align: center;'>HealthMate</h2>"
                        + "<h3 style='text-align: center; color: #333;'>%s</h3>"
                        + "<p style='font-size: 16px; color: #555;'>Your One-Time Password (OTP) is:</p>"
                        + "<h1 style='text-align: center; color: #10b981; letter-spacing: 5px; background: #f3f4f6; padding: 10px; border-radius: 5px;'>%s</h1>"
                        + "<p style='font-size: 14px; color: #ef4444; text-align: center;'>This OTP expires in <strong>1 minute</strong>.</p>"
                        + "<p style='font-size: 12px; color: #999; text-align: center;'>If you did not request this, please ignore this email.</p>"
                        + "</div>",
                subject, otp);

        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        javaMailSender.send(message);
    }
}
