package com.example.product_service.entity;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @Column(name = "id", nullable = false, length = 255)
    private String id;

    @Column(name = "brand", length = 255)
    private String brand;

    @Column(name = "category", length = 255)
    private String category;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "discount")
    private Double discount;

    @Column(name = "name", length = 255)
    private String name;

    @Column(name = "price")
    private Long price;

    @Column(name = "slug", length = 255)
    private String slug;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "image", length = 255)
    private String image;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getPrice() {
        return price;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return Objects.equals(id, product.id) && Objects.equals(brand, product.brand) && Objects.equals(category, product.category) && Objects.equals(description, product.description) && Objects.equals(discount, product.discount) && Objects.equals(name, product.name) && Objects.equals(price, product.price) && Objects.equals(slug, product.slug) && Objects.equals(stock, product.stock) && Objects.equals(image, product.image);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, brand, category, description, discount, name, price, slug, stock, image);
    }

    @Override
    public String toString() {
        return "Product{" +
                "id='" + id + '\'' +
                ", brand='" + brand + '\'' +
                ", category='" + category + '\'' +
                ", description='" + description + '\'' +
                ", discount=" + discount +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", slug='" + slug + '\'' +
                ", stock=" + stock +
                ", image='" + image + '\'' +
                '}';
    }
}
