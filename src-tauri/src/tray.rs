use tauri::{
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Manager, menu::{Menu, MenuItem}, AppHandle,
};

pub fn setup_tray(app: &AppHandle) -> tauri::Result<()> {
    // 创建托盘菜单
    let show_item = MenuItem::with_id(app, "show", "显示窗口", true, None::<&str>)?;
    let quit_item = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show_item, &quit_item])?;

    let _tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .on_menu_event(handle_tray_menu_event)
        .on_tray_icon_event(handle_tray_icon_event)
        .build(app)?;

    Ok(())
}

fn handle_tray_menu_event(app: &AppHandle, event: tauri::menu::MenuEvent) {
    match event.id.as_ref() {
        "show" => {
            show_main_window(app);
        }
        "quit" => {
            app.exit(0);
        }
        _ => {}
    }
}

fn handle_tray_icon_event(tray: &tauri::tray::TrayIcon, event: TrayIconEvent) {
    match event {
        TrayIconEvent::Click {
            button: MouseButton::Left,
            ..
        } => {
            if let Some(window) = tray.app_handle().get_webview_window("main") {
                let is_visible = window.is_visible().unwrap_or(false);
                if is_visible {
                    let _ = window.hide();
                    #[cfg(target_os = "macos")]
                    let _ = tray.app_handle().hide();
                } else {
                    let _ = window.show();
                    let _ = window.unminimize();
                    let _ = window.set_focus();
                    #[cfg(target_os = "macos")]
                    let _ = tray.app_handle().show();
                }
            }
        }
        _ => {}
    }
}

pub fn show_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
        #[cfg(target_os = "macos")]
        let _ = app.show();
    }
}
