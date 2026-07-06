import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

export function exportSchema(json) {
    const baseDir = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_DOWNLOAD) || GLib.get_home_dir();
    const fp = GLib.build_filenamev([baseDir, "action-station-GE.json"]);

    const file = Gio.File.new_for_path(fp);

    try {
        const outStream = file.replace(null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);

        outStream.write_all(new TextEncoder().encode(json), null);

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
        return null;
    return JSON.parse(new TextDecoder("utf-8").decode(contents));
}
