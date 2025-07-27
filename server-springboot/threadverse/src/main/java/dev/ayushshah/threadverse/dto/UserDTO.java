package dev.ayushshah.threadverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import org.springframework.data.annotation.Id;

import java.util.Date;

@Data
@AllArgsConstructor
@Builder
public class UserDTO {
    @Id
    private String id;

    private String firstName;
    private String lastName;
    private String email;
    private String displayName;
    private int reputation;
    private Date dateJoined;
    private String role;
}
