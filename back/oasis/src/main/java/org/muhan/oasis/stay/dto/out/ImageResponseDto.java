package org.muhan.oasis.stay.dto.out;

import lombok.AllArgsConstructor;
import lombok.Builder;
import org.muhan.oasis.stay.entity.StayPhotoEntity;

import java.util.List;

@Builder
public record ImageResponseDto(String url, Integer sortOrder) {

    public static List<ImageResponseDto> from(List<StayPhotoEntity> stayPhotoEntities) {
        return stayPhotoEntities.stream().map(ImageResponseDto::from).toList();
    }

    public static ImageResponseDto from(StayPhotoEntity stayPhotoEntity) {
        return ImageResponseDto.builder()
                .url(stayPhotoEntity.getUrl())
                .sortOrder(stayPhotoEntity.getSortOrder())
                .build();
    }
}
