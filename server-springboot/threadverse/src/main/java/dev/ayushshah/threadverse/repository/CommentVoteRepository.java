package dev.ayushshah.threadverse.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.ayushshah.threadverse.model.CommentVote;

@Repository
public interface CommentVoteRepository extends MongoRepository<CommentVote, String> {

    public Optional<CommentVote> findByUserIdAndCommentId(String userId, String postId);
    
}
