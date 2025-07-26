package dev.ayushshah.threadverse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "comment_votes")
public class CommentVote {
    @Id
    private String id;

    private String userID;
    private String commentID;

    private VoteType vote = VoteType.NOVOTE;

}

