package dev.ayushshah.threadverse.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import dev.ayushshah.threadverse.exceptions.ResourceNotFoundException;
import dev.ayushshah.threadverse.model.CommentVote;
import dev.ayushshah.threadverse.model.Post;
import dev.ayushshah.threadverse.model.PostVote;
import dev.ayushshah.threadverse.model.VoteType;
import dev.ayushshah.threadverse.model.User;
import dev.ayushshah.threadverse.repository.CommentRepository;
import dev.ayushshah.threadverse.repository.CommentVoteRepository;
import dev.ayushshah.threadverse.repository.PostRepository;
import dev.ayushshah.threadverse.repository.PostVoteRepository;
import dev.ayushshah.threadverse.repository.UserRepository;
import dev.ayushshah.threadverse.model.Comment;


@Service
public class VoteService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PostVoteRepository postVoteRepository;
    private final CommentVoteRepository commentVoteRepository;
    private final UserRepository userRepository;

    public VoteService(PostRepository postRepository, PostVoteRepository postVoteRepository,
            UserRepository userRepository, CommentVoteRepository commentVoteRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.postVoteRepository = postVoteRepository;
        this.userRepository = userRepository;
        this.commentVoteRepository = commentVoteRepository;
        this.commentRepository = commentRepository;
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

    public Map<?, ?> addCommentVote(String commentId, VoteType vote, String userId) {

        // get user's original vote if available
        CommentVote userCommentVote = commentVoteRepository.findByUserIdAndCommentId(userId, commentId)
                .orElse(CommentVote.builder().userId(userId).commentId(commentId).build());

        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new ResourceNotFoundException("Comment Not Found"));

        // a vote's effect changes based on the user's initial vote state
        int voteChange = 0;
        int reputationChange = 0;
        VoteType newVoteState = userCommentVote.getVote(); // current state

        if (vote == VoteType.UPVOTE) {
            if (userCommentVote.getVote() == VoteType.NOVOTE) {
                voteChange = 1;
                reputationChange = 5;
                newVoteState = VoteType.UPVOTE;
            } else if (userCommentVote.getVote() == VoteType.UPVOTE) {
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
            if (userCommentVote.getVote() == VoteType.NOVOTE) {
                voteChange = -1;
                reputationChange = -10;
                newVoteState = VoteType.DOWNVOTE;
            } else if (userCommentVote.getVote() == VoteType.DOWNVOTE) {
                voteChange = 1;
                reputationChange = 10;
                newVoteState = VoteType.NOVOTE;
            } else {
                voteChange = -2;
                reputationChange = -15;
                newVoteState = VoteType.DOWNVOTE;
            }
        }

        // update Comment
        int newCommentVotes = comment.getVotes() + voteChange;
        comment.setVotes(newCommentVotes);
        commentRepository.save(comment);

        // update CommentVote
        userCommentVote.setVote(newVoteState);
        commentVoteRepository.save(userCommentVote);

        // update author of the comments' Reputation
        User poster = userRepository.findById(comment.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        poster.setReputation(poster.getReputation() + reputationChange);

        userRepository.save(poster);

        return Map.of("success", true, "newVoteState", newVoteState.name(), "newVoteCount", newCommentVotes);
    }

}
