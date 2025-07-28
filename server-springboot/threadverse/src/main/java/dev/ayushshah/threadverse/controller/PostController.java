package dev.ayushshah.threadverse.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import dev.ayushshah.threadverse.dto.CreatePostRequest;
import dev.ayushshah.threadverse.dto.PostWithUserDTO;
import dev.ayushshah.threadverse.dto.UserDTO;
import dev.ayushshah.threadverse.dto.UpdateResourceRequest;
import dev.ayushshah.threadverse.model.Post;
import dev.ayushshah.threadverse.service.PostService;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping()
    public ResponseEntity<List<PostWithUserDTO>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostWithUserDTO> getPostById(@PathVariable String postId) {
        Optional<PostWithUserDTO> postOpt = postService.getPostById(postId);
        return postOpt
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/getByCommunity/{communityId}")
    public ResponseEntity<List<PostWithUserDTO>> getPostsByCommunity(@PathVariable String communityId) {
        return ResponseEntity.ok(postService.getPostsByCommunityId(communityId));
    }

    @GetMapping("/getByAuthor/{authorId}")
    public ResponseEntity<List<Post>> getPostsByAuthor(@PathVariable String authorId) {
        return ResponseEntity.ok(postService.getPostsByAuthorId(authorId));
    }
    

    @GetMapping("/getCommunityName/{postId}")
    public Map<String, String> getCommunityNameFromPostId(@PathVariable String postId) {
        String communityName = postService.getCommunityName(postId);
        return Map.of("communityName", communityName);
    }

    @PostMapping("/create")
    public ResponseEntity<Post> createPost(@RequestBody CreatePostRequest postRequest, Authentication auth) {
        return ResponseEntity.ok(postService.createPost(postRequest, ((UserDTO) auth.getPrincipal()).getId()));
    }

    @PutMapping("/update/{postId}")
    public ResponseEntity<Post> updatePost(@PathVariable String postId,
            @RequestBody UpdateResourceRequest updatePostRequest, Authentication auth) {
        return ResponseEntity
                .ok(postService.updatePost(postId, updatePostRequest, ((UserDTO) auth.getPrincipal()).getId()));
    }

    @PutMapping("updateViews/{postId}")
    public ResponseEntity<Boolean> updateViews(@PathVariable String postId, Authentication auth) {

        return ResponseEntity.ok(postService.updateViews(postId));
    }

}
