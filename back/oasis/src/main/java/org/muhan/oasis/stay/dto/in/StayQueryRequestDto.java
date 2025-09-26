package org.muhan.oasis.stay.dto.in;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class StayQueryRequestDto {
    Long subRegionId;
    LocalDate checkIn;
    LocalDate checkout;
}
