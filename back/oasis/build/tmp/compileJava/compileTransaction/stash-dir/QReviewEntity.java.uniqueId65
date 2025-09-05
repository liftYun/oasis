package org.muhan.oasis.review.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QReviewEntity is a Querydsl query type for ReviewEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QReviewEntity extends EntityPathBase<ReviewEntity> {

    private static final long serialVersionUID = -38355906L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QReviewEntity reviewEntity = new QReviewEntity("reviewEntity");

    public final StringPath content = createString("content");

    public final StringPath content_eng = createString("content_eng");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Float> rating = createNumber("rating", Float.class);

    public final org.muhan.oasis.reservation.entity.QReservationEntity reservationId;

    public final NumberPath<Long> reviewId = createNumber("reviewId", Long.class);

    public final org.muhan.oasis.user.entity.QUserEntity userId;

    public QReviewEntity(String variable) {
        this(ReviewEntity.class, forVariable(variable), INITS);
    }

    public QReviewEntity(Path<? extends ReviewEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QReviewEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QReviewEntity(PathMetadata metadata, PathInits inits) {
        this(ReviewEntity.class, metadata, inits);
    }

    public QReviewEntity(Class<? extends ReviewEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.reservationId = inits.isInitialized("reservationId") ? new org.muhan.oasis.reservation.entity.QReservationEntity(forProperty("reservationId"), inits.get("reservationId")) : null;
        this.userId = inits.isInitialized("userId") ? new org.muhan.oasis.user.entity.QUserEntity(forProperty("userId"), inits.get("userId")) : null;
    }

}

