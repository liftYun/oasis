package org.muhan.oasis.stay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRegionEngEntity is a Querydsl query type for RegionEngEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRegionEngEntity extends EntityPathBase<RegionEngEntity> {

    private static final long serialVersionUID = 1797528681L;

    public static final QRegionEngEntity regionEngEntity = new QRegionEngEntity("regionEngEntity");

    public final StringPath name = createString("name");

    public final ListPath<SubRegionEngEntity, QSubRegionEngEntity> subRegionsEng = this.<SubRegionEngEntity, QSubRegionEngEntity>createList("subRegionsEng", SubRegionEngEntity.class, QSubRegionEngEntity.class, PathInits.DIRECT2);

    public QRegionEngEntity(String variable) {
        super(RegionEngEntity.class, forVariable(variable));
    }

    public QRegionEngEntity(Path<? extends RegionEngEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QRegionEngEntity(PathMetadata metadata) {
        super(RegionEngEntity.class, metadata);
    }

}

