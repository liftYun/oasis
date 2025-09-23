package org.muhan.oasis.openAI.service;

import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SseService {
    private final Map<String, SseEmitter> sseEmitterMap = new ConcurrentHashMap<>(); // id별 emitter 보관

    public SseEmitter subscribe(String id) {
        long timeout = 1000L * 60 * 60; // sse emitter 연결 시간, 1시간

        // sseEmitter 저장
        SseEmitter sseEmitter = new SseEmitter(timeout);
        sseEmitterMap.put(id, sseEmitter);

        // sseEmitter complete 처리
        sseEmitter.onCompletion(() -> sseEmitterMap.remove(id));
        // sseEmitter timeout 발생
        sseEmitter.onTimeout(sseEmitter::complete);
        // sseEmitter error 발생
        sseEmitter.onError(throwable -> sseEmitter.complete());

        // connect event로 message 발생
        sendToClient(id, "connect", "sse connect...");
        System.out.println("구독완");
        return sseEmitter;
    }

    /**
     * sse를 통해 client에 데이터를 전달
     * id에 해당되는 sse emitter에 event name의 이벤트로 dto 전달
     */
    public void sendToClient(String id, String eventName, Object data) {
        SseEmitter sseEmitter = sseEmitterMap.get(id);
        try {
            sseEmitter.send(
                    SseEmitter
                            .event()
                            .id(id)
                            .name(eventName)
                            .data(data)
            );
        } catch (IOException e) {
            throw new BaseException(BaseResponseStatus.FAIL_SSE_COMMUNICATION);
        }
    }
}
