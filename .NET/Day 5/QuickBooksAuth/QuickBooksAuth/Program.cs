using Microsoft.OpenApi.Models;
using QuickBooksAuth.Data;
using QuickBooksAuth.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddNewtonsoftJson();

builder.Services.AddSingleton<MongoDbContext>();

builder.Services.AddScoped<IQuickBooksService, QuickBooksService>();

builder.Services.AddScoped<QboService>();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(10);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "QuickBooks Auth + CRUD API",
        Version = "v1",
        Description = "OAuth 2.0 + OIDC + Full CRUD for QuickBooks Online entities"
    });

    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath)) c.IncludeXmlComments(xmlPath);
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "QuickBooks API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowFrontend");
app.UseSession();
app.UseAuthorization();
app.MapControllers();
app.Run();