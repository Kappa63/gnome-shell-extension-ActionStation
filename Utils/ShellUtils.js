import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

export async function runCommand(command, inTerminal = false, workDir = "", preferredTerminal = "") {
    const trimmedCmd = command.trim();
    const isSudo = trimmedCmd.startsWith('sudo ');
    const actualInTerminal = inTerminal || isSudo;

    if (actualInTerminal) {
        return new Promise((resolve, reject) => {
            let expandedDir = workDir;
            if (workDir.startsWith('~')) 
                expandedDir = workDir.replace('~', GLib.get_home_dir());
            
            const cdCmd = expandedDir ? `cd '${expandedDir}' && ` : "";
            const wrappedCmd = `${cdCmd}${command}; echo; echo 'Process finished. Press any key to close...'; read -n 1;`;
            
            const terminals = [...new Set([preferredTerminal, 'xdg-terminal-exec', 'ptyxis', 'gnome-terminal', 'kgx'])];
            let success = false;

            for (const term of terminals) {
                if (!term) continue;
                const binary = term.split(' ')[0];

                if (GLib.find_program_in_path(binary)) {
                    try {
                        let argv;
                        if (['gnome-terminal', 'ptyxis', 'kgx', 'xdg-terminal-exec'].includes(binary)) 
                            argv = [binary, '--', 'bash', '-c', wrappedCmd];
                        else 
                            argv = [binary, '-e', 'bash', '-c', wrappedCmd];

                        let proc = new Gio.Subprocess({
                            argv: argv,
                            flags: Gio.SubprocessFlags.NONE
                        });
                        proc.init(null);
                        
                        proc.wait_async(null, (p, res) => {
                            try {
                                p.wait_finish(res);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        });

                        success = true;
                        break;
                    } catch (e) {
                        continue;
                    }
                }
            }

            if (!success) {
                reject(new Error("No valid terminal emulator found."));
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
                let expandedDir = workDir.startsWith('~') ? workDir.replace('~', GLib.get_home_dir()) : workDir;
                let dir = Gio.File.new_for_path(expandedDir);
                if (dir.query_exists(null)) {
                    launcher.set_cwd(expandedDir);
                } else {
                    return reject(new Error(`Working directory does not exist: ${expandedDir}`));
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