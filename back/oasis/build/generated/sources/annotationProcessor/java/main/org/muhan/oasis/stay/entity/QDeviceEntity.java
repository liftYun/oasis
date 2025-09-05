package org.muhan.oasis.stay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDeviceEntity is a Querydsl query type for DeviceEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDeviceEntity extends EntityPathBase<DeviceEntity> {

    private static final long serialVersionUID = -1785568067L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDeviceEntity deviceEntity = new QDeviceEntity("deviceEntity");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QStayEntity stay;

    public final StringPath stayName = createString("stayName");

    public final StringPath stayNameEng = createString("stayNameEng");

    public QDeviceEntity(String variable) {
        this(DeviceEntity.class, forVariable(variable), INITS);
    }

    public QDeviceEntity(Path<? extends DeviceEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDeviceEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDeviceEntity(PathMetadata metadata, PathInits inits) {
        this(DeviceEntity.class, metadata, inits);
    }

    public QDeviceEntity(Class<? extends DeviceEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.stay = inits.isInitialized("stay") ? new QStayEntity(forProperty("stay"), inits.get("stay")) : null;
    }

}

