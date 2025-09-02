package org.muhan.oasis.security.vo.out;

import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserDetailResponseVo {
    private int id;
    private String username;
    private String role;
}
