use std::env;

#[tauri::command]
pub fn os_name() -> &'static str {
    env::consts::OS
}
