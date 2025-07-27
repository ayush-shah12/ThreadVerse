package dev.ayushshah.threadverse.dto;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class PostWithUserDTO {

    @Id
    private String id;
    private String title;
    private String content;

    private int views;

    private int votes;

    private Date datePosted;

    private String authorId;
    private String linkflairId;
    private List<String> commentIds;
    
    private UserDTO user;
}
