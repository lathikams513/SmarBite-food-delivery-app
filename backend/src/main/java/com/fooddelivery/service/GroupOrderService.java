package com.fooddelivery.service;

import com.fooddelivery.dao.GroupOrderDao;
import com.fooddelivery.model.GroupCreateRequest;
import com.fooddelivery.model.GroupItemRequest;
import com.fooddelivery.model.GroupJoinRequest;
import com.fooddelivery.model.GroupOrder;
import com.fooddelivery.model.GroupSplitRequest;
import org.springframework.stereotype.Service;

import java.sql.SQLException;

@Service
public class GroupOrderService {

    private final GroupOrderDao groupOrderDao;

    public GroupOrderService(GroupOrderDao groupOrderDao) {
        this.groupOrderDao = groupOrderDao;
    }

    public GroupOrder createGroup(GroupCreateRequest request) throws SQLException {
        return groupOrderDao.createGroup(request.getCreatedBy(), request.getRestaurantId());
    }

    public GroupOrder joinGroup(GroupJoinRequest request) throws SQLException {
        return groupOrderDao.joinGroup(request.getGroupCode(), request.getUserId());
    }

    public GroupOrder getGroup(String groupCode) throws SQLException {
        return groupOrderDao.findByCode(groupCode)
                .orElseThrow(() -> new IllegalArgumentException("Group order not found"));
    }

    public GroupOrder addItem(GroupItemRequest request) throws SQLException {
        return groupOrderDao.addGroupItem(request.getGroupCode(), request.getMenuId(), request.getQuantity());
    }

    public GroupOrder updateSplit(GroupSplitRequest request) throws SQLException {
        return groupOrderDao.updateMemberSplit(request.getGroupCode(), request.getUserId(), request.getAmount());
    }
}
