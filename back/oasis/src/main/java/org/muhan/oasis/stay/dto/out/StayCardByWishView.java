package org.muhan.oasis.stay.dto.out;

import java.math.BigDecimal;

public interface StayCardByWishView {
    Long getStayId();
    String getTitle();
    String getThumbnail();
    BigDecimal getRating();
    Integer getPrice();
    Long getWishCount();
}

