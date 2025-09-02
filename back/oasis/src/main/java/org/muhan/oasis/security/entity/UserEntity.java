package org.muhan.oasis.security.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.muhan.oasis.valueobject.Language;

@Entity
@Getter
@Setter
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true, length = 100)
    private String uuid;
    private String nickname;
    private String userEmail;
    private Language language;
    private String role;

    public UserEntity() {

    }
}
