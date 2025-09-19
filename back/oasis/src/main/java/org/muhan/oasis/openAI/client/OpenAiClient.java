package org.muhan.oasis.openAI.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.openAI.domain.OpenAIMessageEntity;
import org.muhan.oasis.openAI.dto.in.*;
import org.muhan.oasis.openAI.dto.out.*;
import org.muhan.oasis.valueobject.Language;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
@RequiredArgsConstructor
public class OpenAiClient {

    private final RestTemplate restTemplate;

    @Value("${openai.chat-url}")
    private String apiUrl;

    @Value("${openai.chat-model}")
    private String model;

    // ---- System Prompts (as constants) ----
    private static final String PROMPT_TRANSLATE_STAY_TO_ENG = """
            You are a KO→EN translator for a lodging platform.

            Translate the following input fields to English and return ONE valid JSON object only (no extra text, no code fences, no comments). Do not perform language detection.

            Return exactly these four keys (never omit keys; for missing/null inputs return an empty string ""):
            {
              "detailAddress": string, // English (building/wing/floor/unit only)
              "title": string,         // English
              "content": string,       // English
              "address": string        // English (street/city/province/ZIP if provided)
            }

            General rules (title/content/address):
            - Preserve meaning, tone, formatting, and line breaks (use "\\n").
            - Keep numbers, prices, dates, units, emojis, and URLs as-is.
            - Do not add or remove information. Do not summarize. Do not localize brand names.
            - If an input field is missing or null, output "" for that field.

            detailAddress rules (component conversion ONLY; NOT postal formatting):
            - Input contains ONLY internal components: building wing/tower, floor, unit (e.g., "A동 101호").
            - “{X}동” → “Bldg {X}”  (e.g., “101동”→“Bldg 101”, “A동”→“Bldg A”)
            - “{n}층” → “{n}F”;  “지하{n}층” → “B{n}F”
            - “{n}호”, “호수 {n}” → “Unit {n}” (preserve hyphens: “1203-1호”→“Unit 1203-1”)
            - Segment order & separators: “Bldg …, {Floor if any}, Unit …” with comma+space.
            - Preserve all numbers/letters/dashes exactly (e.g., “A-2동”, “1203-1호”).
            - If only one component exists (e.g., “A동” or “#804”), convert only that part.
            - If an unrecognized token appears, keep it as-is and still convert recognized parts.
            - ASCII for EN output. Do NOT add street/city/zip. This is NOT postal formatting.

            address notes:
            - Treat as general address text (street/neighborhood/city/province/ZIP if present).
            - Translate/romanize naturally (e.g., “강남구”→“Gangnam-gu”, “종로구”→“Jongno-gu”, “-로”→“-ro”, “-길”→“-gil”), but do not invent or reorder components beyond natural English phrasing.
            - Do NOT merge detailAddress into address and do NOT fabricate postal codes.
            - If address is missing/null, output "".

            Output constraints:
            - Output JSON only, with the four keys in this order.
            - Escape special characters properly; preserve line breaks with "\\\\n".
                                                         
           """;

    private static final String PROMPT_TRANSLATE_STAY_TO_KOR = """
            You are an EN→KO translator for a lodging platform.

            Translate the following input fields to Korean and return ONE valid JSON object only (no extra text, no code fences, no comments). Do not perform language detection.

            Return exactly these four keys (never omit keys; for missing/null inputs return an empty string "") in this order:
            {
              "detailAddress": string, // Korean (building/wing/floor/unit only)
              "title": string,         // Korean
              "content": string,       // Korean
              "address": string        // Korean (street/city/province/ZIP if provided)
            }

            General rules (title/content/address):
            - Preserve meaning, tone, formatting, and line breaks (use "\\n").
            - Keep numbers, prices, dates, units, emojis, and URLs as-is.
            - Do not add or remove information. Do not summarize.
            - If an input field is missing or null, output "" for that field.

            detailAddress rules (component conversion ONLY; NOT postal formatting):
            - The field contains ONLY internal components: building wing/tower, floor, unit (e.g., "Bldg A, 3F, Unit 101").
            - "Building", "Bldg", "Bldg." → "{…}동"  (e.g., "Bldg 3" → "3동", "Building A-2" → "A-2동")
            - "{n}F" → "{n}층";  "B{n}F" → "지하{n}층"
            - "Unit {n}", "Apt {n}", "Room {n}", "#{n}" → "{n}호" (drop leading "#")
            - Output order & separators: "{동?} {층?} {호?}" with single spaces, no commas.
            - Preserve all numbers/letters/dashes exactly (e.g., "A-2", "1203-1").
            - If only one component exists (e.g., "Unit 804" or "B2F"), convert only that part.
            - Do NOT add street/city/zip. This is NOT postal formatting.

            address notes:
            - Treat as general address text. If it is a romanized Korean address, naturalize to Korean script:
              - "Gangnam-gu" → "강남구", "Jongno-gu" → "종로구", "-ro" → "로", "-gil" → "길", "dong" (neighborhood) → "동".
            - Keep non-Korean proper nouns as-is (e.g., “Netflix”, “Times Square”).
            - Do NOT merge detailAddress into address and do NOT fabricate postal codes.
            - If address is missing/null, output "".

            Output constraints:
            - Output JSON only, with the four keys in this order.
            - Escape special characters properly; preserve line breaks with "\\\\n".
                                                                                                   
           """;

    private static final String PROMPT_TRANSLATE_REVIEW_TO_ENG = """
            You are a KO→EN translator for user reviews in a lodging platform.
                        
            Translate the input field "content" from Korean to English.
            Return ONE valid JSON object only:
                        
            {
              "content": string  // English
            }
                        
            Rules:
            - Do NOT perform language detection.
            - Preserve meaning, tone, formatting, and line breaks.
            - Keep numbers, prices, dates, units, emojis, and URLs as-is.
            - Do not add or remove information. Do not summarize.
            - If the input is missing or empty, return {"content": ""}.
            - Output JSON only (no code fences, no comments).
                        
            """;

    private static final String PROMPT_TRANSLATE_REVIEW_TO_KOR = """
            You are an EN→KO translator for user reviews in a lodging platform.
                        
            Translate the input field "content" from English to Korean.
            Return ONE valid JSON object only:
                        
            {
              "content": string  // Korean
            }
                        
            Rules:
            - Do NOT perform language detection.
            - Preserve meaning, tone, formatting, and line breaks.
            - Keep numbers, prices, dates, units, emojis, URLs as-is.
            - Do not add or remove information. Do not summarize.
            - If the input is missing or empty, return {"content": ""}.
            - Output JSON only (no code fences, no comments).

            """;

    private static final String PROMPT_SUMMARIZE_REVIEWS = """
            You are a KO↔EN review summarization engine for a lodging platform.

            Your tasks:
            1) Input: a list of review objects with "content" (Korean and/or English; some items may be translations of others).
            2) Language detect each item and deduplicate translation pairs:
               - Treat two items as duplicates if they convey the same meaning across languages; keep the richer/more detailed one as canonical.
               - Do not count duplicates toward the summary more than once.
            3) Summarize the unique set of reviews into two outputs:
               - englishVersion.summary: concise, neutral, 3–5 sentences.
               - englishVersion.bullets: 3–7 short bullet points capturing key themes (mix of positives/negatives if present).
               - koreanVersion.summary: concise, neutral, 3–5 sentences.
               - koreanVersion.bullets: 3–7 short bullet points capturing key themes.
            4) Return ONE valid JSON object in the exact schema below—no extra text, no markdown, no comments.

            Quality rules:
            - Be factual; do not invent details not present in the reviews.
            - Preserve concrete facts (numbers, prices, dates, locations, amenities, times).
            - Merge synonymous points; avoid repetition.
            - If sentiment is mixed, reflect that balance.
            - Avoid marketing language and emojis.
            - Keep terminology consistent across both languages (translate faithfully, not loosely).

            Deduplication rules:
            - Prefer the longer/more specific text when choosing a canonical item among a translation pair.
            - Ignore minor wording differences typical of machine translation.
            - If no clear duplicate, keep both.

            STRICT output contract (fields must appear in this order, no trailing commas):
            {
              "inputCounts": {
                "total": number,
                "unique": number,
                "ko": number,
                "en": number
              },
              "wasDeduplicated": boolean,
              "englishVersion": {
                "summary": string,
                "bullets": string[]
              },
              "koreanVersion": {
                "summary": string,
                "bullets": string[]
              }
            }

            Formatting rules:
            - Output MUST be valid JSON only (no prose, no code fences, no comments).
            - Escape special characters properly; preserve line breaks with "\\n" if they appear in bullets.
            - If the input array is empty, set all counts to 0, wasDeduplicated=false, and return empty strings for both summaries and empty arrays for bullets.
            """;


    public StayTranslationResultDto translateStay(StayRequestDto dto) throws JsonProcessingException {
        String prompt = null;
        if(dto.getLanguage().equals(Language.KOR)) prompt = PROMPT_TRANSLATE_STAY_TO_ENG;
        else prompt = PROMPT_TRANSLATE_STAY_TO_KOR;

        OpenAiRequestDto req = buildRequest(prompt, dto);
        return sendForSchema(req, StayTranslationResultDto.class);
    }

    public ReviewTranslationResultDto translateReview(ReviewRequestDto dto) throws JsonProcessingException {
        String prompt = null;
        if(dto.getLanguage().equals(Language.KOR)) prompt = PROMPT_TRANSLATE_REVIEW_TO_ENG;
        else prompt = PROMPT_TRANSLATE_REVIEW_TO_KOR;

        OpenAiRequestDto req = buildRequest(prompt, dto);
        return sendForSchema(req, ReviewTranslationResultDto.class);
    }

    public ReviewSummaryResultDto summarizeReviews(ReviewListRequestDto dto) throws JsonProcessingException {
        OpenAiRequestDto req = buildRequest(PROMPT_SUMMARIZE_REVIEWS, dto);
        return sendForSchema(req, ReviewSummaryResultDto.class);
    }

    // ---- Private Helpers ----

    /** 공통 OpenAI 요청 생성 */
    private OpenAiRequestDto buildRequest(String systemPrompt, Object userPayload) {
        OpenAIMessageEntity systemMessage = new OpenAIMessageEntity("system", systemPrompt);
        String userJson = toJson(userPayload);
        OpenAIMessageEntity userMessage   = new OpenAIMessageEntity("user", userJson);
        return new OpenAiRequestDto(model, java.util.List.of(systemMessage, userMessage));
    }

    private String toJson(Object payload) {
        try {
            return MAPPER.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
        }
    }

    /** 공통 POST & 에러 처리 */
    private final ObjectMapper MAPPER = new ObjectMapper();

    private <T> T sendForSchema(OpenAiRequestDto request, Class<T> targetType) throws JsonProcessingException {
        ResponseEntity<ChatCompletionResponseDto> resp =
                restTemplate.postForEntity(apiUrl, request, ChatCompletionResponseDto.class);

        ChatCompletionResponseDto body = requireOk(resp);

        var first = (body.getChoices() != null && !body.getChoices().isEmpty())
                ? body.getChoices().get(0) : null;
        String content = (first != null && first.getMessage() != null)
                ? first.getMessage().getContent() : null;
        if (content == null || content.isBlank()) {
            throw new BaseException(BaseResponseStatus.OPENAI_INVALID_RESPONSE);
        }

        String json = normalizeContent(content);
        T parsed = MAPPER.readValue(json, targetType);

        return parsed;
    }

    private ChatCompletionResponseDto requireOk(ResponseEntity<ChatCompletionResponseDto> resp) {
        if (!resp.getStatusCode().is2xxSuccessful() || resp.getBody() == null) {
            throw new BaseException(BaseResponseStatus.FAIL_OPENAI_COMMUNICATION);
        }
        return resp.getBody();
    }

    private String normalizeContent(String s) {
        String t = s.trim();
        if (t.startsWith("```")) {
            int i = t.indexOf('{'); int j = t.lastIndexOf('}');
            if (i >= 0 && j > i) return t.substring(i, j + 1).trim();
        }
        return t;
    }
}
