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
        String password = registerRequest.getPassword();

        if(
            password.contains(registerRequest.getDisplayName()) || 
            password.contains(registerRequest.getFirstName()) ||
            password.contains(registerRequest.getLastName()) ||
            password.contains(registerRequest.getEmail())
        ) {
            return false;
        }
        return true;
    }
}
