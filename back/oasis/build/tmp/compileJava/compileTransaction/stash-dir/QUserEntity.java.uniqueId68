package org.muhan.oasis.user.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUserEntity is a Querydsl query type for UserEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUserEntity extends EntityPathBase<UserEntity> {

    private static final long serialVersionUID = 731454564L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUserEntity userEntity = new QUserEntity("userEntity");

    public final org.muhan.oasis.common.base.QBaseEntity _super = new org.muhan.oasis.common.base.QBaseEntity(this);

    public final org.muhan.oasis.stay.entity.QCancellationPolicyEntity cancellationPolicy;

    public final StringPath certificateImg = createString("certificateImg");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final StringPath email = createString("email");

    public final ListPath<org.muhan.oasis.key.entity.KeyOwnerEntity, org.muhan.oasis.key.entity.QKeyOwnerEntity> keyOwners = this.<org.muhan.oasis.key.entity.KeyOwnerEntity, org.muhan.oasis.key.entity.QKeyOwnerEntity>createList("keyOwners", org.muhan.oasis.key.entity.KeyOwnerEntity.class, org.muhan.oasis.key.entity.QKeyOwnerEntity.class, PathInits.DIRECT2);

    public final EnumPath<org.muhan.oasis.valueobject.Language> language = createEnum("language", org.muhan.oasis.valueobject.Language.class);

    public final StringPath nickname = createString("nickname");

    public final StringPath profileImg = createString("profileImg");

    public final ListPath<org.muhan.oasis.reservation.entity.ReservationEntity, org.muhan.oasis.reservation.entity.QReservationEntity> reservations = this.<org.muhan.oasis.reservation.entity.ReservationEntity, org.muhan.oasis.reservation.entity.QReservationEntity>createList("reservations", org.muhan.oasis.reservation.entity.ReservationEntity.class, org.muhan.oasis.reservation.entity.QReservationEntity.class, PathInits.DIRECT2);

    public final ListPath<org.muhan.oasis.review.entity.ReviewEntity, org.muhan.oasis.review.entity.QReviewEntity> reviews = this.<org.muhan.oasis.review.entity.ReviewEntity, org.muhan.oasis.review.entity.QReviewEntity>createList("reviews", org.muhan.oasis.review.entity.ReviewEntity.class, org.muhan.oasis.review.entity.QReviewEntity.class, PathInits.DIRECT2);

    public final EnumPath<org.muhan.oasis.valueobject.Role> role = createEnum("role", org.muhan.oasis.valueobject.Role.class);

    public final ListPath<org.muhan.oasis.stay.entity.StayEntity, org.muhan.oasis.stay.entity.QStayEntity> stays = this.<org.muhan.oasis.stay.entity.StayEntity, org.muhan.oasis.stay.entity.QStayEntity>createList("stays", org.muhan.oasis.stay.entity.StayEntity.class, org.muhan.oasis.stay.entity.QStayEntity.class, PathInits.DIRECT2);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public final StringPath userUuid = createString("userUuid");

    public final ListPath<WishEntity, QWishEntity> wishes = this.<WishEntity, QWishEntity>createList("wishes", WishEntity.class, QWishEntity.class, PathInits.DIRECT2);

    public final ListPath<WishEntity, QWishEntity> wishList = this.<WishEntity, QWishEntity>createList("wishList", WishEntity.class, QWishEntity.class, PathInits.DIRECT2);

    public QUserEntity(String variable) {
        this(UserEntity.class, forVariable(variable), INITS);
    }

    public QUserEntity(Path<? extends UserEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUserEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUserEntity(PathMetadata metadata, PathInits inits) {
        this(UserEntity.class, metadata, inits);
    }

    public QUserEntity(Class<? extends UserEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.cancellationPolicy = inits.isInitialized("cancellationPolicy") ? new org.muhan.oasis.stay.entity.QCancellationPolicyEntity(forProperty("cancellationPolicy"), inits.get("cancellationPolicy")) : null;
    }

}

