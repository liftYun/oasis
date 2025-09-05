package org.muhan.oasis.stay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStayFacilityEntity is a Querydsl query type for StayFacilityEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStayFacilityEntity extends EntityPathBase<StayFacilityEntity> {

    private static final long serialVersionUID = -2141843709L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStayFacilityEntity stayFacilityEntity = new QStayFacilityEntity("stayFacilityEntity");

    public final QFacilityEntity facility;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QStayEntity stay;

    public QStayFacilityEntity(String variable) {
        this(StayFacilityEntity.class, forVariable(variable), INITS);
    }

    public QStayFacilityEntity(Path<? extends StayFacilityEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStayFacilityEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStayFacilityEntity(PathMetadata metadata, PathInits inits) {
        this(StayFacilityEntity.class, metadata, inits);
    }

    public QStayFacilityEntity(Class<? extends StayFacilityEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.facility = inits.isInitialized("facility") ? new QFacilityEntity(forProperty("facility")) : null;
        this.stay = inits.isInitialized("stay") ? new QStayEntity(forProperty("stay"), inits.get("stay")) : null;
    }

}

