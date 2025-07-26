package dev.ayushshah.threadverse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "post_votes")
public class PostVote {
    @Id
    private String id;

    private String userID;
    private String postID;

    private VoteType vote = VoteType.NOVOTE;

}

