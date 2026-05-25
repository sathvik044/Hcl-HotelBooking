package com.example.hotelbooking.dto.email;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailDTO {
    private String to;
    private String subject;
    private String body;
}
