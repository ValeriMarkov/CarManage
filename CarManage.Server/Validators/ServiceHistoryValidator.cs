using FluentValidation;

namespace CarManage.Server.Validators
{
    public class ServiceHistoryValidator : AbstractValidator<ServiceHistory>
    {
        public ServiceHistoryValidator()
        {
            RuleFor(x => x.CarId).NotNull().WithMessage("CarId is required");
        }
    }
}