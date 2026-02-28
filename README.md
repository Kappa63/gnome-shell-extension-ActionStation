# Action Station

[<img src="https://github.com/Kappa63/gnome-shell-extension-ActionStation/raw/master/assets/get-it-on-ego.png" height="100">](https://extensions.gnome.org/extension/9466/action-station)

**Action Station** is a productivity hub for GNOME Shell. It provides a unified menu to trigger API requests, mount remote file systems, and execute local shell commands directly from the top bar.

![screenshot](https://github.com/Kappa63/gnome-shell-extension-ActionStation/raw/master/assets/app-screenshot-v3.0.png)

---

## Key Features

* **Local Commands:** Execute shell scripts or system commands with optional terminal output and custom working directories.
* **API Integration:** Send GET/POST requests with custom headers, body data, and authentication. View JSON responses directly in a dedicated modal window.
* **Remote Mounts:** Mount SFTP, FTP, or SMB shares into the file manager with a single click.
* **Customizable Workflow:** Organize and reorder frequent actions to fit a specific routine.

---

## Installation

### From Source

1.  **Clone the repository** into the local extensions directory:
    ```bash
    git clone [https://github.com/Kappa63/gnome-shell-extension-ActionStation.git](https://github.com/Kappa63/gnome-shell-extension-ActionStation.git) ~/.local/share/gnome-shell/extensions/action-station@kappa63.github.com
    ```

2.  **Compile the settings schema** (If not already done. It's required for the extension to recognize settings keys):
    ```bash
    glib-compile-schemas ~/.local/share/gnome-shell/extensions/action-station@kappa63.github.com/schemas/
    ```

3.  **Enable the extension**:
    ```bash
    gnome-extensions enable action-station@kappa63.github.com
    ```
    *Note: Users on Wayland may need to log out and back in for the extension to initialize.*

---

## Compatibility

Action Station is built for GNOME environments:
* **GNOME 48 / 49 / 50**

---

## Support and Contribution

To report bugs or suggest feature requests, please [open an issue](https://github.com/Kappa63/gnome-shell-extension-ActionStation/issues) on GitHub.

---

### License
This project is licensed under the GPL-3.0 License.
