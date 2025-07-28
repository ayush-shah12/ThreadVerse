package dev.ayushshah.threadverse.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.ayushshah.threadverse.dto.CommentWithUserDTO;
import dev.ayushshah.threadverse.dto.UserDTO;

import dev.ayushshah.threadverse.model.Comment;
import dev.ayushshah.threadverse.service.CommentService;
import dev.ayushshah.threadverse.dto.UpdateResourceRequest;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

record CreateCommentRequest(
        String content) {
}

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<CommentWithUserDTO> getComment(@PathVariable String commentId) {
        return ResponseEntity.ok(commentService.getCommentById(commentId));
    }

    @PutMapping("/update/{commentId}")
    public ResponseEntity<Comment> updateComment(@PathVariable String commentId,
            @RequestBody UpdateResourceRequest updateResourceRequest, Authentication auth) {
        return ResponseEntity.ok(commentService.updateComment(commentId, updateResourceRequest,
                ((UserDTO) auth.getPrincipal()).getId()));
    }

    @PostMapping("/reply/post/{postId}")
    public ResponseEntity<Comment> replyToPost(@RequestBody CreateCommentRequest createCommentRequest,
            @PathVariable String postId, Authentication auth) {
        return ResponseEntity.ok(commentService.replyToPost(postId, createCommentRequest.content(),
                ((UserDTO) auth.getPrincipal()).getId()));
    }

    @PostMapping("/reply/comment/{commentId}")
    public ResponseEntity<Comment> replyToComment(@RequestBody CreateCommentRequest createCommentRequest,
            @PathVariable String commentId, Authentication auth) {
        return ResponseEntity.ok(commentService.replyToComment(commentId, createCommentRequest.content(),
                ((UserDTO) auth.getPrincipal()).getId()));
    }

    @GetMapping("/getByAuthor/{authorId}")
    public ResponseEntity<List<Map<?, ?>>> getCommentsByAuthor(@PathVariable String authorId) {
        return ResponseEntity.ok(commentService.getAllCommentsByAuthor(authorId));
    }

}
