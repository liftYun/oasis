package org.muhan.oasis.key.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QKeyOwnerEntity is a Querydsl query type for KeyOwnerEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QKeyOwnerEntity extends EntityPathBase<KeyOwnerEntity> {

    private static final long serialVersionUID = -1997403163L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QKeyOwnerEntity keyOwnerEntity = new QKeyOwnerEntity("keyOwnerEntity");

    public final QKeyEntity keyId;

    public final org.muhan.oasis.reservation.entity.QReservationEntity reservationId;

    public final org.muhan.oasis.user.entity.QUserEntity userId;

    public QKeyOwnerEntity(String variable) {
        this(KeyOwnerEntity.class, forVariable(variable), INITS);
    }

    public QKeyOwnerEntity(Path<? extends KeyOwnerEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QKeyOwnerEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QKeyOwnerEntity(PathMetadata metadata, PathInits inits) {
        this(KeyOwnerEntity.class, metadata, inits);
    }

    public QKeyOwnerEntity(Class<? extends KeyOwnerEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.keyId = inits.isInitialized("keyId") ? new QKeyEntity(forProperty("keyId"), inits.get("keyId")) : null;
        this.reservationId = inits.isInitialized("reservationId") ? new org.muhan.oasis.reservation.entity.QReservationEntity(forProperty("reservationId"), inits.get("reservationId")) : null;
        this.userId = inits.isInitialized("userId") ? new org.muhan.oasis.user.entity.QUserEntity(forProperty("userId"), inits.get("userId")) : null;
    }

}

