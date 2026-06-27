"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurableFusionDataService = void 0;
var rxjs_1 = require("rxjs");
var ConfigurableFusionDataService = /** @class */ (function () {
    function ConfigurableFusionDataService(comp, chart, fusionSettings, settingsKey, settingsVersion) {
        this.settingsKey = settingsKey;
        this.settingsVersion = settingsVersion;
        this._compendium = comp;
        this._compendium$ = new rxjs_1.BehaviorSubject(this._compendium);
        this.compendium = this._compendium$.asObservable();
        this._fusionChart = chart;
        this._fusionChart$ = new rxjs_1.BehaviorSubject(this._fusionChart);
        this.fusionChart = this._fusionChart$.asObservable();
        this._fusionSettings = fusionSettings;
        this._fusionSettings$ = new rxjs_1.BehaviorSubject(this._fusionSettings);
        this.fusionSettings = this._fusionSettings$.asObservable();
        var settings = JSON.parse(localStorage.getItem(this.settingsKey));
        if (settings && settings.version && settings.version >= this.settingsVersion) {
            this.updateFusionSettings(settings.settings);
        }
        window.addEventListener('storage', this.onStorageUpdated.bind(this));
    }
    ConfigurableFusionDataService.prototype.updateToggledSettings = function (settings) {
        this._fusionSettings.updateSaveFile(settings);
        this._compendium.updateFusionSettings(this._fusionSettings.demonToggles);
        this._compendium$.next(this._compendium);
        this._fusionSettings$.next(this._fusionSettings);
    };
    ConfigurableFusionDataService.prototype.onStorageUpdated = function (e) {
        if (e.key === this.settingsKey) {
            this.updateToggledSettings(JSON.parse(e.newValue).settings);
        }
    };
    ConfigurableFusionDataService.prototype.updateFusionSettings = function (settings) {
        this.updateToggledSettings(settings);
        localStorage.setItem(this.settingsKey, JSON.stringify({
            version: this.settingsVersion,
            settings: this._fusionSettings.saveFile
        }));
    };
    return ConfigurableFusionDataService;
}());
exports.ConfigurableFusionDataService = ConfigurableFusionDataService;
