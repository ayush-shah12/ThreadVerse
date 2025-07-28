package dev.ayushshah.threadverse.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String content;

    @Builder.Default
    private int votes = 0;

    @Builder.Default
    private Date date = new Date();

    private String authorID;
    private List<String> replyIds;    
}
