package dev.ayushshah.threadverse.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.ayushshah.threadverse.model.Linkflair;
import dev.ayushshah.threadverse.service.LinkflairService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/linkflairs")
public class LinkflairController {

    private final LinkflairService linkflairService;

    public LinkflairController(LinkflairService linkflairService) {
        this.linkflairService = linkflairService;
    }

    @GetMapping()
    public ResponseEntity<List<Linkflair>> getAllLinkflairs() {
        return ResponseEntity.ok(linkflairService.getAllLinkflairs());
    }

    @GetMapping("/{linkflairId}")
    public ResponseEntity<Linkflair> getLinkflairById(@PathVariable String linkflairId) {
        return ResponseEntity.ok(linkflairService.getLinkflairById(linkflairId));
    }

}
