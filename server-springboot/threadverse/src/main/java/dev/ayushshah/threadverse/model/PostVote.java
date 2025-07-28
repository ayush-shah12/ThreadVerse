package dev.ayushshah.threadverse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "post_votes")
public class PostVote {
    @Id
    private String id;

    private String userId;
    private String postId;

    @Builder.Default
    private VoteType vote = VoteType.NOVOTE;

}

