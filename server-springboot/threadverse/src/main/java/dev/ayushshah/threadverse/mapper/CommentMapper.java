package dev.ayushshah.threadverse.mapper;

import dev.ayushshah.threadverse.model.Comment;
import dev.ayushshah.threadverse.dto.CommentWithUserDTO;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    CommentWithUserDTO toDTO(Comment comment);
}
