package dev.ayushshah.threadverse.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import dev.ayushshah.threadverse.dto.UserDTO;
import dev.ayushshah.threadverse.model.VoteType;
import dev.ayushshah.threadverse.service.VoteService;
import org.springframework.web.bind.annotation.GetMapping;

record VoteRequest(
        VoteType voteType) {
};

@RestController
@RequestMapping("/vote")
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping("/post/{postId}")
    public ResponseEntity<Map<?, ?>> addPostVote(@RequestBody VoteRequest vote, @PathVariable String postId,
            Authentication auth) {
        return ResponseEntity
                .ok(voteService.addPostVote(postId, vote.voteType(), ((UserDTO) auth.getPrincipal()).getId()));
    }

    @PostMapping("/comment/{commentId}")
    public ResponseEntity<Map<?, ?>> addCommentVote(@RequestBody VoteRequest vote, @PathVariable String commentId,
            Authentication auth) {
        return ResponseEntity
                .ok(voteService.addCommentVote(commentId, vote.voteType(), ((UserDTO) auth.getPrincipal()).getId()));
    }

    @GetMapping("/post/myVote/{postId}")
    public ResponseEntity<Map<String, VoteType>> getUserVoteForPost(@PathVariable String postId, Authentication auth) {
        return ResponseEntity.ok(voteService.getUserVoteForPost(postId, ((UserDTO) auth.getPrincipal()).getId()));
    }

    @GetMapping("/comment/myVote/{commentId}")
    public ResponseEntity<Map<String, VoteType>> getUserVoteForComment(@PathVariable String commentId, Authentication auth) {
        return ResponseEntity.ok(voteService.getUserVoteForComment(commentId, ((UserDTO) auth.getPrincipal()).getId()));
    }

}
