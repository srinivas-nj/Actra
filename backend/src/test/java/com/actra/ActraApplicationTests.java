package com.actra;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "jwt.secret=test-only-jwt-secret-that-is-at-least-32-bytes-long")
class ActraApplicationTests {

    @Test
    void contextLoads() {
    }
}
