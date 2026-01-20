use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct ShippingRequest {
    order_id: String,
    address: String,
    items: i32,
}

#[derive(Serialize)]
struct ShippingResponse {
    order_id: String,
    cost: f64,
    estimated_days: i32,
}

#[post("/shipping/calculate")]
async fn calculate_shipping(req: web::Json<ShippingRequest>) -> impl Responder {
    let base_cost = 5.0;
    let item_cost = req.items as f64 * 1.5;
    let total_cost = base_cost + item_cost;

    let response = ShippingResponse {
        order_id: req.order_id.clone(),
        cost: total_cost,
        estimated_days: 3,
    };

    HttpResponse::Ok().json(response)
}

#[get("/health")]
async fn health_check() -> impl Responder {
    HttpResponse::Ok().body("Shipping Service is healthy")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    println!("Shipping Service running on port 8086");
    
    HttpServer::new(|| {
        App::new()
            .service(calculate_shipping)
            .service(health_check)
    })
    .bind(("0.0.0.0", 8086))?
    .run()
    .await
}
