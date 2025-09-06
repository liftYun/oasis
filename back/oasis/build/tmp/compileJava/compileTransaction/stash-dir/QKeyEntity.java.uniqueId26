package org.muhan.oasis.key.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QKeyEntity is a Querydsl query type for KeyEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QKeyEntity extends EntityPathBase<KeyEntity> {

    private static final long serialVersionUID = -1388126444L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QKeyEntity keyEntity = new QKeyEntity("keyEntity");

    public final DateTimePath<java.time.LocalDateTime> activationTime = createDateTime("activationTime", java.time.LocalDateTime.class);

    public final org.muhan.oasis.stay.entity.QDeviceEntity deviceId;

    public final DateTimePath<java.time.LocalDateTime> expirationTime = createDateTime("expirationTime", java.time.LocalDateTime.class);

    public final NumberPath<Long> keyId = createNumber("keyId", Long.class);

    public QKeyEntity(String variable) {
        this(KeyEntity.class, forVariable(variable), INITS);
    }

    public QKeyEntity(Path<? extends KeyEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QKeyEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QKeyEntity(PathMetadata metadata, PathInits inits) {
        this(KeyEntity.class, metadata, inits);
    }

    public QKeyEntity(Class<? extends KeyEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.deviceId = inits.isInitialized("deviceId") ? new org.muhan.oasis.stay.entity.QDeviceEntity(forProperty("deviceId"), inits.get("deviceId")) : null;
    }

}

