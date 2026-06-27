"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FusionSettings = void 0;
var FusionSettings = /** @class */ (function () {
    function FusionSettings(demonUnlocks, subapps, separator) {
        if (separator === void 0) { separator = ','; }
        this.separator = separator;
        this._displayHeaders = [];
        this._demonToggles = {};
        this._subappToggles = {};
        for (var _i = 0, demonUnlocks_1 = demonUnlocks; _i < demonUnlocks_1.length; _i++) {
            var _a = demonUnlocks_1[_i], category = _a.category, unlocked = _a.unlocked, conditions = _a.conditions;
            var settings = [];
            this._displayHeaders.push({ category: category, settings: settings });
            for (var _b = 0, _c = Object.keys(conditions); _b < _c.length; _b++) {
                var name_1 = _c[_b];
                this._demonToggles[name_1] = unlocked;
                settings.push({ name: name_1, caption: name_1.split(separator).join(', '), enabled: unlocked });
            }
        }
        var subappSettings = [];
        if (subapps.length > 0) {
            this._displayHeaders.push({ category: 'Subapps', settings: subappSettings });
        }
        for (var _d = 0, subapps_1 = subapps; _d < subapps_1.length; _d++) {
            var name_2 = subapps_1[_d];
            this._subappToggles[name_2] = false;
            subappSettings.push({ name: name_2, caption: name_2, enabled: false });
        }
    }
    Object.defineProperty(FusionSettings.prototype, "displayHeaders", {
        get: function () {
            for (var _i = 0, _a = this._displayHeaders; _i < _a.length; _i++) {
                var category = _a[_i];
                for (var _b = 0, _c = category.settings; _b < _c.length; _b++) {
                    var setting = _c[_b];
                    setting.enabled = this.saveFile[setting.name];
                }
            }
            return this._displayHeaders;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FusionSettings.prototype, "subappToggles", {
        get: function () {
            return this._subappToggles;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FusionSettings.prototype, "demonToggles", {
        get: function () {
            var toggles = {};
            for (var _i = 0, _a = Object.entries(this._demonToggles); _i < _a.length; _i++) {
                var _b = _a[_i], names = _b[0], enabled = _b[1];
                for (var _c = 0, _d = names.split(this.separator); _c < _d.length; _c++) {
                    var name_3 = _d[_c];
                    toggles[name_3] = enabled;
                }
            }
            return toggles;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FusionSettings.prototype, "saveFile", {
        get: function () {
            return Object.assign({}, this._demonToggles, this._subappToggles);
        },
        enumerable: false,
        configurable: true
    });
    FusionSettings.prototype.isEnabled = function (name) {
        return this._demonToggles[name] || this._subappToggles[name] || false;
    };
    FusionSettings.prototype.updateSaveFile = function (saveFile) {
        for (var _i = 0, _a = [this._demonToggles, this._subappToggles]; _i < _a.length; _i++) {
            var toggleSet = _a[_i];
            for (var _b = 0, _c = Object.entries(saveFile); _b < _c.length; _b++) {
                var _d = _c[_b], name_4 = _d[0], enabled = _d[1];
                if (toggleSet[name_4] === !enabled) {
                    toggleSet[name_4] = enabled;
                }
            }
        }
    };
    return FusionSettings;
}());
exports.FusionSettings = FusionSettings;
