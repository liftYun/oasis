package org.muhan.oasis.openAI.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.openAI.client.OpenAiClient;
import org.muhan.oasis.openAI.dto.in.AddrRequestDTO;
import org.muhan.oasis.openAI.dto.in.ReviewListRequestDTO;
import org.muhan.oasis.openAI.dto.in.ReviewRequestDTO;
import org.muhan.oasis.openAI.dto.in.StayRequestDTO;
import org.muhan.oasis.openAI.dto.out.AddrTranslationResult;
import org.muhan.oasis.openAI.dto.out.ReviewSummaryResult;
import org.muhan.oasis.openAI.dto.out.ReviewTranslationResult;
import org.muhan.oasis.openAI.dto.out.StayTranslationResult;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OpenAIService {

    private final OpenAiClient openAiClient;

    public StayTranslationResult getTranslatedStay(StayRequestDTO stayDTO) {
        try {
            return openAiClient.translateStay(stayDTO);

        } catch (JsonProcessingException e) {
            throw new BaseException(BaseResponseStatus.OPENAI_INVALID_RESPONSE);
        }
    }

    public ReviewTranslationResult getTranslatedReview(ReviewRequestDTO reviewDTO) {
        try {
            return openAiClient.translateReview(reviewDTO);

        } catch (JsonProcessingException e) {
            throw new BaseException(BaseResponseStatus.OPENAI_INVALID_RESPONSE);
        }
    }

    public ReviewSummaryResult getSummarizedReview(ReviewListRequestDTO reviewListDTO) {
        try {
            return openAiClient.summarizeReviews(reviewListDTO);

        } catch (JsonProcessingException e) {
            throw new BaseException(BaseResponseStatus.OPENAI_INVALID_RESPONSE);
        }
    }

    public AddrTranslationResult getTranslatedAddr(AddrRequestDTO addrDTO) {
        try {
            return openAiClient.translateAddr(addrDTO);

        } catch (JsonProcessingException e) {
            throw new BaseException(BaseResponseStatus.OPENAI_INVALID_RESPONSE);
        }
    }

}
