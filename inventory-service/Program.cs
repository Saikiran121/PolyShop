var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var inventory = new Dictionary<string, int>
{
    ["1"] = 100, // Product 1
    ["2"] = 50,  // Product 2
    ["3"] = 20,  // Product 3
};

app.MapGet("/inventory/{productId}", (string productId) =>
{
    if (inventory.TryGetValue(productId, out var stock))
    {
        return Results.Ok(new { ProductId = productId, Stock = stock });
    }
    return Results.NotFound(new { Message = "Product not found" });
});

app.MapPost("/inventory/{productId}", (string productId, int change) =>
{
    if (!inventory.ContainsKey(productId))
    {
        inventory[productId] = 0;
    }
    
    inventory[productId] += change;
    return Results.Ok(new { ProductId = productId, NewStock = inventory[productId] });
});

app.Urls.Add("http://0.0.0.0:8088");

app.Run();
