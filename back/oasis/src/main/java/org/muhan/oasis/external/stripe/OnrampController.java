package org.muhan.oasis.external.stripe;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@RestController
@RequestMapping("/api/onramp")
public class OnrampController {

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    // ✅ 요청 DTO
    public static class CreateOnrampSessionRequest {
        @JsonProperty("transaction_details")
        public TransactionDetails transactionDetails;

        public static class TransactionDetails {
            @JsonProperty("destination_currency")
            public String destinationCurrency;

            @JsonProperty("destination_exchange_amount")
            public Long destinationExchangeAmount;

            @JsonProperty("destination_network")
            public String destinationNetwork;
        }
    }

    // ✅ 응답 DTO
    public static class CreateOnrampSessionResponse {
        public String clientSecret;

        public CreateOnrampSessionResponse(String clientSecret) {
            this.clientSecret = clientSecret;
        }
    }

    @PostMapping("/create-session")
    public ResponseEntity<CreateOnrampSessionResponse> createOnrampSession(
            @RequestBody CreateOnrampSessionRequest postBody,
            @RequestHeader(value = "X-Forwarded-For", required = false) String xForwardedFor,
            @RequestParam(value = "clientIp", required = false) String clientIpFromParam
    ) {
        try {
            // ✅ Client IP 추출
            String clientIp = clientIpFromParam;
            if ((clientIp == null || clientIp.isBlank()) && xForwardedFor != null) {
                clientIp = xForwardedFor.split(",")[0].trim();
            }
            if (clientIp == null || clientIp.isBlank()) clientIp = "0.0.0.0";

            // ✅ Form body 만들기
            StringBuilder body = new StringBuilder();
            appendForm(body, "transaction_details[destination_currency]",
                    postBody.transactionDetails.destinationCurrency.toUpperCase());
            appendForm(body, "transaction_details[destination_exchange_amount]",
                    String.valueOf(postBody.transactionDetails.destinationExchangeAmount));
            appendForm(body, "transaction_details[destination_network]",
                    postBody.transactionDetails.destinationNetwork.toUpperCase());
            appendForm(body, "customer_ip_address", clientIp);

            // ✅ Basic Auth (API key:password)
            String authHeader = "Basic " + Base64.getEncoder()
                    .encodeToString((stripeSecretKey + ":").getBytes(StandardCharsets.UTF_8));

            // ✅ HTTP 요청
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.stripe.com/v1/crypto/onramp/sessions"))
                    .header("Authorization", authHeader)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(body.toString()))
                    .build();

            HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());

            if (resp.statusCode() >= 200 && resp.statusCode() < 300) {
                JsonNode node = mapper.readTree(resp.body());
                String clientSecret = node.path("client_secret").asText(null);
                if (clientSecret == null || clientSecret.isBlank()) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(new CreateOnrampSessionResponse("missing_client_secret"));
                }
                return ResponseEntity.ok(new CreateOnrampSessionResponse(clientSecret));
            } else {
                JsonNode node = mapper.readTree(resp.body());
                String err = node.path("error").path("message").asText(resp.body());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new CreateOnrampSessionResponse("stripe_error: " + err));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CreateOnrampSessionResponse("internal_error: " + e.getMessage()));
        }
    }

    private static void appendForm(StringBuilder sb, String name, String value) {
        if (sb.length() > 0) sb.append("&");
        sb.append(java.net.URLEncoder.encode(name, StandardCharsets.UTF_8))
                .append("=")
                .append(java.net.URLEncoder.encode(value, StandardCharsets.UTF_8));
    }
}
