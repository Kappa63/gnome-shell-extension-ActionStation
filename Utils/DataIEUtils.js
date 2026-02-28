import Gio from 'gi://Gio';

export function exportSchema(json) {
    const baseDir = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_DOWNLOAD) || GLib.get_home_dir();
    const fp = GLib.build_filenamev([baseDir, "action-station-GE.json"]);
    
    const file = Gio.File.new_for_path(fp);

    try {
        const outStream = file.replace(null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);
        
        outStream.write_all(json, null); // was write
        
        outStream.close(null);
        return true;
    } catch (e) {
        logError(e);
        throw e;
    }
}

export function importSchema(path) {
    let file = Gio.File.new_for_path(path);

    let [ok, contents] = file.load_contents(null);
    if (!ok) 
        return;
    return JSON.parse(imports.byteArray.toString(contents));
}