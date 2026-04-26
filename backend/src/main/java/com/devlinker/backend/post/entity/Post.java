package com.devlinker.backend.post.entity;

import com.devlinker.backend.user.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 작성자
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private Integer recruitCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PostStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    protected Post() {
    }

    private Post(User user, String title, String content, Integer recruitCount) {
        validateTitle(title);
        validateContent(content);
        validateRecruitCount(recruitCount);

        this.user = user;
        this.title = title;
        this.content = content;
        this.recruitCount = recruitCount;
        this.status = PostStatus.OPEN;
    }

    public static Post create(User user, String title, String content, Integer recruitCount) {
        return new Post(user, title, content, recruitCount);
    }

    public void update(String title, String content, Integer recruitCount) {
        validateTitle(title);
        validateContent(content);
        validateRecruitCount(recruitCount);

        this.title = title;
        this.content = content;
        this.recruitCount = recruitCount;
    }

    public void close() {
        this.status = PostStatus.CLOSED;
    }

    public void open() {
        this.status = PostStatus.OPEN;
    }

    private void validateTitle(String title) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("모집글 제목은 필수입니다.");
        }

        if (title.length() > 100) {
            throw new IllegalArgumentException("모집글 제목은 100자를 넘을 수 없습니다.");
        }
    }

    private void validateContent(String content) {
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("모집글 내용은 필수입니다.");
        }
    }

    private void validateRecruitCount(Integer recruitCount) {
        if (recruitCount == null || recruitCount <= 0) {
            throw new IllegalArgumentException("모집 인원은 1명 이상이어야 합니다.");
        }
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
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