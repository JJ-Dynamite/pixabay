use axum::{
    routing::get,
    Router, Json, response::IntoResponse,
};
use tower_http::cors::{CorsLayer, Any};
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct HealthResponse { status: String, service: String, version: String }
#[derive(Serialize)]
struct RootResponse { service: String, version: String, description: String, endpoints: Vec<String> }
#[derive(Serialize)]
struct MediaItem { id: String, title: String, thumbnail: String, url: String, media_type: String, tags: Vec<String> }
#[derive(Serialize)]
struct SearchResponse { query: String, total: usize, items: Vec<MediaItem> }

async fn health() -> impl IntoResponse {
    Json(HealthResponse { status: "healthy".into(), service: "pixabay".into(), version: "0.1.0".into() })
}

async fn root() -> impl IntoResponse {
    Json(RootResponse {
        service: "pixabay".into(), version: "0.1.0".into(),
        description: "Free stock photos, video, music".into(),
        endpoints: vec!["GET /health".into(), "GET /search?q=&type=photo|video|music".into()],
    })
}

async fn search_media(axum::extract::Query(params): axum::extract::Query<std::collections::HashMap<String, String>>) -> impl IntoResponse {
    let query = params.get("q").unwrap_or(&"nature".to_string()).clone();
    let media_type = params.get("type").unwrap_or(&"photo".to_string()).clone();
    let items = vec![
        MediaItem { id: "1".into(), title: "Mountain Landscape".into(), thumbnail: "/thumb/1.jpg".into(), url: "/photo/1.jpg".into(), media_type: media_type.clone(), tags: vec!["mountain".into(), "nature".into()] },
        MediaItem { id: "2".into(), title: "Ocean Sunset".into(), thumbnail: "/thumb/2.jpg".into(), url: "/photo/2.jpg".into(), media_type: media_type.clone(), tags: vec!["ocean".into(), "sunset".into()] },
        MediaItem { id: "3".into(), title: "Forest Path".into(), thumbnail: "/thumb/3.jpg".into(), url: "/photo/3.jpg".into(), media_type: media_type.clone(), tags: vec!["forest".into(), "path".into()] },
    ];
    Json(SearchResponse { query, total: items.len(), items })
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let cors = CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any);
    let app = Router::new()
        .route("/", get(root)).route("/health", get(health))
        .route("/search", get(search_media))
        .layer(cors);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001").await.unwrap();
    tracing::info!("pixabay backend running on port 3001");
    axum::serve(listener, app).await.unwrap();
}
