import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

export async function runCommand(command, inTerminal = false, workDir = "") {
    if (inTerminal) {
        return new Promise((resolve, reject) => {
            const cdCmd = workDir ? `cd '${workDir}' && ` : "";
            const terminalCmd = `gnome-terminal -- bash -c "${cdCmd}${command}; echo; echo 'Process finished. Press any key to close...'; read -n 1;"`;
            
            try {
                // spawn_command_line_async is truly fire-and-forget
                GLib.spawn_command_line_async(terminalCmd);
                resolve();
            } catch (e) {
                reject(new Error(`Failed to launch terminal: ${e.message}`));
            }
        });
    }

    return new Promise((resolve, reject) => {
        try {
            let [success, argv] = GLib.shell_parse_argv(command);
            if (!success) throw new Error("Invalid command syntax");

            let launcher = new Gio.SubprocessLauncher({
                flags: Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
            });

            if (workDir) {
                let dir = Gio.File.new_for_path(workDir);
                if (dir.query_exists(null)) {
                    launcher.set_cwd(workDir);
                } else {
                    return reject(new Error(`Working directory does not exist: ${workDir}`));
                }
            }

            let proc = launcher.spawnv(argv);
            
            proc.wait_async(null, (p, res) => {
                try {
                    p.wait_finish(res);
                    if (p.get_if_exited() && p.get_exit_status() !== 0) {
                        reject(new Error(`Exit code: ${p.get_exit_status()}`));
                    } else {
                        resolve();
                    }
                } catch (e) {
                    reject(e);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}