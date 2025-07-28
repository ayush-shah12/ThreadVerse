package dev.ayushshah.threadverse.dto;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommunityWithUserDTO {
    @Id
    private String id;
    private String name;
    private String description;

    private int memberCount;

    private Date dateCreated;

    private String authorId;
    private List<String> memberIds;
    private List<String> postIds;

    private UserDTO user;

}
