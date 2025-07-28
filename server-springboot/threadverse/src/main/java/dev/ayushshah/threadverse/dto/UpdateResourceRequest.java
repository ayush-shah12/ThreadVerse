package dev.ayushshah.threadverse.dto;

// used for post & community updates
public record UpdateResourceRequest(
    String updatedTitleOrName,
    String updatedContentOrDescription
) {}