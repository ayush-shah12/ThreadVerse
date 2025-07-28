package dev.ayushshah.threadverse.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.ayushshah.threadverse.service.CommunityService;
import dev.ayushshah.threadverse.dto.CommunityWithUserDTO;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/community")
public class CommunityController {
    private final CommunityService communityService;

    public CommunityController(CommunityService communityService){
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
    


    

}
