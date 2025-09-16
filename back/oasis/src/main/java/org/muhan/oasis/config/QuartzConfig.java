package org.muhan.oasis.config;

import org.muhan.oasis.settlement.SettlementJob;
import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail settlementJobDetail() {
        return JobBuilder.newJob(SettlementJob.class)
                .withIdentity("settlementJob")
                .storeDurably()
                .build();
    }

    //매일 오전 10시 1회 실행
    @Bean
    public Trigger settlementJobTrigger(JobDetail settlementJobDetail) {
        return TriggerBuilder.newTrigger()
                .forJob(settlementJobDetail)
                .withIdentity("settlementTrigger")
//                .withSchedule(
//                        CronScheduleBuilder.dailyAtHourAndMinute(10, 0)
//                                .inTimeZone(java.util.TimeZone.getTimeZone("Asia/Seoul"))
//                )
                .withSchedule(
                        SimpleScheduleBuilder.simpleSchedule()
                                .withIntervalInMinutes(5) // 5분마다 실행
                                .repeatForever()
                )
                .build();
    }
}
