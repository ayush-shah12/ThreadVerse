package dev.ayushshah.threadverse.dto;

public record CreatePostRequest(
        String title,
        String content,
        String communityId,

        String linkflairId,

        boolean newLinkflair,
        String newLinkflairName

) {
}
