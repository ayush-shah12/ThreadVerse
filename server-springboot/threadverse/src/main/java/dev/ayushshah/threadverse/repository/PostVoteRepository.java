package dev.ayushshah.threadverse.repository;

import org.springframework.stereotype.Repository;

import dev.ayushshah.threadverse.model.PostVote;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

@Repository
public interface PostVoteRepository extends MongoRepository<PostVote, String>{
    
    public Optional<PostVote> findByUserIdAndPostId(String userId, String postId);
}
