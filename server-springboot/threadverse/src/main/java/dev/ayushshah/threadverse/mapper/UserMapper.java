package dev.ayushshah.threadverse.mapper;

import dev.ayushshah.threadverse.model.User;
import dev.ayushshah.threadverse.dto.UserDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(User user);
}
