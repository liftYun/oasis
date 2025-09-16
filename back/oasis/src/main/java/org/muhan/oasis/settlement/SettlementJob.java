package org.muhan.oasis.settlement;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.settlement.service.SettlementService;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SettlementJob implements Job {

    private final SettlementService settlementService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        log.info("[Quartz] Settlement job started...");
        try {
            settlementService.processSettlement();
            log.info("[Quartz] Settlement job finished successfully");
        } catch (Exception e) {
            log.error("[Quartz] Settlement job failed", e);
            throw new JobExecutionException(e);
        }
    }
}
