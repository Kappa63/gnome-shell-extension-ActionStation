import ModelController from './ModelController.js';

export default class Commands extends ModelController {
    // id, label, command, useTerminal, workDir, preferredTerminal
    constructor(settings) {
        super(settings, "commands");
    }
}