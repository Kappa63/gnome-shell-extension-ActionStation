import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import { ActionPrefsWidget } from './ActionPrefsWidget.js';
import Adw from 'gi://Adw';

export default class ActionStationPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window.set_default_size(600, 700);
        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({ title: "Manage Actions" });

        const widget = new ActionPrefsWidget(this);
        group.add(widget);

        page.add(group);
        window.add(page);
    }
}