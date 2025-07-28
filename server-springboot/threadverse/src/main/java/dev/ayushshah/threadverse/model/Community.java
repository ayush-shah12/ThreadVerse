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
@Document(collection = "communities")
public class Community {
    @Id
    private String id;
    private String name;
    private String description;

    @Builder.Default
    private int memberCount = 0;

    @Builder.Default
    private Date dateCreated = new Date();

    private String authorId;
    private List<String> memberIds;
    private List<String> postIds;

}
