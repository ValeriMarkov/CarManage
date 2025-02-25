using Microsoft.AspNetCore.Mvc.Filters;

namespace CarManage.Server.Filters
{
    public class AddCorsHeadersFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
        
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            var request = context.HttpContext.Request;
            var response = context.HttpContext.Response;

            var origin = request.Headers["Origin"].ToString();
            if (!string.IsNullOrEmpty(origin))
            {
                response.Headers.Add("Access-Control-Allow-Origin", origin);
            }

            response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
            response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        }
    }
}
