package org.muhan.oasis.openAI.controller;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.openAI.dto.out.SseSendRequestDto;
import org.muhan.oasis.openAI.service.SseService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.http.MediaType;

@RestController
@RequiredArgsConstructor
public class SseController {

    private final SseService sseService;

    @GetMapping(value = "/sse/connect/{nickname}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter connect(@PathVariable String nickname) {
        return sseService.subscribe(nickname);
    }

}