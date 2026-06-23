"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.CompendiumComponent = void 0;
var core_1 = require("@angular/core");
var translator_1 = require("../../compendium/models/translator");
var translations_json_1 = __importDefault(require("../../compendium/data/translations.json"));
var CompendiumComponent = exports.CompendiumComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-smt4f-compendium',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <app-demon-compendium\n      [ngClass]=\"appCssClasses\"\n      [otherLinks]=\"otherLinks\">\n    </app-demon-compendium>\n  ",
            styleUrls: ['./compendium.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CompendiumComponent = _classThis = /** @class */ (function () {
        function CompendiumComponent_1(fusionDataService) {
            this.appCssClasses = ['smt4', 'smt4f'];
            var lang = fusionDataService.compConfig.lang;
            this.appCssClasses = fusionDataService.compConfig.appCssClasses;
            this.otherLinks = [];
            if (fusionDataService.compConfig.maxSkillSlots > 0) {
                this.otherLinks = [this.appCssClasses.includes('smtsj') ?
                        { title: 'Passwords', link: 'passwords' } :
                        { title: (0, translator_1.translateComp)(translations_json_1.default.CompendiumComponent.RecipGenerator, lang), link: 'recipes' }
                ];
                if (this.appCssClasses.includes('dso')) {
                    this.otherLinks.push({ title: 'Skill Recipe', link: 'skill-recipe' });
                }
            }
        }
        return CompendiumComponent_1;
    }());
    __setFunctionName(_classThis, "CompendiumComponent");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        CompendiumComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CompendiumComponent = _classThis;
}();
