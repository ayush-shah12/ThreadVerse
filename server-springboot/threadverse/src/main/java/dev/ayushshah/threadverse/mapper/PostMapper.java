package dev.ayushshah.threadverse.mapper;

import dev.ayushshah.threadverse.model.Post;
import dev.ayushshah.threadverse.dto.PostWithUserDTO;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper {
    PostWithUserDTO toDTO(Post post);
}
