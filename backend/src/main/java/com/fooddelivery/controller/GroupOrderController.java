package com.fooddelivery.controller;

import com.fooddelivery.model.GroupCreateRequest;
import com.fooddelivery.model.GroupItemRequest;
import com.fooddelivery.model.GroupJoinRequest;
import com.fooddelivery.model.GroupSplitRequest;
import com.fooddelivery.service.GroupOrderService;
import com.fooddelivery.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;

@RestController
public class GroupOrderController {

    private final GroupOrderService groupOrderService;

    public GroupOrderController(GroupOrderService groupOrderService) {
        this.groupOrderService = groupOrderService;
    }

    @PostMapping("/group/create")
    public ApiResponse<Object> createGroup(@Valid @RequestBody GroupCreateRequest request) throws SQLException {
        return new ApiResponse<>(true, "Group order created", groupOrderService.createGroup(request));
    }

    @PostMapping("/group/join")
    public ApiResponse<Object> joinGroup(@Valid @RequestBody GroupJoinRequest request) throws SQLException {
        return new ApiResponse<>(true, "Joined group order", groupOrderService.joinGroup(request));
    }

    @GetMapping("/group/{groupCode}")
    public ApiResponse<Object> getGroup(@PathVariable String groupCode) throws SQLException {
        return new ApiResponse<>(true, "Group order fetched", groupOrderService.getGroup(groupCode));
    }

    @PostMapping("/group/item")
    public ApiResponse<Object> addGroupItem(@Valid @RequestBody GroupItemRequest request) throws SQLException {
        return new ApiResponse<>(true, "Group cart updated", groupOrderService.addItem(request));
    }

    @PutMapping("/group/split")
    public ApiResponse<Object> updateGroupSplit(@Valid @RequestBody GroupSplitRequest request) throws SQLException {
        return new ApiResponse<>(true, "Split amount updated", groupOrderService.updateSplit(request));
    }
}
