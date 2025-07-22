package dev.ayushshah.threadverse.model;

public enum VoteType {
    NOVOTE(0),
    UPVOTE(1),
    DOWNVOTE(-1);

    private final int value;

    VoteType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}

