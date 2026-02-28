import Gio from 'gi://Gio';

function isMounted(file) {
    try {
        file.find_enclosing_mount(null);
        return true
    } catch (e) {
        if (e.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.NOT_MOUNTED))
            return false;
        throw e;
    }
}

export async function openRemoteInFiles(protocol, user, server) {
    const sftpDirUri = `${protocol.toLowerCase()}://${user}@${server}`;
    const loc = Gio.File.new_for_uri(sftpDirUri);
   
    if (!isMounted(loc)) {
        await new Promise((resolve, reject) => {
            loc.mount_enclosing_volume(
                Gio.MountMountFlags.NONE,
                Gio.MountOperation.new(),
                null,
                (source, result) => {
                    try {
                        source.mount_enclosing_volume_finish(result);
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                }
            );
        });
    }

    Gio.AppInfo.launch_default_for_uri(sftpDirUri, null);
}