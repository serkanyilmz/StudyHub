package com.dropdatabase.studyhub.auth.infra.out.jpa.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "token_blacklist")
public class TokenBlacklistJpaEntity {

    @Id
    private String jti; // Token'ın ID'si (JWT'nin jti claim'i)

    @Column(name = "expiry_date", nullable = false)
    private Date expiryDate;


}
