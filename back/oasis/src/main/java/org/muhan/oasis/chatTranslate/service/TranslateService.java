package org.muhan.oasis.chatTranslate.service;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.chatTranslate.util.PapagoClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class TranslateService {
    private final PapagoClient papago;

    public record Result(String text, String target, String engine) {}

    public Mono<Result> translate(String text, String target, String sourceOpt) {

        String source = (sourceOpt == null || sourceOpt.isBlank()) ? "auto" : sourceOpt;

        return papago.translate(source, target, text)
                .map(resp -> resp.message().result().translatedText())
                .map(out -> new Result(out, target, "papago:"+source));
    }
}
