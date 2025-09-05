package org.muhan.oasis.stay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QFacilityEntity is a Querydsl query type for FacilityEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QFacilityEntity extends EntityPathBase<FacilityEntity> {

    private static final long serialVersionUID = -503226806L;

    public static final QFacilityEntity facilityEntity = new QFacilityEntity("facilityEntity");

    public final EnumPath<org.muhan.oasis.valueobject.Category> category = createEnum("category", org.muhan.oasis.valueobject.Category.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath name = createString("name");

    public final StringPath nameEng = createString("nameEng");

    public QFacilityEntity(String variable) {
        super(FacilityEntity.class, forVariable(variable));
    }

    public QFacilityEntity(Path<? extends FacilityEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QFacilityEntity(PathMetadata metadata) {
        super(FacilityEntity.class, metadata);
    }

}

