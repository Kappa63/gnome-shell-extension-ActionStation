import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

export function exportSchema(jsonString) {
    const baseDir = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_DOWNLOAD) || GLib.get_home_dir();
    const fp = GLib.build_filenamev([baseDir, "action-station-settings.json"]);
    
    const file = Gio.File.new_for_path(fp);

    try {
        const outStream = file.replace(null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);
        
        outStream.write_all(jsonString, null);
        
        outStream.close(null);
        return fp;
    } catch (e) {
        console.error(`Export failed: ${e.message}`);
        throw e;
    }
}

export function importSchema(path) {
    try {
        const file = Gio.File.new_for_path(path);
        const [success, contents] = file.load_contents(null);
        
        if (!success) {
            throw new Error("Could not read file");
        }

        const decoder = new TextDecoder("utf-8");
        return JSON.parse(decoder.decode(contents));
    } catch (e) {
        console.error(`Import failed: ${e.message}`);
        return null;
    }
}