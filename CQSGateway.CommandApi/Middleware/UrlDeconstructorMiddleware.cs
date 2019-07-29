using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CQSGateway.CommandApi.Middleware
{
    public class UrlDeconstructorMiddleware
    {
        private readonly RequestDelegate _next;
        private const char URI_SEPARATOR = '/';
        private const char PARAMETER_SEPARATOR = ':';
        private const string URI_PREFIX = "/api/";

        public UrlDeconstructorMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                var path = context.Request.Path.ToUriComponent();
                var partCount = GetPartCount(path);
                if (partCount == 0)
                {
                    throw new FormatException();
                }

                var deconstructedPath = HttpMethods.IsPost(context.Request.Method) ? DeconstructPostUri(path, partCount) : DeconstructUri(path, partCount);
                context.Request.Path = deconstructedPath;
                //Let the next middleware (MVC routing) handle the request
                //In case the path was updated, the MVC routing will see the updated path
                await _next.Invoke(context);
            }
            catch (FormatException)
            {
                await NotFound(context);
            }
            catch
            {
                await Error(context);
            }
        }

        private async Task NotFound(HttpContext context)
        {
            context.Response.StatusCode = 404; //NotFound
            await context.Response.WriteAsync("Not Found");
        }

        private async Task Error(HttpContext context)
        {
            context.Response.StatusCode = 500; //InternalServerError
            await context.Response.WriteAsync("Internal Server Error");
        }

        private string DeconstructPostUri(string uri, int partCount)
        {
            if(partCount > 1)
            {
                // this is a child entity
                if((partCount % 2) == 0)
                {
                    throw new FormatException();
                }
                return Deconstruct(uri);
            }
            else
            {
                return uri;
            }
        }

        private string DeconstructUri(string uri, int partCount)
        {
            if ((partCount % 2) != 0)
            {
                throw new FormatException();
            }
            if (partCount == 2)
            {
                return uri;
            }
            else
            {
                // this is a child entity
                return Deconstruct(uri);
            }
        }

        private string Deconstruct(string uri)
        {
            List<string> entityTypes = new List<string>();
            List<string> ids = new List<string>();
            var parts = GetParts(uri);
            for(int i = 0; i < parts.Length; i++)
            {
                if((i % 2) == 0)
                {
                    entityTypes.Add(parts[i]);
                }
                else
                {
                    ids.Add(parts[i]);
                }
            }
            return $"{URI_PREFIX}{BuildParameter(entityTypes)}/{BuildParameter(ids)}";
        }

        private string BuildParameter(List<string> parts)
        {
            return String.Join(PARAMETER_SEPARATOR, parts);
        }

        private int GetPartCount(string uri)
        {
            return uri.Count(c => c == URI_SEPARATOR) - 1;
        }

        private string[] GetParts(string uri)
        {
            return uri.Substring(URI_PREFIX.Length).Split(URI_SEPARATOR);
        }
    }
}
