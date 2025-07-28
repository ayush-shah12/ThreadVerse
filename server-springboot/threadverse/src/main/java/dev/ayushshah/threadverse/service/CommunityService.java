package dev.ayushshah.threadverse.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.ayushshah.threadverse.dto.CommunityWithUserDTO;
import dev.ayushshah.threadverse.dto.CreateCommunityRequest;
import dev.ayushshah.threadverse.dto.UpdateResourceRequest;
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

        public Community createCommunity(CreateCommunityRequest createCommunityRequest, String userId) {
                if (communityRepository.existsByNameAllIgnoreCase(createCommunityRequest.name())) {
                        throw new RuntimeException("Community Name Already Exists");
                }

                Community c = Community.builder()
                                .authorId(userId)
                                .description(createCommunityRequest.description())
                                .name(createCommunityRequest.name())
                                .memberCount(1)
                                .memberIds(List.of(userId))
                                .postIds(List.of())
                                .build();

                Community saved = communityRepository.save(c);

                return saved;
        }

        public Community updateCommunity(String communityId, UpdateResourceRequest updateCommunityRequest,
                        String userId) {
                if (!communityRepository.existsById(communityId)) {
                        throw new ResourceNotFoundException("Community Not Found");
                }

                Community c = communityRepository.findById(communityId).get();

                if (!c.getAuthorId().equals(userId)) {
                        throw new RuntimeException("Unauthorized to update community.");
                }

                c.setDescription(updateCommunityRequest.updatedContentOrDescription());
                c.setName(updateCommunityRequest.updatedTitleOrName());

                Community saved = communityRepository.save(c);

                return saved;
        }

        public boolean existsByName(String communityName) {
                return communityRepository.existsByNameAllIgnoreCase(communityName);
        }

        public boolean joinCommunity(String communityId, String userId) {
                Community community = communityRepository.findById(communityId)
                                .orElseThrow(() -> new ResourceNotFoundException("Community Not Found"));

                if (community.getMemberIds().contains(userId)) {
                        return false;
                } else {
                        community.getMemberIds().add(userId);
                        community.setMemberCount(community.getMemberCount() + 1);
                        communityRepository.save(community);
                        return true;
                }
        }

        public boolean leaveCommunity(String communityId, String userId) {
                Community community = communityRepository.findById(communityId)
                                .orElseThrow(() -> new ResourceNotFoundException("Community Not Found"));

                if (community.getMemberIds().contains(userId)) {
                        community.getMemberIds().remove(userId);
                        community.setMemberCount(community.getMemberCount() - 1);
                        communityRepository.save(community);
                        return true;

                } else {
                        return false;
                }

        }
}
