package org.muhan.oasis.stay.dto.in;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateStayRequestDTO {
    @NotBlank
    private Integer subRegionId;
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotBlank
    private Integer price;
    @NotBlank
    private String address;
    @NotBlank
    private String addressEng;

    private String addressDetail;
    @NotBlank
    private String postalCode;
    @NotBlank
    private Integer maxGuest;
    @NotNull
    @Size(min = 1, max = 10)
    private List<String> images;
    @NotNull
    private List<Integer> facilities;
    @NotNull
    private List<BlockRangeDto> blockRangeList;
}
