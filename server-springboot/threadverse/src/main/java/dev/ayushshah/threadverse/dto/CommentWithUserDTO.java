package dev.ayushshah.threadverse.dto;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CommentWithUserDTO {
    @Id
    private String id;
    private String content;

    private int votes;

    private Date date;

    private String authorId;
    private List<String> replyIds;

    private UserDTO user;

}
