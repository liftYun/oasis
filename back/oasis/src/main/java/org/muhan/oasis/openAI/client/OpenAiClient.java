package org.muhan.oasis.openAI.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.openAI.domain.OpenAIMessageEntity;
import org.muhan.oasis.openAI.dto.in.*;
import org.muhan.oasis.openAI.dto.out.*;
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

    // ---- Tunables ----
    private static final double TEMP_LOW = 0.1;

    // ---- System Prompts (as constants) ----
    private static final String PROMPT_TRANSLATE_STAY = """
            You are a strict KO↔EN detection and translation engine for a lodging platform.

            Your tasks:
            1) Detect the dominant language of the concatenated input fields (title + content).
            2) Decide whether translation is required per policy.
            3) If required, translate.
            4) Return a SINGLE valid JSON object in the exact schema below—no extra text, no markdown, no comments.

            Policy:
            - detectedLocale: "ko" if Korean is clearly dominant, "en" if English is clearly dominant, otherwise "unknown".
              * Proper nouns, numbers, URLs, and a few foreign words do NOT flip dominance.
            - confidence: a float in [0,1], e.g., 0.92, reflecting your certainty of detectedLocale.
            - Translation rule:
              * If detectedLocale == "ko" → translate to English.
              * If detectedLocale == "en" → translate to Korean.
              * If detectedLocale == "unknown" or any input is empty → do NOT translate.
            - wasTranslated:
              * true only when detectedLocale ∈ {"ko","en"} and you produced the opposite-locale translation.
              * false otherwise.
            - targetLocale:
              * "en" if detectedLocale == "ko"
              * "ko" if detectedLocale == "en"
              * null if detectedLocale == "unknown" or no translation performed.

            Result mapping:
            - If wasTranslated = true:
              * englishVersion.title/content MUST be the English text
                - If source was English, keep the original English (not rephrased).
                - If source was Korean, provide the English translation.
              * koreanVersion.title/content MUST be the Korean text
                - If source was Korean, keep the original Korean (not rephrased).
                - If source was English, provide the Korean translation.
            - If wasTranslated = false:
              * englishVersion.title/content = null
              * koreanVersion.title/content = null

            Quality rules:
            - Preserve meaning, tone, formatting, and line breaks.
            - Keep numbers, prices, dates, units, emojis, and line breaks intact.
            - Do NOT add or remove information. Do NOT summarize. Do NOT localize brand names.
            - Keep punctuation natural for the target language.

            STRICT output contract:
            Return exactly this JSON shape and nothing else, with fields in this order and no trailing commas:
            {
              "detectedLocale": "ko" | "en" | "unknown",
              "confidence": number,
              "wasTranslated": boolean,
              "targetLocale": "ko" | "en" | null,
              "englishVersion": {
                "title": string | null,
                "content": string | null
              },
              "koreanVersion": {
                "title": string | null,
                "content": string | null
              }
            }

            Formatting rules:
            - Output MUST be valid JSON only (no prose, no code fences, no comments).
            - Escape special characters properly; preserve line breaks with "\\n".
            - If any input field is missing, treat it as an empty string; still return the object.
            - When inputs are empty or detectedLocale is "unknown", set wasTranslated=false, targetLocale=null, and both englishVersion/koreanVersion fields to null.
            """;

    private static final String PROMPT_TRANSLATE_REVIEW = """
            You are a strict KO↔EN detection and translation engine for user reviews in a lodging platform.

            Your tasks:
            1) Detect the dominant language of the input "content".
            2) Decide whether translation is required per policy.
            3) If required, translate.
            4) Return a SINGLE valid JSON object in the exact schema below—no extra text, no markdown, no comments.

            Policy:
            - detectedLocale: "ko" if Korean is clearly dominant, "en" if English is clearly dominant, otherwise "unknown".
              * Proper nouns, numbers, URLs, or a few foreign words do NOT flip dominance.
            - confidence: a float in [0,1], e.g., 0.92, reflecting your certainty of detectedLocale.
            - Translation rule:
              * If detectedLocale == "ko" → targetLocale = "en" and produce English translation.
              * If detectedLocale == "en" → targetLocale = "ko" and produce Korean translation.
              * If detectedLocale == "unknown" or input is empty → do NOT translate.
            - wasTranslated:
              * true only when detectedLocale ∈ {"ko","en"} AND you produced the opposite-locale translation.
              * false otherwise.

            Result mapping:
            - If wasTranslated = true:
              * englishVersion.content MUST be English.
                - If source was English, keep the original English (no rephrasing).
                - If source was Korean, provide the English translation.
              * koreanVersion.content MUST be Korean.
                - If source was Korean, keep the original Korean (no rephrasing).
                - If source was English, provide the Korean translation.
            - If wasTranslated = false:
              * englishVersion.content = null
              * koreanVersion.content = null
              * targetLocale = null

            Quality rules:
            - Preserve meaning, tone, formatting, and line breaks.
            - Keep numbers, prices, dates, units, emojis, and line breaks intact.
            - Do NOT add or remove information. Do NOT summarize. Do NOT localize brand names.
            - Keep punctuation natural for the target language.

            STRICT output contract:
            Return exactly this JSON shape and nothing else, with fields in this order and no trailing commas:
            {
              "detectedLocale": "ko" | "en" | "unknown",
              "confidence": number,
              "wasTranslated": boolean,
              "targetLocale": "ko" | "en" | null,
              "englishVersion": {
                "content": string | null
              },
              "koreanVersion": {
                "content": string | null
              }
            }

            Formatting rules:
            - Output MUST be valid JSON only (no prose, no code fences, no comments).
            - Escape special characters properly; preserve line breaks with "\\n".
            - If input is missing or empty, still return the object, set wasTranslated=false, targetLocale=null, and both contents to null.
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

    private static final String PROMPT_TRANSLATE_ADDR = """
            You are a KO↔EN converter for DETAIL ADDRESSES inside a building/complex (e.g., “A동 101호”).\s
            This field is NOT a street/city/zip; it only contains building wing/tower, floor, and unit numbers.
                        
            Your tasks:
            1) Detect the dominant language of the input "detailAddress". ("ko", "en", or "unknown")
            2) If detectedLocale is "ko", produce the EN version. If "en", produce the KO version. If "unknown" or empty, do NOT translate.
            3) Return ONE valid JSON object in the exact schema below—no extra text, no markdown, no comments.
                        
            Mapping rules (KO → EN):
            - “{X}동” → “Bldg {X}” (keep letters/numbers as is; e.g., “101동”→“Bldg 101”, “A동”→“Bldg A”)
            - “{n}층” → “{n}F” (e.g., “3층”→“3F”)
            - “지하{n}층” → “B{n}F” (e.g., “지하1층”→“B1F”)
            - “{n}호”, “호수 {n}” → “Unit {n}” (keep hyphens as is, e.g., “1203-1호”→“Unit 1203-1”)
            - Order and separators: “Bldg …, {Floor if any}, Unit …” with comma+space between segments.
                        
            Mapping rules (EN → KO):
            - “Building”, “Bldg”, “Bldg.” → “{…}동” (keep letters/numbers after it; e.g., “Bldg 3”→“3동”)
            - “{n}F” → “{n}층”; “B{n}F” → “지하{n}층”
            - “Unit {n}”, “Apt {n}”, “Room {n}”, “#{n}” → “{n}호” (strip leading “#”)
            - Order and separators: “{동?} {층?} {호?}” with single spaces (no commas).
                        
            General rules:
            - Preserve all numbers/letters/dashes exactly (e.g., “A-2동”, “1203-1호”).
            - Do NOT add street/city names; do NOT guess missing parts.
            - If only one component is present (e.g., just “A동” or “#804”), translate only that part.
            - If unrecognized tokens appear, leave them as-is but still translate recognized parts.
            - Keep ASCII for EN output; keep standard Korean for KO output.
            - This is NOT a postal address formatter—just component translation + minimal reordering as specified.
                        
            STRICT output contract (field order must match; no trailing commas):
            {
              "detectedLocale": "ko" | "en" | "unknown",
              "confidence": number,
              "wasTranslated": boolean,
              "targetLocale": "ko" | "en" | null,
              "englishVersion": {
                "detailAddress": string | null
              },
              "koreanVersion": {
                "detailAddress": string | null
              }
            }
                        
            Formatting rules:
            - Output MUST be valid JSON only (no prose, no code fences, no comments).
            - Escape special characters properly.
            - If input is empty or detectedLocale is "unknown": set wasTranslated=false, targetLocale=null, and both englishVersion/koreanVersion.detailAddress=null.
                        
            """;

    // ---- Public Facade Methods ----

    public StayTranslationResult translateStay(StayRequestDTO dto) throws JsonProcessingException {
        OpenAiRequest req = buildRequest(PROMPT_TRANSLATE_STAY, dto);
        return sendForSchema(req, StayTranslationResult.class);
    }

    public ReviewTranslationResult translateReview(ReviewRequestDTO dto) throws JsonProcessingException {
        OpenAiRequest req = buildRequest(PROMPT_TRANSLATE_REVIEW, dto);
        return sendForSchema(req, ReviewTranslationResult.class);
    }

    public ReviewSummaryResult summarizeReviews(ReviewListRequestDTO dto) throws JsonProcessingException {
        OpenAiRequest req = buildRequest(PROMPT_SUMMARIZE_REVIEWS, dto);
        return sendForSchema(req, ReviewSummaryResult.class);
    }

    public AddrTranslationResult translateAddr(AddrRequestDTO dto) throws JsonProcessingException {
        OpenAiRequest req = buildRequest(PROMPT_TRANSLATE_ADDR, dto.toString());
        return sendForSchema(req, AddrTranslationResult.class);
    }


    // ---- Private Helpers ----

    /** 공통 OpenAI 요청 생성 */
    private OpenAiRequest buildRequest(String systemPrompt, Object userPayload) {
        OpenAIMessageEntity systemMessage = new OpenAIMessageEntity("system", systemPrompt);
        String userJson = toJson(userPayload);
        OpenAIMessageEntity userMessage   = new OpenAIMessageEntity("user", userJson);
        return new OpenAiRequest(model, java.util.List.of(systemMessage, userMessage));
    }

    private static final ObjectMapper MAPPER = new ObjectMapper()
            .findAndRegisterModules()
            .setSerializationInclusion(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL);

    private String toJson(Object payload) {
        if (payload == null) {
            throw new BaseException(BaseResponseStatus.INVALID_PARAMETER);
        }
        try {
            return MAPPER.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
         }
    }

    /** 공통 POST & 에러 처리 */

    private <T> T sendForSchema(OpenAiRequest request, Class<T> targetType) throws JsonProcessingException {
        ResponseEntity<ChatCompletionResponse> resp =
                restTemplate.postForEntity(apiUrl, request, ChatCompletionResponse.class);

        ChatCompletionResponse body = requireOk(resp);

        var first = (body.getChoices() != null && !body.getChoices().isEmpty())
                ? body.getChoices().get(0) : null;
        String content = (first != null && first.getMessage() != null)
                ? first.getMessage().getContent() : null;
        if (content == null || content.isBlank()) {
            throw new BaseException(BaseResponseStatus.FAIL_OPENAI_COMMUNICATION);
        }

        String json = normalizeContent(content);
        T parsed = MAPPER.readValue(json, targetType);

        return parsed;
    }

    private ChatCompletionResponse requireOk(ResponseEntity<ChatCompletionResponse> resp) {
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
