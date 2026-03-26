using FluentValidation;
using QBSync.Application.DTOs.Auth;

namespace QBSync.Application.Validators;

public class RegisterValidator : AbstractValidator<RegisterDto>
{
    public RegisterValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100).WithMessage("First name must be non empty.");
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100).WithMessage("Last name must be non empty.");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Email must be valid.");
        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .WithMessage("Password must be at least 8 characters.");
    }
}