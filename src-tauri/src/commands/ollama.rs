use arrow_array::StringArray;
use futures::TryStreamExt;
use lancedb::query::ExecutableQuery;
use lancedb::query::QueryBase;
use lancedb::Table;
use ollama_rs::{
    generation::completion::request::GenerationRequest, generation::options::GenerationOptions,
    Ollama,
};
use tauri::State;

#[tauri::command]
pub async fn prompt_ollama(
    prompt: String,
    ollama: State<'_, Ollama>,
    vdb: State<'_, Table>,
) -> Result<String, String> {
    let emb = ollama
        .generate_embeddings("mxbai-embed-large".to_string(), prompt.clone(), None)
        .await;

    if emb.is_err() {
        return Err("Failed to generate response".into());
    }

    let embres = vdb
        .query()
        .limit(10)
        .nearest_to(emb.unwrap().embeddings)
        .unwrap()
        .execute()
        .await
        .unwrap()
        .try_collect::<Vec<_>>()
        .await;

    if let Ok(embres) = embres {
        let embs_r = (**embres[0].column(2)) 
            .as_any()
            .downcast_ref::<StringArray>()
            .unwrap();
      
        let data = embs_r
            .iter()
            .map(|f| f.unwrap().to_string())
            .collect::<Vec<_>>()
            .join("\n\n"); 
        let res = ollama
            .generate(GenerationRequest::new(
                "phi3".to_string(),
                format!("
Your goal is to accurately answering the user's query and aligning with their user's intent, by collecting and neatly presenting the relevant information - use the following context as your previous knowledge of the user's notes:

{data}

When answering to user:
- Make sure to provide any details in full/depth, going beyond the user's query/intent with any information you have
- Avoid super general summaries, you need to give detailed responses, NOT missing out any critical information.
- Answer according to the language of the user's question.
- NEVER MAKE ANY ASSUMPTIONS.
- Ensure you understood the intricacies of the user's query and note that the provided notes may not directly be related - try your best.

Prompt: {prompt}              
                
                "),
            ).options(GenerationOptions::default().temperature(0.3)))
            .await;

        if let Ok(res) = res {
            return Ok(res.response);
        }
    }

    Err("Failed to generate response".into())
}
