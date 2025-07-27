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
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String title;
    private String content;

    @Builder.Default
    private int views = 0;
    @Builder.Default
    private int votes = 0;

    @Builder.Default
    private Date datePosted = new Date();

    private String authorId;
    private String linkflairId;
    private List<String> commentIds;

}
