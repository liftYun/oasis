package org.muhan.oasis.user.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWishEntity is a Querydsl query type for WishEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWishEntity extends EntityPathBase<WishEntity> {

    private static final long serialVersionUID = -422458304L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWishEntity wishEntity = new QWishEntity("wishEntity");

    public final org.muhan.oasis.stay.entity.QStayEntity stayId;

    public final QUserEntity userId;

    public final NumberPath<Long> wishId = createNumber("wishId", Long.class);

    public QWishEntity(String variable) {
        this(WishEntity.class, forVariable(variable), INITS);
    }

    public QWishEntity(Path<? extends WishEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWishEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWishEntity(PathMetadata metadata, PathInits inits) {
        this(WishEntity.class, metadata, inits);
    }

    public QWishEntity(Class<? extends WishEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.stayId = inits.isInitialized("stayId") ? new org.muhan.oasis.stay.entity.QStayEntity(forProperty("stayId"), inits.get("stayId")) : null;
        this.userId = inits.isInitialized("userId") ? new QUserEntity(forProperty("userId"), inits.get("userId")) : null;
    }

}

