//package org.muhan.oasis.external.stripe;
//
//
//import com.stripe.Stripe;
//import jakarta.annotation.PostConstruct;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//@Service
//public class StripeOnrampService {
//
//    @Value("${stripe.secret-key}")
//    private String stripeSecretKey;
//
//    @PostConstruct
//    public void init() {
//        Stripe.apiKey = stripeSecretKey;
//    }
//
//    public CreateOnrampSessionResponse createOnrampSession(
//            CreateOnrampSessionRequest request,
//            String clientIp
//    ) throws Exception {
//
//        OnrampSessionCreateParams params =
//                OnrampSessionCreateParams.builder()
//                        .setCustomerIpAddress(clientIp.replaceAll("^\\[|\\]$", ""))
//                        .setTransactionDetails(
//                                OnrampSessionCreateParams.TransactionDetails.builder()
//                                        .setDestinationCurrency(
//                                                OnrampSessionCreateParams.TransactionDetails.DestinationCurrency
//                                                        .valueOf(request.getTransactionDetails().getDestinationCurrency().toUpperCase())
//                                        )
//                                        .setDestinationExchangeAmount(request.getTransactionDetails().getDestinationExchangeAmount())
//                                        .setDestinationNetwork(
//                                                OnrampSessionCreateParams.TransactionDetails.DestinationNetwork
//                                                        .valueOf(request.getTransactionDetails().getDestinationNetwork().toUpperCase())
//                                        )
//                                        .build()
//                        )
//                        .build();
//
//        OnrampSession session = OnrampSession.create(params);
//        return new CreateOnrampSessionResponse(session.getClientSecret());
//    }
//}
