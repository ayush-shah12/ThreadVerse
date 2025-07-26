package dev.ayushshah.threadverse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Builder
@Data
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String firstName;
    private String lastName;
    private String email;
    private String displayName;
    private String password;
    
    @Builder.Default
    private int reputation = 100;
    
    @Builder.Default
    private Date dateJoined = new Date();
    
    @Builder.Default
    private String role = "user";
}
