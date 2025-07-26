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
@Document(collection = "communities")
public class Community {
    @Id
    private String id;
    private String name;
    private String description;

    private int memberCount = 0;

    private Date dateCreated = new Date();

    private String authorId;
    private List<String> memberIds;
    private List<String> postIds;
    
}
