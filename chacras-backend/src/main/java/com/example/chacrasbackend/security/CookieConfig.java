package com.example.chacrasbackend.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

@Configuration
public class CookieConfig {

    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();

        // ⚙️ Permitir cookies cross-site sin HTTPS (solo para localhost)
        serializer.setSameSite("None");
        serializer.setUseSecureCookie(false);

        serializer.setCookiePath("/");
        serializer.setCookieName("JSESSIONID");
        return serializer;
    }
}

