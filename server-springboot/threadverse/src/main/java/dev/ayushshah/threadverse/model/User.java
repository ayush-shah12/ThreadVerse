package dev.ayushshah.threadverse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

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
    private int reputation = 100;
    private Date dateJoined = new Date();
    private String role = "user";
}
