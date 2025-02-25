use serde::{Serialize, Deserialize};
use sysinfo::System;

#[derive(Serialize, Deserialize)]
pub struct ProcessInfo {
    id: String,
    name: String,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
pub fn processes() -> Vec<ProcessInfo> {
    let mut sys = System::new_all();
    sys.refresh_all();
    sys.processes()
        .iter()
        .map(|(id, process)| {
            ProcessInfo {
                id: id.to_string(),
                name: process.name().to_string_lossy().into_owned()
            }
        }).collect()
}

#[tauri::command]
pub fn kill_process_by_id(id: &str) -> bool {
    let mut sys = System::new_all();
    sys.refresh_all();
    sys.processes()
        .iter()
        .find(|(pid, _)| pid.to_string().eq_ignore_ascii_case(id))
        .map_or(false, |(_, process)| process.kill())
}
