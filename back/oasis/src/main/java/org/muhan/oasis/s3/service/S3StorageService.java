package org.muhan.oasis.s3.service;

import org.springframework.web.multipart.MultipartFile;

import java.net.URL;
import java.time.Duration;

public interface S3StorageService {
    String upload(MultipartFile file, String key, String contentType);
    void delete(String key);

    URL issuePutUrl(String key, String contentType, Duration ttl);

    // s3에 업로드 되었는지 확인
    boolean exists(String key);
    // S3 도메인으로 URL 생성
    String toPublicUrl(String key);
}
