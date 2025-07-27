package dev.ayushshah.threadverse.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.ayushshah.threadverse.model.Post;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    public List<Post> findAllByAuthorId(String authorId);
}
