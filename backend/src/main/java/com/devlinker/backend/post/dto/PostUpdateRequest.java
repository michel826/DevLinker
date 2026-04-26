package com.devlinker.backend.post.dto;

public class PostUpdateRequest {

    private String title;
    private String content;
    private Integer recruitCount;

    public PostUpdateRequest() {
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public Integer getRecruitCount() {
        return recruitCount;
    }
}