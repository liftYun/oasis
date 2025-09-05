package org.muhan.oasis.stay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCancellationPolicyEntity is a Querydsl query type for CancellationPolicyEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCancellationPolicyEntity extends EntityPathBase<CancellationPolicyEntity> {

    private static final long serialVersionUID = -1988128452L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QCancellationPolicyEntity cancellationPolicyEntity = new QCancellationPolicyEntity("cancellationPolicyEntity");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> policy1 = createNumber("policy1", Integer.class);

    public final NumberPath<Integer> policy2 = createNumber("policy2", Integer.class);

    public final NumberPath<Integer> policy3 = createNumber("policy3", Integer.class);

    public final org.muhan.oasis.user.entity.QUserEntity user;

    public QCancellationPolicyEntity(String variable) {
        this(CancellationPolicyEntity.class, forVariable(variable), INITS);
    }

    public QCancellationPolicyEntity(Path<? extends CancellationPolicyEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QCancellationPolicyEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QCancellationPolicyEntity(PathMetadata metadata, PathInits inits) {
        this(CancellationPolicyEntity.class, metadata, inits);
    }

    public QCancellationPolicyEntity(Class<? extends CancellationPolicyEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new org.muhan.oasis.user.entity.QUserEntity(forProperty("user"), inits.get("user")) : null;
    }

}

