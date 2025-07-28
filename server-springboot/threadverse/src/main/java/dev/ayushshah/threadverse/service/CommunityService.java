package dev.ayushshah.threadverse.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.ayushshah.threadverse.dto.CommunityWithUserDTO;
import dev.ayushshah.threadverse.dto.UserDTO;
import dev.ayushshah.threadverse.mapper.CommunityMapper;
import dev.ayushshah.threadverse.model.Community;
import dev.ayushshah.threadverse.model.User;
import dev.ayushshah.threadverse.repository.CommunityRepository;
import dev.ayushshah.threadverse.repository.UserRepository;
import dev.ayushshah.threadverse.exceptions.ResourceNotFoundException;

@Service
public class CommunityService {
        private final CommunityRepository communityRepository;
        private final UserRepository userRepository;
        private final CommunityMapper communityMapper;

        public CommunityService(CommunityRepository communityRepository, UserRepository userRepository,
                        CommunityMapper communityMapper) {
                this.communityRepository = communityRepository;
                this.userRepository = userRepository;
                this.communityMapper = communityMapper;
        }

        public List<CommunityWithUserDTO> getAllCommunities() {
                // get all communities
                List<Community> communities = communityRepository.findAll();

                // get all unique author ids
                Set<String> authorIds = communities.stream()
                                .map(community -> community.getAuthorId())
                                .collect(Collectors.toSet());

                // map of the authorid to User document
                Map<String, User> map = userRepository.findAllById(authorIds)
                                .stream()
                                .collect(Collectors.toMap(userDocument -> userDocument.getId(),
                                                userDocument -> userDocument));

                return communities.stream()
                                // .filter(community -> map.containsKey(community.getAuthorId()))
                                .map(
                                                community -> {
                                                        User user = map.getOrDefault(community.getAuthorId(), null);
                                                        CommunityWithUserDTO c = communityMapper.toDTO(community);
                                                        UserDTO userDTO = UserDTO.builder()
                                                                        .displayName(user != null
                                                                                        ? user.getDisplayName()
                                                                                        : "")
                                                                        .build();
                                                        c.setUser(userDTO);
                                                        return c;
                                                })
                                .collect(Collectors.toList());
        }

        public CommunityWithUserDTO getCommunityById(String communityId) {
                Community community = communityRepository.findById(communityId)
                                .orElseThrow(() -> new ResourceNotFoundException("Community Not Found"));

                User user = userRepository.findById(community.getAuthorId())
                                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

                CommunityWithUserDTO c = communityMapper.toDTO(community);
                c.setUser(UserDTO.builder().displayName(user.getDisplayName()).build());

                return c;
        }
}
