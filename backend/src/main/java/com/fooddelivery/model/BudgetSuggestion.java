package com.fooddelivery.model;

import java.math.BigDecimal;
import java.util.List;

public class BudgetSuggestion {
    private BigDecimal budget;
    private BigDecimal total;
    private List<MenuItem> items;

    public BudgetSuggestion() {
    }

    public BudgetSuggestion(BigDecimal budget, BigDecimal total, List<MenuItem> items) {
        this.budget = budget;
        this.total = total;
        this.items = items;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public List<MenuItem> getItems() {
        return items;
    }

    public void setItems(List<MenuItem> items) {
        this.items = items;
    }
}
