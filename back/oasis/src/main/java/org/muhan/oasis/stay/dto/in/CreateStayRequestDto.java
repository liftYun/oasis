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
public class CreateStayRequestDto {
    @NotBlank
    private Long subRegionId;
    @NotBlank
    private String title;
    @NotBlank
    private String titleEng;
    @NotBlank
    private String description;
    @NotBlank
    private String descriptionEng;
    @NotBlank
    private Integer price;
    @NotBlank
    private String address;
    @NotBlank
    private String addressEng;
    @NotBlank
    private String addressDetail;
    @NotBlank
    private String addressDetailEng;
    @NotBlank
    private String postalCode;
    @NotBlank
    private Integer maxGuest;
    @NotNull
    @Size(min = 1, max = 10)
    private List<ImageRequestDto> imageRequestList;
    @NotNull
    private List<Long> facilities;
    @NotNull
    private List<BlockRangeDto> blockRangeList;

    public String getThumbnail(){
        if(imageRequestList.isEmpty()) return null;
        return imageRequestList.get(0).key();
    }
}
