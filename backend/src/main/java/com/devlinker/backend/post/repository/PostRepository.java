package com.devlinker.backend.post.repository;

import com.devlinker.backend.post.entity.Post;
import com.devlinker.backend.post.entity.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByStatusOrderByIdDesc(PostStatus status);

    List<Post> findByTitleContainingIgnoreCaseOrderByIdDesc(String keyword);

    List<Post> findByTitleContainingIgnoreCaseAndStatusOrderByIdDesc(String keyword, PostStatus status);
}