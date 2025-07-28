package dev.ayushshah.threadverse.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.ayushshah.threadverse.model.Community;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {

    public boolean existsByNameAllIgnoreCase(String name);

    public List<Community> findAllByAuthorId(String authorId);
}
