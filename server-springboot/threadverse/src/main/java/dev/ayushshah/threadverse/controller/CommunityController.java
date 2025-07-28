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

import dev.ayushshah.threadverse.service.CommunityService;
import dev.ayushshah.threadverse.dto.CommunityWithUserDTO;
import dev.ayushshah.threadverse.dto.CreateCommunityRequest;
import dev.ayushshah.threadverse.dto.UpdateResourceRequest;
import dev.ayushshah.threadverse.dto.UserDTO;
import dev.ayushshah.threadverse.model.Community;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/communities")
public class CommunityController {
    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping()
    public ResponseEntity<List<CommunityWithUserDTO>> getAllCommunities() {
        return ResponseEntity.ok(communityService.getAllCommunities());
    }

    @GetMapping("/{communityId}")
    public ResponseEntity<CommunityWithUserDTO> getCommunityById(@PathVariable String communityId) {
        return ResponseEntity.ok(communityService.getCommunityById(communityId));
    }

    @GetMapping("/getByAuthor/{authorId}")
    public ResponseEntity<List<Community>> getMethodName(@PathVariable String authorId) {
        return ResponseEntity.ok(communityService.getCommunitiesByAuthor(authorId));
    }
    

    @PostMapping("/create")
    public ResponseEntity<Community> createCommunity(@RequestBody CreateCommunityRequest createCommunityRequest,
            Authentication auth) {
        return ResponseEntity.ok(
                communityService.createCommunity(createCommunityRequest, ((UserDTO) (auth.getPrincipal())).getId()));
    }

    @PutMapping("/update/{communityId}")
    public ResponseEntity<Community> updateCommunity(@RequestBody UpdateResourceRequest updateCommunityRequest,
            @PathVariable String communityId, Authentication auth) {
        return ResponseEntity.ok(communityService.updateCommunity(communityId, updateCommunityRequest,
                ((UserDTO) auth.getPrincipal()).getId()));
    }

    @GetMapping("/exists/{communityName}")
    public ResponseEntity<Map<String, Boolean>> existsByName(@PathVariable String communityName) {
        return ResponseEntity.ok(Map.of("exists", communityService.existsByName(communityName)));
    }

    @PostMapping("/join/{communityId}")
    public ResponseEntity<Map<String, Boolean>> joinCommunity(@PathVariable String communityId, Authentication auth) {

        return ResponseEntity.ok(Map.of("success",
                communityService.joinCommunity(communityId, ((UserDTO) auth.getPrincipal()).getId())));
    }

    @PostMapping("/leave/{communityId}")
    public ResponseEntity<Map<String, Boolean>> leaveCommunity(@PathVariable String communityId, Authentication auth) {

        return ResponseEntity.ok(Map.of("success",
                communityService.leaveCommunity(communityId, ((UserDTO) auth.getPrincipal()).getId())));
    }

}
