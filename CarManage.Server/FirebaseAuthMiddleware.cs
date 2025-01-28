using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace CarManage.Server
{
    public class FirebaseAuthMiddleware
    {
        private readonly RequestDelegate _next;

        public FirebaseAuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            var token = httpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await httpContext.Response.WriteAsync("Unauthorized - No token provided.");
                return;
            }

            try
            {
                var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);

                httpContext.Items["User"] = decodedToken;
            }
            catch (Exception ex)
            {
                httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await httpContext.Response.WriteAsync($"Unauthorized - {ex.Message}");
                return;
            }

            await _next(httpContext);
        }
    }
}
