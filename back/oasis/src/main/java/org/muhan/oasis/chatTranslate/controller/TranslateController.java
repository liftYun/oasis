package org.muhan.oasis.chatTranslate.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.chatTranslate.service.TranslateService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat/translate")
public class TranslateController {
    private final TranslateService service;

    public record TranslateReq(
            @NotBlank String text,
            @Pattern(regexp = "ko|en") String target,
            String source
    ) {}
    public record TranslateRes(String text, String target, String engine) {}

    @PostMapping
    public Mono<TranslateRes> translate(@RequestBody TranslateReq req) {
        return service.translate(req.text(), req.target(), req.source())
                .map(r -> new TranslateRes(r.text(), r.target(), r.engine()));
    }
}
