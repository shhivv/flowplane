use ollama_rs::{generation::completion::request::GenerationRequest, Ollama};
use tauri::State;

#[tauri::command]
pub async fn prompt_ollama(prompt: String, ollama: State<'_, Ollama>) -> Result<String, String> {
    let res = ollama
        .generate(GenerationRequest::new("phi3".to_string(), prompt))
        .await;

    if let Ok(res) = res {
        return Ok(res.response);
    }

    Err("Failed to generate response".into())
}
