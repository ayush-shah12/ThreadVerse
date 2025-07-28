package dev.ayushshah.threadverse.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.ayushshah.threadverse.model.Comment;
import java.util.List;
import java.util.Optional;


@Repository
public interface CommentRepository extends MongoRepository<Comment, String>{
    public List<Comment> findAllByAuthorID(String authorId);

    public Optional<Comment> findByReplyIdsContaining(String commentId);
}
