using CQSGateway.CommandApi.Application.Models;
using CQSGateway.CommandApi.Application.Services;
using CQSGateway.CommandApi.Application.Services.Abstract;
using CQSGateway.CommandApi.Domain;
using CQSGateway.CommandApi.Domain.Abstractions.Repositories;
using CQSGateway.CommandApi.Domain.Clients.Entities;
using CQSGateway.CommandApi.Infrastructure.Extensions;
using CQSGateway.CommandApi.Infrastructure.Repositories;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson.Serialization.Conventions;
using System.Reflection;

namespace CQSGateway.CommandApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.Configure<AppSettings>(Configuration);

            services.AddMongoClient(Configuration);
            services.AddSingleton<IEntityService, EntityService>();
            services.AddSingleton<EntityResolver>();
            services.AddSingleton<IRepository<Client>, Repository<Client>>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseMvc();

            // register MongoDB camel case serialization
            var convention = new ConventionPack
            {
                new CamelCaseElementNameConvention()
            };
            ConventionRegistry.Register("camelCase", convention, t => true);
        }
    }
}
