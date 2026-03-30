package com.fooddelivery.model;

public class Restaurant {
    private Long id;
    private String name;
    private String cuisine;
    private Double rating;
    private Integer etaMinutes;
    private String imageUrl;
    private String heroImageUrl;
    private String location;
    private String description;
    private String offerText;
    private java.math.BigDecimal deliveryFee;
    private String tags;
    private Integer priceForTwo;
    private Boolean promoted;
    private String discountText;

    public Restaurant() {
    }

    public Restaurant(Long id, String name, String cuisine, Double rating, Integer etaMinutes, String imageUrl,
                      String heroImageUrl, String location, String description, String offerText,
                      java.math.BigDecimal deliveryFee, String tags, Integer priceForTwo, Boolean promoted,
                      String discountText) {
        this.id = id;
        this.name = name;
        this.cuisine = cuisine;
        this.rating = rating;
        this.etaMinutes = etaMinutes;
        this.imageUrl = imageUrl;
        this.heroImageUrl = heroImageUrl;
        this.location = location;
        this.description = description;
        this.offerText = offerText;
        this.deliveryFee = deliveryFee;
        this.tags = tags;
        this.priceForTwo = priceForTwo;
        this.promoted = promoted;
        this.discountText = discountText;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getEtaMinutes() {
        return etaMinutes;
    }

    public void setEtaMinutes(Integer etaMinutes) {
        this.etaMinutes = etaMinutes;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getHeroImageUrl() {
        return heroImageUrl;
    }

    public void setHeroImageUrl(String heroImageUrl) {
        this.heroImageUrl = heroImageUrl;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOfferText() {
        return offerText;
    }

    public void setOfferText(String offerText) {
        this.offerText = offerText;
    }

    public java.math.BigDecimal getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(java.math.BigDecimal deliveryFee) {
        this.deliveryFee = deliveryFee;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public Integer getPriceForTwo() {
        return priceForTwo;
    }

    public void setPriceForTwo(Integer priceForTwo) {
        this.priceForTwo = priceForTwo;
    }

    public Boolean getPromoted() {
        return promoted;
    }

    public void setPromoted(Boolean promoted) {
        this.promoted = promoted;
    }

    public String getDiscountText() {
        return discountText;
    }

    public void setDiscountText(String discountText) {
        this.discountText = discountText;
    }
}
