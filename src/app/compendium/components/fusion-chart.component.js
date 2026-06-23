"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FusionChartComponent = void 0;
var core_1 = require("@angular/core");
var translator_1 = require("../models/translator");
var translations_json_1 = __importDefault(require("../data/translations.json"));
var FusionChartComponent = exports.FusionChartComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-fusion-chart',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <table>\n      <tbody>\n        <tr><th class=\"title\" [attr.colspan]=\"table[0].length\">{{ appName }} {{ normTitle }}</th></tr>\n        <tr><th *ngFor=\"let race of table[0]\">{{ race.slice(0, nameCut) }}</th></tr>\n        <tr *ngFor=\"let row of table.slice(1, table.length - 1)\">\n          <th>{{ row[0] }}</th>\n          <td *ngFor=\"let race of row.slice(1, row.length - 1)\" [ngClass]=\"race.slice(0, 4)\">{{ race.slice(4, nameCut + 4) }}</td>\n          <th>{{ row[row.length - 1] }}</th>\n        </tr>\n        <tr><th *ngFor=\"let race of table[table.length - 1]\">{{ race.slice(0, nameCut) }}</th></tr>\n        <tr *ngIf=\"tripTitle\"><th class=\"title\" [attr.colspan]=\"table[0].length\">{{ appName }} {{ tripTitle }}</th></tr>\n      <tbody>\n    </table>\n  ",
            styles: ["\n    table { width: auto; margin: 0 auto; white-space: nowrap; }\n    td.elem { color: lime; }\n    td.trip { color: lightgray; }\n    td.oran { color: orange; }\n    td.redd { color: red; }\n    td.gree { color: lime; }\n    td.blue { color: cyan; }\n    td.none { color: transparent; }\n    td.empt { background-color: transparent; color: transparent; }\n  "]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _normChart_decorators;
    var _normChart_initializers = [];
    var _tripChart_decorators;
    var _tripChart_initializers = [];
    var _mitaTable_decorators;
    var _mitaTable_initializers = [];
    var _normTitle_decorators;
    var _normTitle_initializers = [];
    var _tripTitle_decorators;
    var _tripTitle_initializers = [];
    var _isPersona_decorators;
    var _isPersona_initializers = [];
    var _filterDarks_decorators;
    var _filterDarks_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var _counter_decorators;
    var _counter_initializers = [];
    var FusionChartComponent = _classThis = /** @class */ (function () {
        function FusionChartComponent_1(title2, route) {
            this.title2 = (__runInitializers(this, _instanceExtraInitializers), title2);
            this.route = route;
            this.normChart = __runInitializers(this, _normChart_initializers, void 0);
            this.tripChart = __runInitializers(this, _tripChart_initializers, void 0);
            this.mitaTable = __runInitializers(this, _mitaTable_initializers, void 0);
            this.normTitle = __runInitializers(this, _normTitle_initializers, 'Normal Fusions');
            this.tripTitle = __runInitializers(this, _tripTitle_initializers, '');
            this.isPersona = __runInitializers(this, _isPersona_initializers, false);
            this.filterDarks = __runInitializers(this, _filterDarks_initializers, true);
            this.lang = __runInitializers(this, _lang_initializers, 'en');
            this.counter = __runInitializers(this, _counter_initializers, void 0);
            this.msgs = translations_json_1.default.FusionChartComponent;
            this.subscriptions = [];
            this.table = [];
            this.nameCut = 4;
        }
        FusionChartComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            this.subscriptions.push(this.route.parent.data.subscribe(function (data) {
                _this.appName = data.appName || 'Shin Megami Tensei';
                _this.nameCut = parseInt((0, translator_1.translateComp)(_this.msgs.NameCut, data.lang));
                _this.title2.setTitle((0, translator_1.translateComp)(_this.msgs.AppTitle, data.lang).replace('$APP', _this.appName));
            }));
        };
        FusionChartComponent_1.prototype.ngOnChanges = function () {
            if (this.normChart) {
                this.fillFusionChart();
            }
        };
        FusionChartComponent_1.prototype.ngOnDestroy = function () {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        };
        FusionChartComponent_1.prototype.fillFusionChart = function () {
            var _this = this;
            var noResult = 'noneNone';
            var emResult = 'empt-';
            var colorLook = FusionChartComponent.RESULT_COLORS
                .reduce(function (acc, _a) {
                var color = _a[0], results = _a[1];
                return results.reduce(function (row, res) { row[res] = color; return row; }, acc);
            }, {});
            var elems = this.normChart.elementDemons;
            var lights = [];
            var norms = this.normChart.races;
            var darks = [];
            if (this.filterDarks) {
                lights = this.normChart.races.filter(function (race) { return _this.normChart.getLightDark(race) > 0; });
                norms = this.normChart.races.filter(function (race) { return _this.normChart.getLightDark(race) === 0; });
                darks = this.normChart.races.filter(function (race) { return _this.normChart.getLightDark(race) === -1; });
                if (darks.length === 0 && lights.length > 0) {
                    lights = this.normChart.races.filter(function (race) { return _this.normChart.getLightDark(race) > -1; });
                    norms = [];
                    darks = this.normChart.races.filter(function (race) { return _this.normChart.getLightDark(race) < -1; });
                }
            }
            var leftOff = lights.length - darks.length;
            var top = lights.concat(norms, elems);
            var bottom = !darks.length ?
                top : darks.concat(Array(top.length - darks.length).fill(''));
            var right = this.mitaTable ?
                top : lights.concat(norms, Array(elems.length).fill(''));
            var left = !(this.mitaTable || darks.length) ?
                top : Array(leftOff).fill('').concat(darks, norms, elems);
            this.table = [[''].concat(top, [''])];
            for (var r = 0; r < left.length; r++) {
                var row = Array(top.length + 2).fill(emResult);
                var raceL = left[r];
                var raceR = right[r];
                var isElemL = elems.indexOf(raceL) !== -1;
                var isElemR = elems.indexOf(raceR) !== -1;
                this.table.push(row);
                row[0] = raceL;
                row[row.length - 1] = raceR;
                for (var c = r; c < top.length; c++) {
                    var raceT = top[c];
                    var isElemT = elems.indexOf(raceT) !== -1;
                    if (isElemT && isElemR) {
                        var indexR = elems.indexOf(raceR);
                        var indexT = elems.indexOf(raceT);
                        var result = this.mitaTable[indexT][indexR].replace('-', '');
                        row[c + 1] = result ? (colorLook[result] || 'norm') + result : noResult;
                    }
                    else if (isElemT && raceR) {
                        var result = this.normChart.getElemFusions(raceT)[raceR];
                        row[c + 1] = result ? (colorLook[result] || 'rank') + (result > 0 ? '+' : '') + result.toString() : noResult;
                    }
                    else if (raceT && raceR) {
                        var result = this.isPersona && raceT === raceR ? raceT : this.normChart.getRaceFusion(raceT, raceR);
                        row[c + 1] = result ? (colorLook[result] || (raceT === raceR ? 'elem' : 'norm')) + result : noResult;
                    }
                }
                if (this.tripChart) {
                    for (var c = 0; c <= r - leftOff; c++) {
                        var raceB = bottom[c];
                        if (raceB && isElemL) {
                            var result = this.tripChart.getElemFusions(raceL)[raceB];
                            row[c + 1] = result ? (colorLook[result] || 'rank') + (result > 0 ? '+' : '') + result.toString() : noResult;
                        }
                        else if (raceB && raceL) {
                            var result = this.tripChart.getRaceFusion(raceB, raceL);
                            row[c + 1] = result ? (colorLook[result] || (raceB === raceL ? 'elem' : 'trip')) + result : noResult;
                        }
                    }
                }
                if (raceL.indexOf(' x ') !== -1) {
                    var _a = raceL.split(' x '), raceA = _a[0], raceB = _a[1];
                    var raceX = raceA.slice(0, 3) + 'x' + raceB.slice(0, 3);
                    row[0] = raceX;
                    row[row.length - 1] = raceX;
                }
                else if (raceL.indexOf(' ') !== -1) {
                    var raceX = raceL.split(' ')[0];
                    row[0] = raceX;
                    row[row.length - 1] = raceX;
                }
            }
            for (var c = 0; c < this.table[0].length; c++) {
                var race = this.table[0][c];
                if (race.indexOf(' x ') !== -1) {
                    var _b = race.split(' x '), raceA = _b[0], raceB = _b[1];
                    this.table[0][c] = raceA.slice(0, 2) + raceB.slice(0, 2);
                }
            }
            this.table.push([''].concat(bottom, ['']));
        };
        return FusionChartComponent_1;
    }());
    __setFunctionName(_classThis, "FusionChartComponent");
    (function () {
        _normChart_decorators = [(0, core_1.Input)()];
        _tripChart_decorators = [(0, core_1.Input)()];
        _mitaTable_decorators = [(0, core_1.Input)()];
        _normTitle_decorators = [(0, core_1.Input)()];
        _tripTitle_decorators = [(0, core_1.Input)()];
        _isPersona_decorators = [(0, core_1.Input)()];
        _filterDarks_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        _counter_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _normChart_decorators, { kind: "field", name: "normChart", static: false, private: false, access: { has: function (obj) { return "normChart" in obj; }, get: function (obj) { return obj.normChart; }, set: function (obj, value) { obj.normChart = value; } } }, _normChart_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _tripChart_decorators, { kind: "field", name: "tripChart", static: false, private: false, access: { has: function (obj) { return "tripChart" in obj; }, get: function (obj) { return obj.tripChart; }, set: function (obj, value) { obj.tripChart = value; } } }, _tripChart_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _mitaTable_decorators, { kind: "field", name: "mitaTable", static: false, private: false, access: { has: function (obj) { return "mitaTable" in obj; }, get: function (obj) { return obj.mitaTable; }, set: function (obj, value) { obj.mitaTable = value; } } }, _mitaTable_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _normTitle_decorators, { kind: "field", name: "normTitle", static: false, private: false, access: { has: function (obj) { return "normTitle" in obj; }, get: function (obj) { return obj.normTitle; }, set: function (obj, value) { obj.normTitle = value; } } }, _normTitle_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _tripTitle_decorators, { kind: "field", name: "tripTitle", static: false, private: false, access: { has: function (obj) { return "tripTitle" in obj; }, get: function (obj) { return obj.tripTitle; }, set: function (obj, value) { obj.tripTitle = value; } } }, _tripTitle_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _isPersona_decorators, { kind: "field", name: "isPersona", static: false, private: false, access: { has: function (obj) { return "isPersona" in obj; }, get: function (obj) { return obj.isPersona; }, set: function (obj, value) { obj.isPersona = value; } } }, _isPersona_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _filterDarks_decorators, { kind: "field", name: "filterDarks", static: false, private: false, access: { has: function (obj) { return "filterDarks" in obj; }, get: function (obj) { return obj.filterDarks; }, set: function (obj, value) { obj.filterDarks = value; } } }, _filterDarks_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _counter_decorators, { kind: "field", name: "counter", static: false, private: false, access: { has: function (obj) { return "counter" in obj; }, get: function (obj) { return obj.counter; }, set: function (obj, value) { obj.counter = value; } } }, _counter_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        FusionChartComponent = _classThis = _classDescriptor.value;
    })();
    _classThis.RESULT_COLORS = Object.entries({
        'oran': ['-2', 'Erthys', 'Gnome', 'Saki Mitama', 'Random', 'アーシーズ', 'ノーム', 'サキミタマ'],
        'redd': ['-1', 'Flaemis', 'Salamander', 'Ara Mitama', 'Fiend', 'フレイミーズ', 'サラマンダー', 'アラミタマ'],
        'gree': ['1', 'Aeros', 'Sylph', 'Kushi Mitama', 'Kusi Mitama', 'UMA', 'エアロス', 'シルキー', 'クシミタマ'],
        'blue': ['2', 'Aquans', 'Undine', 'Nigi Mitama', 'Enigma', 'アクアンズ', 'ウンディーネ', 'ニギミタマ']
    });
    (function () {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FusionChartComponent = _classThis;
}();
