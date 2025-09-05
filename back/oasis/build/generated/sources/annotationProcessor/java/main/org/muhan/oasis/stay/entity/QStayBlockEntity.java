package org.muhan.oasis.stay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStayBlockEntity is a Querydsl query type for StayBlockEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStayBlockEntity extends EntityPathBase<StayBlockEntity> {

    private static final long serialVersionUID = -2140770989L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStayBlockEntity stayBlockEntity = new QStayBlockEntity("stayBlockEntity");

    public final DateTimePath<java.time.LocalDateTime> endDate = createDateTime("endDate", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DateTimePath<java.time.LocalDateTime> startDate = createDateTime("startDate", java.time.LocalDateTime.class);

    public final QStayEntity stay;

    public QStayBlockEntity(String variable) {
        this(StayBlockEntity.class, forVariable(variable), INITS);
    }

    public QStayBlockEntity(Path<? extends StayBlockEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStayBlockEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStayBlockEntity(PathMetadata metadata, PathInits inits) {
        this(StayBlockEntity.class, metadata, inits);
    }

    public QStayBlockEntity(Class<? extends StayBlockEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.stay = inits.isInitialized("stay") ? new QStayEntity(forProperty("stay"), inits.get("stay")) : null;
    }

}

