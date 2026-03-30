package com.fooddelivery.model;

public class OtpSessionResponse {
    private String email;
    private String otpHint;
    private String expiresIn;
    private String flow;

    public OtpSessionResponse() {
    }

    public OtpSessionResponse(String email, String otpHint, String expiresIn, String flow) {
        this.email = email;
        this.otpHint = otpHint;
        this.expiresIn = expiresIn;
        this.flow = flow;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtpHint() {
        return otpHint;
    }

    public void setOtpHint(String otpHint) {
        this.otpHint = otpHint;
    }

    public String getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(String expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getFlow() {
        return flow;
    }

    public void setFlow(String flow) {
        this.flow = flow;
    }
}
