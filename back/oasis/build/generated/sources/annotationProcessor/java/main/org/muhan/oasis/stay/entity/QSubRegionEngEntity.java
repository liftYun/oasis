package org.muhan.oasis.stay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSubRegionEngEntity is a Querydsl query type for SubRegionEngEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSubRegionEngEntity extends EntityPathBase<SubRegionEngEntity> {

    private static final long serialVersionUID = -2045490351L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSubRegionEngEntity subRegionEngEntity = new QSubRegionEngEntity("subRegionEngEntity");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QRegionEntity region;

    public final StringPath subName = createString("subName");

    public QSubRegionEngEntity(String variable) {
        this(SubRegionEngEntity.class, forVariable(variable), INITS);
    }

    public QSubRegionEngEntity(Path<? extends SubRegionEngEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSubRegionEngEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSubRegionEngEntity(PathMetadata metadata, PathInits inits) {
        this(SubRegionEngEntity.class, metadata, inits);
    }

    public QSubRegionEngEntity(Class<? extends SubRegionEngEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.region = inits.isInitialized("region") ? new QRegionEntity(forProperty("region")) : null;
    }

}

