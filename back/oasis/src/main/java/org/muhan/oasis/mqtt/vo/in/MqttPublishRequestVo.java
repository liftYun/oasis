// src/main/java/org/muhan/oasis/key/vo/in/MqttPublishRequestVo.java
package org.muhan.oasis.mqtt.vo.in;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class MqttPublishRequestVo {
    @Schema(example = "cmd/device-001/open", description = "발행할 MQTT 토픽")
    private String topic;

    @Schema(example = "{\"commandId\":\"c-123\",\"keyId\":1001}", description = "JSON 문자열 또는 일반 텍스트")
    private String payload;

    @Schema(example = "1", description = "QoS(0|1|2). 기본 1")
    private Integer qos;

    @Schema(example = "false", description = "retain 플래그")
    private Boolean retain;
}
