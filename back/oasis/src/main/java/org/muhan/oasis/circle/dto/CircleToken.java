package org.muhan.oasis.circle.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CircleToken {
    private String id;
    private String blockchain;
    private String tokenAddress;
    private String symbol;
    private String name;
    private int decimals;
}
