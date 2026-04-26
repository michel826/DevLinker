package com.devlinker.backend.post.service;

import com.devlinker.backend.global.exception.NotFoundException;
import com.devlinker.backend.post.dto.PostCreateRequest;
import com.devlinker.backend.post.dto.PostResponse;
import com.devlinker.backend.post.dto.PostUpdateRequest;
import com.devlinker.backend.post.entity.Post;
import com.devlinker.backend.post.entity.PostStatus;
import com.devlinker.backend.post.repository.PostRepository;
import com.devlinker.backend.user.entity.User;
import com.devlinker.backend.user.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    // 모집글 작성
    public PostResponse createPost(String email, PostCreateRequest request) {
        User user = findUserByEmail(email);

        Post post = Post.create(
                user,
                request.getTitle(),
                request.getContent(),
                request.getRecruitCount()
        );

        Post savedPost = postRepository.save(post);

        return PostResponse.from(savedPost);
    }

    // 모집글 목록 조회 + 검색/필터
    @Transactional(readOnly = true)
    public List<PostResponse> getPosts(String keyword, PostStatus status) {
        boolean hasKeyword = keyword != null && !keyword.isBlank();
        boolean hasStatus = status != null;

        List<Post> posts;

        if (hasKeyword && hasStatus) {
            posts = postRepository.findByTitleContainingIgnoreCaseAndStatusOrderByIdDesc(keyword, status);
        } else if (hasKeyword) {
            posts = postRepository.findByTitleContainingIgnoreCaseOrderByIdDesc(keyword);
        } else if (hasStatus) {
            posts = postRepository.findByStatusOrderByIdDesc(status);
        } else {
            posts = postRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        }

        return posts.stream()
                .map(PostResponse::from)
                .toList();
    }

    // 모집글 상세 조회
    @Transactional(readOnly = true)
    public PostResponse getPost(Long postId) {
        Post post = findPostById(postId);

        return PostResponse.from(post);
    }

    // 모집글 수정
    public PostResponse updatePost(String email, Long postId, PostUpdateRequest request) {
        User user = findUserByEmail(email);
        Post post = findPostById(postId);

        validateWriter(user, post);

        post.update(
                request.getTitle(),
                request.getContent(),
                request.getRecruitCount()
        );

        return PostResponse.from(post);
    }

    // 모집글 삭제
    public void deletePost(String email, Long postId) {
        User user = findUserByEmail(email);
        Post post = findPostById(postId);

        validateWriter(user, post);

        postRepository.delete(post);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("USER404", "존재하지 않는 사용자입니다."));
    }

    private Post findPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("POST404", "존재하지 않는 모집글입니다."));
    }

    private void validateWriter(User user, Post post) {
        if (!post.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("작성자만 수정 또는 삭제할 수 있습니다.");
        }
    }
}