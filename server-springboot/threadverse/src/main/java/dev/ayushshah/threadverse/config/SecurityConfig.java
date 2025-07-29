package dev.ayushshah.threadverse.config;

import org.springframework.boot.autoconfigure.graphql.GraphQlProperties.Http;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JWTAuthFilter jwtAuthFilter;

    public SecurityConfig(JWTAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/users", "/users/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/users", "/users/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/users", "/users/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/posts", "/posts/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/posts", "/posts/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/posts", "/posts/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/communities", "/communities/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/communities", "/communities/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/communities", "/communities/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/comments", "/comments/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/comments", "/comments/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/comments", "/comments/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/vote", "/vote/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/vote", "/vote/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/linkflairs", "/linkflairs/**").permitAll()

                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // BCrypt Implements PasswordEncoder
    }
}
