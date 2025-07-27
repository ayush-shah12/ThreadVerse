package dev.ayushshah.threadverse.dto;

import lombok.Data;

@Data
public class CreatePostRequest {
    private String title;
    private String content;
    private String communityId;

    private String linkflairId;

    private boolean newLinkflair;
    private String newLinkflairName;

}
