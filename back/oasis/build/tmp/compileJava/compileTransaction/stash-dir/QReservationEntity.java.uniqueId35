package org.muhan.oasis.reservation.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QReservationEntity is a Querydsl query type for ReservationEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QReservationEntity extends EntityPathBase<ReservationEntity> {

    private static final long serialVersionUID = -1509310988L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QReservationEntity reservationEntity = new QReservationEntity("reservationEntity");

    public final DateTimePath<java.time.LocalDateTime> checkinDate = createDateTime("checkinDate", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> checkoutDate = createDateTime("checkoutDate", java.time.LocalDateTime.class);

    public final BooleanPath isCancled = createBoolean("isCancled");

    public final BooleanPath isReviewed = createBoolean("isReviewed");

    public final BooleanPath isSettlemented = createBoolean("isSettlemented");

    public final NumberPath<Integer> payment = createNumber("payment", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> reservationDate = createDateTime("reservationDate", java.time.LocalDateTime.class);

    public final StringPath reservationId = createString("reservationId");

    public final org.muhan.oasis.stay.entity.QStayEntity stayId;

    public final StringPath stayTitle = createString("stayTitle");

    public final StringPath stayTitleEng = createString("stayTitleEng");

    public final org.muhan.oasis.user.entity.QUserEntity userId;

    public QReservationEntity(String variable) {
        this(ReservationEntity.class, forVariable(variable), INITS);
    }

    public QReservationEntity(Path<? extends ReservationEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QReservationEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QReservationEntity(PathMetadata metadata, PathInits inits) {
        this(ReservationEntity.class, metadata, inits);
    }

    public QReservationEntity(Class<? extends ReservationEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.stayId = inits.isInitialized("stayId") ? new org.muhan.oasis.stay.entity.QStayEntity(forProperty("stayId"), inits.get("stayId")) : null;
        this.userId = inits.isInitialized("userId") ? new org.muhan.oasis.user.entity.QUserEntity(forProperty("userId"), inits.get("userId")) : null;
    }

}

