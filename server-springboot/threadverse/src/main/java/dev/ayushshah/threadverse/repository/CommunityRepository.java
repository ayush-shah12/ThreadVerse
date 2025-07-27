package dev.ayushshah.threadverse.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.ayushshah.threadverse.model.Community;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {


}
