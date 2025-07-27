package dev.ayushshah.threadverse.validation;

import dev.ayushshah.threadverse.dto.RegisterRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordConstraintValidator implements ConstraintValidator<ValidPassword, RegisterRequest> {

    @Override
    public void initialize(ValidPassword constraintAnnotation) {

    }

    @Override
    public boolean isValid(RegisterRequest registerRequest, ConstraintValidatorContext context) {
        String password = registerRequest.password();

        if(
            password.contains(registerRequest.displayName()) || 
            password.contains(registerRequest.firstName()) ||
            password.contains(registerRequest.lastName()) ||
            password.contains(registerRequest.email())
        ) {
            return false;
        }
        return true;
    }
}
