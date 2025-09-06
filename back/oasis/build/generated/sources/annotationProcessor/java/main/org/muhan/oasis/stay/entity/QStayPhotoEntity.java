package org.muhan.oasis.stay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStayPhotoEntity is a Querydsl query type for StayPhotoEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStayPhotoEntity extends EntityPathBase<StayPhotoEntity> {

    private static final long serialVersionUID = -1924180168L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStayPhotoEntity stayPhotoEntity = new QStayPhotoEntity("stayPhotoEntity");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> sortOrder = createNumber("sortOrder", Integer.class);

    public final QStayEntity stay;

    public final StringPath url = createString("url");

    public QStayPhotoEntity(String variable) {
        this(StayPhotoEntity.class, forVariable(variable), INITS);
    }

    public QStayPhotoEntity(Path<? extends StayPhotoEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStayPhotoEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStayPhotoEntity(PathMetadata metadata, PathInits inits) {
        this(StayPhotoEntity.class, metadata, inits);
    }

    public QStayPhotoEntity(Class<? extends StayPhotoEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.stay = inits.isInitialized("stay") ? new QStayEntity(forProperty("stay"), inits.get("stay")) : null;
    }

}

