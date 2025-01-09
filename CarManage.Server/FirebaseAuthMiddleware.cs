using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace CarManage.Server
{
    // Middleware to verify Firebase ID token in the Authorization header
    public class FirebaseAuthMiddleware
    {
        private readonly RequestDelegate _next;

        public FirebaseAuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            // Extract the token from the Authorization header
            var token = httpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                // No token provided
                httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await httpContext.Response.WriteAsync("Unauthorized - No token provided.");
                return;
            }

            try
            {
                // Verify the Firebase ID token
                var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);

                // If token is valid, add the decoded token info to the HttpContext for later use
                httpContext.Items["User"] = decodedToken;
            }
            catch (Exception ex)
            {
                // If token is invalid, send Unauthorized response
                httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await httpContext.Response.WriteAsync($"Unauthorized - {ex.Message}");
                return;
            }

            // Continue the request pipeline
            await _next(httpContext);
        }
    }
}
