package dev.ayushshah.threadverse.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordConstraintValidator.class)
@Target({ ElementType.TYPE })   // Apply on class level
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {
    String message() default "Password is Invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
