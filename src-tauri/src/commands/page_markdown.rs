use reqwest;

pub async fn _get_markdown(url: String) -> Option<String> {
    let body = reqwest::get(format!("https://r.jina.ai/{}", url)).await;
    dbg!(&body);
    if let reqwest::Result::Ok(content) = body {
        return Some(content.text().await.unwrap());
    }
    None
}

#[tauri::command]
pub async fn get_markdown(url: String) -> Option<String> {
    _get_markdown(url).await
}
