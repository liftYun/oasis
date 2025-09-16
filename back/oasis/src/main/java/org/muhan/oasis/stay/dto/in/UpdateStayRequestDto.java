package org.muhan.oasis.stay.dto.in;

import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateStayRequestDto {

    private Long subRegionId;
    private String title;
    private String titleEng;
    private String description;
    private String descriptionEng;
    private Integer price;
    private String address;
    private String addressEng;
    private String addressDetail;
    private String addressDetailEng;
    private String postalCode;
    private Integer maxGuest;
    @Size(min = 1, max = 10)
    private List<ImageRequestDto> imageRequestList;
    private List<Long> facilities;
    private List<BlockRangeDto> blockRangeList;

    public String getThumbnail(){
        if(imageRequestList.isEmpty()) return null;
        return imageRequestList.get(0).key();
    }
}
