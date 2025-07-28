package dev.ayushshah.threadverse.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import dev.ayushshah.threadverse.exceptions.ResourceNotFoundException;
import dev.ayushshah.threadverse.model.Post;
import dev.ayushshah.threadverse.model.PostVote;
import dev.ayushshah.threadverse.model.VoteType;
import dev.ayushshah.threadverse.model.User;
import dev.ayushshah.threadverse.repository.PostRepository;
import dev.ayushshah.threadverse.repository.PostVoteRepository;
import dev.ayushshah.threadverse.repository.UserRepository;

@Service
public class VoteService {

    private final PostRepository postRepository;
    private final PostVoteRepository postVoteRepository;
    private final UserRepository userRepository;

    public VoteService(PostRepository postRepository, PostVoteRepository postVoteRepository,
            UserRepository userRepository) {
        this.postRepository = postRepository;
        this.postVoteRepository = postVoteRepository;
        this.userRepository = userRepository;
    }

    public Map<?, ?> addPostVote(String postId, VoteType vote, String userId) {

        // get user's original vote if available
        PostVote userPostVote = postVoteRepository.findByUserIdAndPostId(userId, postId)
                .orElse(PostVote.builder().postId(postId).userId(userId).build());

        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post Not Found"));

        // a vote's effect changes based on the user's initial vote state
        int voteChange = 0;
        int reputationChange = 0;
        VoteType newVoteState = userPostVote.getVote(); // current state

        if (vote == VoteType.UPVOTE) {
            if (userPostVote.getVote() == VoteType.NOVOTE) {
                voteChange = 1;
                reputationChange = 5;
                newVoteState = VoteType.UPVOTE;
            } else if (userPostVote.getVote() == VoteType.UPVOTE) {
                voteChange = -1;
                reputationChange = -5;
                newVoteState = VoteType.NOVOTE;
            } else {
                voteChange = 2;
                reputationChange = 15;
                newVoteState = VoteType.UPVOTE;
            }
        }

        else if (vote == VoteType.DOWNVOTE) {
            if (userPostVote.getVote() == VoteType.NOVOTE) {
                voteChange = -1;
                reputationChange = -10;
                newVoteState = VoteType.DOWNVOTE;
            } else if (userPostVote.getVote() == VoteType.DOWNVOTE) {
                voteChange = 1;
                reputationChange = 10;
                newVoteState = VoteType.NOVOTE;
            } else {
                voteChange = -2;
                reputationChange = -15;
                newVoteState = VoteType.DOWNVOTE;
            }
        }

        // update Post
        int newPostVotes = post.getVotes() + voteChange;
        post.setVotes(newPostVotes);
        postRepository.save(post);

        // update PostVote
        userPostVote.setVote(newVoteState);
        postVoteRepository.save(userPostVote);

        // update author of the posts' Reputation
        User poster = userRepository.findById(post.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        poster.setReputation(poster.getReputation() + reputationChange);

        userRepository.save(poster);

        return Map.of("success", true, "newVoteState", newVoteState.name(), "newVoteCount", newPostVotes);
    }

}
