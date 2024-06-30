use reqwest;
use reqwest::header::HeaderValue;
use reqwest::Url;

pub async fn _get_markdown(url: String) -> Option<String> {
    let parsed = Url::parse(&url).unwrap();
    let hostname = parsed.host_str();
    hostname?;
    let body = match hostname.unwrap() {
        "www.youtube.com" => {
            let client = reqwest::Client::new();
            let response = client
                .get(format!(r#"https://ytmd.shivs.me/?url={}"#, url))
                .header(
                    reqwest::header::ACCEPT,
                    HeaderValue::from_static("text/event-stream"),
                )
                .send()
                .await
                .unwrap();
            response.text().await.unwrap()
        }
        _ => reqwest::get(format!("https://r.jina.ai/{}", url))
            .await
            .unwrap()
            .text()
            .await
            .unwrap(),
    };
    Some(body)
}

#[tauri::command]
pub async fn get_markdown(url: String) -> Option<String> {
    _get_markdown(url).await
}
