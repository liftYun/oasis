package org.muhan.oasis.stay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStayRatingSummaryEntity is a Querydsl query type for StayRatingSummaryEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStayRatingSummaryEntity extends EntityPathBase<StayRatingSummaryEntity> {

    private static final long serialVersionUID = -1608553457L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStayRatingSummaryEntity stayRatingSummaryEntity = new QStayRatingSummaryEntity("stayRatingSummaryEntity");

    public final NumberPath<java.math.BigDecimal> avgRating = createNumber("avgRating", java.math.BigDecimal.class);

    public final StringPath highRateSummary = createString("highRateSummary");

    public final StringPath highRateSummaryEng = createString("highRateSummaryEng");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath lowRateSummary = createString("lowRateSummary");

    public final StringPath lowRateSummaryEng = createString("lowRateSummaryEng");

    public final NumberPath<Integer> ratingCnt = createNumber("ratingCnt", Integer.class);

    public final NumberPath<Integer> ratingSum = createNumber("ratingSum", Integer.class);

    public final QStayEntity stay;

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QStayRatingSummaryEntity(String variable) {
        this(StayRatingSummaryEntity.class, forVariable(variable), INITS);
    }

    public QStayRatingSummaryEntity(Path<? extends StayRatingSummaryEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStayRatingSummaryEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStayRatingSummaryEntity(PathMetadata metadata, PathInits inits) {
        this(StayRatingSummaryEntity.class, metadata, inits);
    }

    public QStayRatingSummaryEntity(Class<? extends StayRatingSummaryEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.stay = inits.isInitialized("stay") ? new QStayEntity(forProperty("stay"), inits.get("stay")) : null;
    }

}

