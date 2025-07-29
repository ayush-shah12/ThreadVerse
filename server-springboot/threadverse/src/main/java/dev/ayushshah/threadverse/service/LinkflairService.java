package dev.ayushshah.threadverse.service;

import java.util.List;

import org.springframework.stereotype.Service;

import dev.ayushshah.threadverse.exceptions.ResourceNotFoundException;
import dev.ayushshah.threadverse.model.Linkflair;
import dev.ayushshah.threadverse.repository.LinkflairRepository;

@Service
public class LinkflairService {
    private final LinkflairRepository linkflairRepository;

    public LinkflairService(LinkflairRepository linkflairRepository) {
        this.linkflairRepository = linkflairRepository;
    }

    public List<Linkflair> getAllLinkflairs() {
        return linkflairRepository.findAll();
    }

    public Linkflair getLinkflairById(String linkflairId) {
        return linkflairRepository.findById(linkflairId)
                .orElseThrow(() -> new ResourceNotFoundException("Linkflair Not Found"));
    }

}
