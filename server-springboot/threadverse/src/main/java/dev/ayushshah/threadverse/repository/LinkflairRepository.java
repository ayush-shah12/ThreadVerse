package dev.ayushshah.threadverse.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.ayushshah.threadverse.model.Linkflair;

@Repository
public interface LinkflairRepository extends MongoRepository<Linkflair, String> {

}
