package org.muhan.oasis.stay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStayEntity is a Querydsl query type for StayEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStayEntity extends EntityPathBase<StayEntity> {

    private static final long serialVersionUID = -1430231168L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStayEntity stayEntity = new QStayEntity("stayEntity");

    public final StringPath addressLine = createString("addressLine");

    public final StringPath addressLineEng = createString("addressLineEng");

    public final QCancellationPolicyEntity cancellationPolicyEntity;

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final StringPath description = createString("description");

    public final StringPath descriptionEng = createString("descriptionEng");

    public final QDeviceEntity device;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> maxGuests = createNumber("maxGuests", Integer.class);

    public final StringPath postalCode = createString("postalCode");

    public final NumberPath<Integer> price = createNumber("price", Integer.class);

    public final QStayRatingSummaryEntity ratingSummary;

    public final ListPath<StayFacilityEntity, QStayFacilityEntity> stayFacilities = this.<StayFacilityEntity, QStayFacilityEntity>createList("stayFacilities", StayFacilityEntity.class, QStayFacilityEntity.class, PathInits.DIRECT2);

    public final ListPath<StayPhotoEntity, QStayPhotoEntity> stayPhotoEntities = this.<StayPhotoEntity, QStayPhotoEntity>createList("stayPhotoEntities", StayPhotoEntity.class, QStayPhotoEntity.class, PathInits.DIRECT2);

    public final QSubRegionEngEntity subRegionEngEntity;

    public final QSubRegionEntity subRegionEntity;

    public final StringPath thumbnail = createString("thumbnail");

    public final StringPath title = createString("title");

    public final StringPath titleEng = createString("titleEng");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final org.muhan.oasis.user.entity.QUserEntity user;

    public QStayEntity(String variable) {
        this(StayEntity.class, forVariable(variable), INITS);
    }

    public QStayEntity(Path<? extends StayEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStayEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStayEntity(PathMetadata metadata, PathInits inits) {
        this(StayEntity.class, metadata, inits);
    }

    public QStayEntity(Class<? extends StayEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.cancellationPolicyEntity = inits.isInitialized("cancellationPolicyEntity") ? new QCancellationPolicyEntity(forProperty("cancellationPolicyEntity"), inits.get("cancellationPolicyEntity")) : null;
        this.device = inits.isInitialized("device") ? new QDeviceEntity(forProperty("device"), inits.get("device")) : null;
        this.ratingSummary = inits.isInitialized("ratingSummary") ? new QStayRatingSummaryEntity(forProperty("ratingSummary"), inits.get("ratingSummary")) : null;
        this.subRegionEngEntity = inits.isInitialized("subRegionEngEntity") ? new QSubRegionEngEntity(forProperty("subRegionEngEntity"), inits.get("subRegionEngEntity")) : null;
        this.subRegionEntity = inits.isInitialized("subRegionEntity") ? new QSubRegionEntity(forProperty("subRegionEntity"), inits.get("subRegionEntity")) : null;
        this.user = inits.isInitialized("user") ? new org.muhan.oasis.user.entity.QUserEntity(forProperty("user"), inits.get("user")) : null;
    }

}

