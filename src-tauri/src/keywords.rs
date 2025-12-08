use jieba_rs::Jieba;
use jieba_rs::KeywordExtract;
use jieba_rs::TextRank;
use serde::{Serialize, Deserialize};
use std::sync::OnceLock;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct Keyword {
    pub text: String,
    pub weight: f64,
}

fn get_jieba() -> &'static Jieba {
    static JIEBA: OnceLock<Jieba> = OnceLock::new();
    
    JIEBA.get_or_init(|| {
        Jieba::new()
    })
}

fn get_text_rank() -> TextRank {
    TextRank::default()
}

#[command]
pub fn rank_keywords(text: &str, top_k: usize, allowed_pos: Option<Vec<String>>) -> Vec<Keyword> {
    let jieba = get_jieba();
    let extractor = get_text_rank();
    
    let pos_tags = allowed_pos.unwrap_or_else(|| 
        vec![
            String::from("n"),    // noun
            String::from("ns"),   // place name
            String::from("v"),    // verb
            String::from("vn"),   // verbal noun
        ]
    );
    
    // The TextRank extract_keywords returns Vec<jieba_rs::Keyword>
    let jieba_keywords = extractor.extract_keywords(
        jieba,
        text,
        top_k,
        pos_tags,
    );
    
    // Convert jieba_rs::Keyword to our custom Keyword struct
    // Based on inspection, jieba_rs::Keyword is a tuple struct with (String, f64)
    jieba_keywords.into_iter()
        .map(|kw| Keyword {
            text: kw.keyword.clone(),
            weight: kw.weight,
        })
        .collect()
}
