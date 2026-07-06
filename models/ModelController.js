export default class ModelController {
    constructor(settings, key, model) {
        this._settings = settings;
        this._key = key;
        this._model = model;
    }

    _load() {
        return this._settings.get_strv(this._key).map(s => {
            try {
                return JSON.parse(s);
            } catch (e) {
                return null;
            }
        }).filter(obj => obj !== null);
    }

    _save(list) {
        // log(`${this._key} changed`)
        this._settings.set_strv(this._key, list.map(obj => JSON.stringify(obj)));
    }

    getAll() {
        return this._load();
    }

    add(obj) {
        const list = this._load();
        list.push(obj);
        this._save(list);
    }

    remove(id) {
        this._save(this._load().filter(obj => obj.id !== id));
    }

    update(id, newObj) {
        this._save(this._load().map(obj => obj.id === id ? newObj : obj));
    }

    get(id) {
        return this._load().find(obj => obj.id === id);
    }
}
