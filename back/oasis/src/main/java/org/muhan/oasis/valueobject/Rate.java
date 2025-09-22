package org.muhan.oasis.valueobject;

import lombok.Getter;

@Getter
public enum Rate {
    LOW_RATE("lowRate"), HIGH_RATE("highRate");
    private final String description;

    Rate(String description){
        this.description = description;
    }
}
