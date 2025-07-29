package dev.ayushshah.threadverse.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.ayushshah.threadverse.dto.CreatePostRequest;
import dev.ayushshah.threadverse.dto.PostWithUserDTO;
import dev.ayushshah.threadverse.dto.UpdateResourceRequest;
import dev.ayushshah.threadverse.dto.UserDTO;
import dev.ayushshah.threadverse.mapper.PostMapper;
import dev.ayushshah.threadverse.model.Community;
import dev.ayushshah.threadverse.model.Linkflair;
import dev.ayushshah.threadverse.model.Post;
import dev.ayushshah.threadverse.model.User;

import dev.ayushshah.threadverse.repository.CommunityRepository;
import dev.ayushshah.threadverse.repository.LinkflairRepository;
import dev.ayushshah.threadverse.repository.PostRepository;
import dev.ayushshah.threadverse.repository.UserRepository;
import dev.ayushshah.threadverse.exceptions.ResourceNotFoundException;

@Service
public class PostService {

	private final PostRepository postRepository;
	private final UserRepository userRepository;
	private final CommunityRepository communityRepository;
	private final LinkflairRepository linkflairRepository;
	private final PostMapper postMapper;

	public PostService(PostRepository postRepository, UserRepository userRepository, PostMapper postMapper,
			CommunityRepository communityRepository, LinkflairRepository linkflairRepository) {
		this.postRepository = postRepository;
		this.userRepository = userRepository;
		this.communityRepository = communityRepository;
		this.postMapper = postMapper;
		this.linkflairRepository = linkflairRepository;

	}

	public List<PostWithUserDTO> getAllPosts() {

		// get all posts
		List<Post> allPosts = postRepository.findAll();

		// get all unique authorIds
		Set<String> authorIds = allPosts.stream()
				.map(post -> post.getAuthorId())
				.collect(Collectors.toSet());

		// map of user.id/post.author_id to User Document
		Map<String, User> authors = userRepository
				.findAllById(authorIds)
				.stream()
				.collect(Collectors.toMap(user -> user.getId(), user -> user));

		// returns a list of PostWithUserDTO, where UserDTO attribute is just filled
		// with displayName
		return allPosts.stream()
				.map(post -> {
					User user = authors.get(post.getAuthorId());
					PostWithUserDTO postWithUserDTO = postMapper.toDTO(post);
					postWithUserDTO.setUser(user != null
							? UserDTO.builder()
									.displayName(user.getDisplayName())
									.id(user.getId())
									.build()
							: null);
					return postWithUserDTO;
				})
				.collect(Collectors.toList());

	}

	public List<PostWithUserDTO> getPostsByIds(List<String> postIds) {

		// get all posts
		List<Post> allPosts = postRepository.findAllById(postIds);

		// get all unique authorIds
		Set<String> authorIds = allPosts.stream()
				.map(post -> post.getAuthorId())
				.collect(Collectors.toSet());

		// map of user.id/post.author_id to User Document
		Map<String, User> authors = userRepository
				.findAllById(authorIds)
				.stream()
				.collect(Collectors.toMap(user -> user.getId(), user -> user));

		// returns a list of PostWithUserDTO, where UserDTO attribute is just filled
		// with displayName
		return allPosts.stream()
				.map(post -> {
					User user = authors.get(post.getAuthorId());
					PostWithUserDTO postWithUserDTO = postMapper.toDTO(post);
					postWithUserDTO.setUser(user != null
							? UserDTO.builder()
									.displayName(user.getDisplayName())
									.id(user.getId())
									.build()
							: null);
					return postWithUserDTO;
				})
				.collect(Collectors.toList());

	}

	public Optional<PostWithUserDTO> getPostById(String postId) {
		List<PostWithUserDTO> post = getPostsByIds(List.of(postId));

		if (post.size() == 0) {
			return Optional.empty();
		}
		return Optional.of(post.get(0));
	}

	public List<PostWithUserDTO> getPostsByCommunityId(String communityId) {

		List<String> postIds = communityRepository.findById(communityId)
				.map(community -> community.getPostIds())
				.orElse(List.of());

		return getPostsByIds(postIds);
	}

	public List<Post> getPostsByAuthorId(String authorId){
		return postRepository.findAllByAuthorId(authorId);
	}

	public Post createPost(CreatePostRequest postRequest, String userId) {
		// check if community exists
		if (!communityRepository.existsById(postRequest.communityId())) {
			throw new ResourceNotFoundException("Community Not Found");
		}

		// create or check if existing linkflair exists
		String linkflairID = "";

		if (postRequest.newLinkflair()) {
			Linkflair newLinkflair = Linkflair.builder()
					.content(postRequest.newLinkflairName())
					.build();
			Linkflair saved = linkflairRepository.save(newLinkflair);
			linkflairID = saved.getId();
		} else {
			if (!linkflairRepository.existsById(postRequest.linkflairId())) {
				throw new ResourceNotFoundException("Linkflair Not Found");
			}
			linkflairID = postRequest.linkflairId();

		}

		// create post
		Post post = Post.builder()
				.authorId(userId)
				.commentIds(List.of())
				.content(postRequest.content())
				.title(postRequest.title())
				.linkflairId(linkflairID)
				.build();

		// save post
		Post saved_post = postRepository.save(post);

		// update community
		Community community = communityRepository.findById(postRequest.communityId())
				.orElseThrow(() -> new ResourceNotFoundException("Community not found"));

		community.getPostIds().add(saved_post.getId());
		communityRepository.save(community);

		// return post
		return saved_post;

	}

	public Post updatePost(String postId, UpdateResourceRequest updatePostRequest, String userId) {
		if (!postRepository.existsById(postId)) {
			throw new ResourceNotFoundException("Post Not Found");
		}

		Post post = postRepository.findById(postId).get();

		if (!post.getAuthorId().equals(userId)) {
			throw new RuntimeException("Unauthorized to edit post");
		}

		post.setContent(updatePostRequest.updatedContentOrDescription());
		post.setTitle(updatePostRequest.updatedTitleOrName());

		Post savedPost = postRepository.save(post);

		return savedPost;

	}

	public boolean updateViews(String postId){
		Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post Not Found"));

		post.setViews(post.getViews() + 1);
		postRepository.save(post);
		return true;
	}

	public String getCommunityName(String postId) {
		if (!postRepository.existsById(postId)) {
			throw new ResourceNotFoundException("Post Not Found");
		}

		List<Community> communities = communityRepository.findAll();
		for (Community c : communities) {
			if (c.getPostIds().contains(postId)) {
				return c.getName();
			}
		}

		throw new ResourceNotFoundException("Community Not Found");
	}
}
