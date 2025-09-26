package org.muhan.oasis.valueobject;

import lombok.Getter;

@Getter
public enum Language {
    KOR("KOR"), ENG("ENG");

    private final String description;
    Language(String description) {
        this.description = description;
    }
    public static Language from(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Language 값이 null입니다.");
        }
        String upper = value.trim().toUpperCase();
        for (Language lang : values()) {
            if (lang.name().equals(upper) || lang.description.equalsIgnoreCase(upper)) {
                return lang;
            }
        }
        throw new IllegalArgumentException("지원하지 않는 Language: " + value);
    }
}
