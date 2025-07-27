package dev.ayushshah.threadverse.dto;

public record UpdatePostRequest(
    String updatedTitle,
    String updatedContent
) {}