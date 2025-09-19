package org.muhan.oasis.stay.dto.out;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface StayCardView {
    Long getStayId();
    String getTitle();
    String getThumbnail();
    BigDecimal getRating();
    Integer getPrice();

}