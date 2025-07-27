package dev.ayushshah.threadverse.mapper;

import dev.ayushshah.threadverse.model.Community;
import dev.ayushshah.threadverse.dto.CommunityWithUserDTO;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommunityMapper {
    CommunityWithUserDTO toDTO(Community community);
}
