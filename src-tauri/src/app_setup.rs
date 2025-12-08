use tauri::App;
use crate::tray;
use crate::window;

pub fn setup_app(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let app_handle = app.handle();
    
    // 设置托盘
    tray::setup_tray(&app_handle)?;
    
    // 设置窗口事件监听器
    window::setup_window_events(&app_handle)?;
    
    Ok(())
}
