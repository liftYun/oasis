package org.muhan.oasis.stay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSubRegionEntity is a Querydsl query type for SubRegionEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSubRegionEntity extends EntityPathBase<SubRegionEntity> {

    private static final long serialVersionUID = -1103988493L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSubRegionEntity subRegionEntity = new QSubRegionEntity("subRegionEntity");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QRegionEntity region;

    public final StringPath subName = createString("subName");

    public QSubRegionEntity(String variable) {
        this(SubRegionEntity.class, forVariable(variable), INITS);
    }

    public QSubRegionEntity(Path<? extends SubRegionEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSubRegionEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSubRegionEntity(PathMetadata metadata, PathInits inits) {
        this(SubRegionEntity.class, metadata, inits);
    }

    public QSubRegionEntity(Class<? extends SubRegionEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.region = inits.isInitialized("region") ? new QRegionEntity(forProperty("region")) : null;
    }

}

