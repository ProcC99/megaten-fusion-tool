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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemonPasswordComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var DemonPasswordComponent = exports.DemonPasswordComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-demon-password',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <form [formGroup]=\"form\">\n      <h2>Password Generator</h2>\n      <table class=\"entry-table\">\n        <thead>\n          <tr><th colspan=\"2\" class=\"title\">Passwords</th></tr>\n          <tr>\n            <th>Password</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td>\n              <textarea formControlName=\"password\" (input)=\"emitPassword()\"></textarea>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </form>\n  ",
            styles: ["\n    textarea { width: 16em; height: 3em; border-width: 3px; }\n    textarea.ng-valid { border-color: lime; }\n    textarea.ng-invalid { border-color: red; }\n  "]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _encoding_decorators;
    var _encoding_initializers = [];
    var _inverseEncoding_decorators;
    var _inverseEncoding_initializers = [];
    var _encodeBytes_decorators;
    var _encodeBytes_initializers = [];
    var _decodedBytes_decorators;
    var _decodedBytes_initializers = [];
    var DemonPasswordComponent = _classThis = /** @class */ (function () {
        function DemonPasswordComponent_1(fb) {
            this.fb = (__runInitializers(this, _instanceExtraInitializers), fb);
            this.encoding = __runInitializers(this, _encoding_initializers, void 0);
            this.inverseEncoding = __runInitializers(this, _inverseEncoding_initializers, void 0);
            this.encodeBytes = __runInitializers(this, _encodeBytes_initializers, void 0);
            this.decodedBytes = __runInitializers(this, _decodedBytes_initializers, new core_1.EventEmitter());
            this.createForm();
        }
        DemonPasswordComponent_1.prototype.ngOnChanges = function () { this.setPassword(); };
        DemonPasswordComponent_1.prototype.createForm = function () {
            var validChars = "しんいくみＢやるＹけひＫＦとＨむＡちにＺきＷよＬをのたれＮえＳふわＪそりすＣめＰへＱＧＲＤこＭＴまつせかはＥＵてさなあもゆおうろ" +
                "0-9A-Za-z&?$%#+-";
            var passwordRegex = new RegExp("^(\\s*)([".concat(validChars, "]{16})(\\s*)([").concat(validChars, "]{16})(\\s*)$"));
            this.form = this.fb.group({
                password: [null, [forms_1.Validators.required, forms_1.Validators.pattern(passwordRegex)]],
            });
        };
        DemonPasswordComponent_1.prototype.emitPassword = function () {
            var _this = this;
            if (this.form.valid) {
                var password = this.form.controls.password.value.replace(/\s/g, '');
                this.decodedBytes.emit(password.split('').map(function (c) { return _this.inverseEncoding[c]; }));
            }
        };
        DemonPasswordComponent_1.prototype.setPassword = function () {
            var _this = this;
            var password = this.encodeBytes.map(function (b) { return _this.encoding.charAt(b); }).join('');
            this.form.setValue({
                password: "".concat(password.substring(0, 16), "\n").concat(password.substring(16))
            });
        };
        return DemonPasswordComponent_1;
    }());
    __setFunctionName(_classThis, "DemonPasswordComponent");
    (function () {
        _encoding_decorators = [(0, core_1.Input)()];
        _inverseEncoding_decorators = [(0, core_1.Input)()];
        _encodeBytes_decorators = [(0, core_1.Input)()];
        _decodedBytes_decorators = [(0, core_1.Output)()];
        __esDecorate(null, null, _encoding_decorators, { kind: "field", name: "encoding", static: false, private: false, access: { has: function (obj) { return "encoding" in obj; }, get: function (obj) { return obj.encoding; }, set: function (obj, value) { obj.encoding = value; } } }, _encoding_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _inverseEncoding_decorators, { kind: "field", name: "inverseEncoding", static: false, private: false, access: { has: function (obj) { return "inverseEncoding" in obj; }, get: function (obj) { return obj.inverseEncoding; }, set: function (obj, value) { obj.inverseEncoding = value; } } }, _inverseEncoding_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _encodeBytes_decorators, { kind: "field", name: "encodeBytes", static: false, private: false, access: { has: function (obj) { return "encodeBytes" in obj; }, get: function (obj) { return obj.encodeBytes; }, set: function (obj, value) { obj.encodeBytes = value; } } }, _encodeBytes_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _decodedBytes_decorators, { kind: "field", name: "decodedBytes", static: false, private: false, access: { has: function (obj) { return "decodedBytes" in obj; }, get: function (obj) { return obj.decodedBytes; }, set: function (obj, value) { obj.decodedBytes = value; } } }, _decodedBytes_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        DemonPasswordComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DemonPasswordComponent = _classThis;
}();
