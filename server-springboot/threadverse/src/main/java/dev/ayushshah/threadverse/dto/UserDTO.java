package dev.ayushshah.threadverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import org.springframework.data.annotation.Id;

import java.util.Date;

@Data
@AllArgsConstructor
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
