package org.muhan.oasis.valueobject;

import lombok.Getter;

@Getter
public enum Language {
    KOR("KOR"), ENG("ENG");

    private final String description;
    Language(String description) {
        this.description = description;
    }
}
