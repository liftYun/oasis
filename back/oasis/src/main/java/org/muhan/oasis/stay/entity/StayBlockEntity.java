package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Check;
import org.muhan.oasis.stay.dto.in.BlockRangeDto;

import java.time.LocalDate;

@Entity
@Getter
@Builder
@NoArgsConstructor
@Table(name = "stay_block")
@AllArgsConstructor
public class StayBlockEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stay_block_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "stay_id", nullable = false)
    private StayEntity stay;

    @Column(name = "start_date",nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    public static StayBlockEntity from(BlockRangeDto blockRangeDto, StayEntity stay){
        return StayBlockEntity.builder()
                .stay(stay)
                .startDate(blockRangeDto.start())
                .endDate(blockRangeDto.end())
                .build();
    }

}
