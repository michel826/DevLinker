package com.devlinker.backend.post.dto;

import com.devlinker.backend.post.entity.Post;
import com.devlinker.backend.post.entity.PostStatus;

import java.time.LocalDateTime;

public class PostResponse {

    private final Long id;
    private final Long writerId;
    private final String writerNickname;
    private final String title;
    private final String content;
    private final Integer recruitCount;
    private final PostStatus status;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    private PostResponse(
            Long id,
            Long writerId,
            String writerNickname,
            String title,
            String content,
            Integer recruitCount,
            PostStatus status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.writerId = writerId;
        this.writerNickname = writerNickname;
        this.title = title;
        this.content = content;
        this.recruitCount = recruitCount;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static PostResponse from(Post post) {
        return new PostResponse(
                post.getId(),
                post.getUser().getId(),
                post.getUser().getNickname(),
                post.getTitle(),
                post.getContent(),
                post.getRecruitCount(),
                post.getStatus(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public Long getWriterId() {
        return writerId;
    }

    public String getWriterNickname() {
        return writerNickname;
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

    public PostStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}