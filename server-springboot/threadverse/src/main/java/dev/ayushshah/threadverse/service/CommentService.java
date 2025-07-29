package dev.ayushshah.threadverse.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Optional;

import org.springframework.stereotype.Service;

import dev.ayushshah.threadverse.dto.CommentWithUserDTO;
import dev.ayushshah.threadverse.dto.UpdateResourceRequest;
import dev.ayushshah.threadverse.dto.UserDTO;
import dev.ayushshah.threadverse.exceptions.ResourceNotFoundException;
import dev.ayushshah.threadverse.mapper.CommentMapper;
import dev.ayushshah.threadverse.model.Comment;
import dev.ayushshah.threadverse.model.Post;
import dev.ayushshah.threadverse.model.User;
import dev.ayushshah.threadverse.repository.CommentRepository;
import dev.ayushshah.threadverse.repository.PostRepository;
import dev.ayushshah.threadverse.repository.UserRepository;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentMapper commentMapper;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository,
            PostRepository postRepository, CommentMapper commentMapper) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.commentMapper = commentMapper;
        this.postRepository = postRepository;
    }

    public CommentWithUserDTO getCommentById(String commentId) {
        // get comment
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment Not Found"));

        // get author
        User user = userRepository.findById(comment.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("Comment Author Not Found"));

        CommentWithUserDTO c = commentMapper.toDTO(comment);
        c.setUser(UserDTO.builder().displayName(user.getDisplayName()).build());

        return c;
    }

    public Comment updateComment(String commentId, UpdateResourceRequest updateResourceRequest, String authorId) {
        // get comment
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment Not Found"));

        // authorize
        if (!comment.getAuthorId().equals(authorId)) {
            throw new RuntimeException("Not Authorized To Update Comment");
        }

        comment.setContent(updateResourceRequest.updatedContentOrDescription());
        Comment saved = commentRepository.save(comment);

        return saved;

    }

    public Comment replyToPost(String postId, String commentContent, String author_id) {
        // get post
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post Not Found"));

        // build and save comment
        Comment comment = Comment.builder()
                .authorId(author_id)
                .content(commentContent)
                .replyIds(List.of())
                .build();

        Comment saved = commentRepository.save(comment);

        // update post
        post.getCommentIds().add(saved.getId());
        postRepository.save(post);

        return saved;

    }

    public Comment replyToComment(String parentCommentId, String commentContent, String authorId) {

        // Build and Save Comment
        Comment comment = Comment.builder()
                .authorId(authorId)
                .content(commentContent)
                .replyIds(List.of())
                .build();

        Comment saved = commentRepository.save(comment);

        // Find and Update Parent Comment
        Comment parent = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent Comment Not Found"));
        parent.getReplyIds().add(saved.getId());

        commentRepository.save(parent);

        return saved;

    }

    public List<Map<?, ?>> getAllCommentsByAuthor(String authorId) {
        return commentRepository.findAllByAuthorId(authorId)
                .stream()
                .map(comment -> {

                    if (postRepository.existsByCommentIdsContaining(comment.getId())) {
                        Post post = postRepository.findByCommentIdsContaining(comment.getId());

                        return Map.of("comment", comment, "postTitle", post.getTitle());
                    } else {
                        Post post = null;

                        while (post == null) {
                            Optional<Comment> parentComment = commentRepository
                                    .findByReplyIdsContaining(comment.getId());
                            if (parentComment.isEmpty()) {
                                break;
                            } else {
                                post = postRepository.findByCommentIdsContaining(parentComment.get().getId());
                                if (post != null) {
                                    return Map.of("comment", comment, "postTitle", post.getTitle());
                                }
                            }

                        }

                        return Map.of("comment", comment, "postTitle", "Could Not Fetch");
                    }

                })
                .collect(Collectors.toList());

    }
}
