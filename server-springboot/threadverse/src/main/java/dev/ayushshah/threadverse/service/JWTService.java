package dev.ayushshah.threadverse.service;

import java.util.Date;
import java.util.Optional;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.auth0.jwt.interfaces.DecodedJWT;


import dev.ayushshah.threadverse.dto.UserDTO;

public class JWTService {
    private static final String secret = System.getenv("JWT_SECRET");
    private static final Algorithm algorithm = Algorithm.HMAC256(secret);
    private static final JWTVerifier verifier = JWT.require(algorithm).withIssuer("auth0").build();


    public static Optional<String> createToken(UserDTO user){
        try{
            String token = JWT.create()
            .withIssuer("auth0")
            .withSubject(user.getId())
            .withIssuedAt(new Date())
            .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
            .sign(algorithm);

            return Optional.of(token);
        }
        catch (JWTCreationException e){
            return Optional.empty();
        }
    }

    public static Optional<String> verifyToken(String token){
        try{
            DecodedJWT jwt = verifier.verify(token);
            return Optional.of(jwt.getSubject()); // _id
        }
        catch(JWTVerificationException e){
            return Optional.empty();
        }
    }
    
}
