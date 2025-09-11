package org.muhan.oasis.s3.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;

import java.io.IOException;
import java.net.URL;
import java.time.Duration;

@Service
@Log4j2
@RequiredArgsConstructor
public class S3StorageServiceImpl implements S3StorageService {

    private final S3Client s3Client;      // @Bean 등록 필요
    private final S3Presigner s3Presigner;
    @Value("${cloud.aws.s3.bucket}") private String bucket;
    @Value("${cloud.aws.region}") private String region;
    @Value("${cloud.aws.s3.prefix.stay-img}") private String stayImgPath;
    @Value("${cloud.aws.s3.prefix.certificate}") private String certificatePath;
    @Value("${cloud.aws.s3.prefix.profile-img}") private String profileImgPath;
    @Value("${cloud.aws.credentials.access-key}") private String accessKeyId;
    @Value("${cloud.aws.credentials.secret-key}") private String secretAccessKey;

    @Override
    public String upload(MultipartFile file, String key, String contentType) {
        try {
            PutObjectRequest put = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(contentType)
                    .acl(ObjectCannedACL.PUBLIC_READ) // 퍼블릭 접근이 필요할 경우
                    .build();
            s3Client.putObject(put, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // CloudFront를 쓰면 CloudFront URL, 아니면 S3 퍼블릭 URL
            return "https://%s.s3.amazonaws.com/%s".formatted(bucket, key);
        } catch (IOException e) {
            throw new RuntimeException("S3 업로드 실패", e);
        }
    }

    @Override
    public void delete(String key) {
        s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
    }

    @Override
    public URL issuePutUrl(String key, String contentType, Duration ttl) {
        PutObjectRequest put = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .build();

        PresignedPutObjectRequest presigned =
                s3Presigner.presignPutObject(builder ->
                        builder.signatureDuration(ttl).putObjectRequest(put));

        return presigned.url();
    }

    @Override
    public boolean exists(String key) {
        try {
            s3Client.headObject(b -> b.bucket(bucket).key(key));
            return true;
        } catch (Exception e) {
            return false; // 403/404 등 포함
        }
    }

    @Override
    public String toPublicUrl(String key) {
        // region-aware S3 public URL
        return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
    }

}
