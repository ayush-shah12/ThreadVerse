package dev.ayushshah.threadverse.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.ayushshah.threadverse.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String>{  // <Entity Type, _id Type>

    public Optional<User> findByEmail(String email);

    public Optional<User> findByDisplayName(String displayName);

    public boolean existsByEmail(String email);

    public boolean existsByDisplayName(String displayName);


}