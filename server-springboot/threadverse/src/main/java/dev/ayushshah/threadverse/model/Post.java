package dev.ayushshah.threadverse.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String title;
    private String content;

    private int views = 0;
    private int votes = 0;

    private Date datePosted = new Date();

    private String authorId;
    private String linkflairId;
    private List<String> commentIds;
    
}
