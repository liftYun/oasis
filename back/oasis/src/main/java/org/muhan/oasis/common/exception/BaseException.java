package org.muhan.oasis.common.exception;

import lombok.Getter;
import org.muhan.oasis.common.base.BaseResponseStatus;

@Getter
public class BaseException extends RuntimeException{

    private final BaseResponseStatus status;

    public BaseException(BaseResponseStatus status) {
        this.status = status;
    }
}