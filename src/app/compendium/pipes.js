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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundInheritPercentPipe = exports.ResmodToStringPipe = exports.ReslvlToColorPipe = exports.ReslvlToStringLocalePipe = exports.ReslvlToStringPipe = exports.LvlToNumberPipe = exports.ElementAffinityToStringPipe = exports.SkillLevelToShortStringPipeLocale = exports.SkillLevelToStringPipe = exports.SkillCostToStringPipe = exports.TranslateCompPipe = void 0;
var core_1 = require("@angular/core");
var translator_1 = require("./models/translator");
var TranslateCompPipe = exports.TranslateCompPipe = function () {
    var _classDecorators = [(0, core_1.Pipe)({ name: 'translateComp' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TranslateCompPipe = _classThis = /** @class */ (function () {
        function TranslateCompPipe_1() {
        }
        TranslateCompPipe_1.prototype.transform = function (dict, lang) {
            return (0, translator_1.translateComp)(dict, lang);
        };
        return TranslateCompPipe_1;
    }());
    __setFunctionName(_classThis, "TranslateCompPipe");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        TranslateCompPipe = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TranslateCompPipe = _classThis;
}();
var SKILL_COST_TYPES = [
    'Auto', ' HP', '% HP', ' MP', '% MP', ' SP', '% SP', ' Ex', '% Ex', ' MG', '% MG', '0x0B', '0x0C', '0x0D', '0x0E', ' CC',
    'Extra', 'Varies', 'Fusion', 'Gauge', 'Sabbath'
];
var SkillCostToStringPipe = exports.SkillCostToStringPipe = function () {
    var _classDecorators_1 = [(0, core_1.Pipe)({ name: 'skillCostToString' })];
    var _classDescriptor_1;
    var _classExtraInitializers_1 = [];
    var _classThis_1;
    var SkillCostToStringPipe = _classThis_1 = /** @class */ (function () {
        function SkillCostToStringPipe_1() {
        }
        SkillCostToStringPipe_1.prototype.transform = function (value) {
            var costType = SKILL_COST_TYPES[value >> 10];
            var cost = (value & 0x3FF);
            return cost === 0 ? costType : (cost.toString() + costType);
        };
        return SkillCostToStringPipe_1;
    }());
    __setFunctionName(_classThis_1, "SkillCostToStringPipe");
    (function () {
        __esDecorate(null, _classDescriptor_1 = { value: _classThis_1 }, _classDecorators_1, { kind: "class", name: _classThis_1.name }, null, _classExtraInitializers_1);
        SkillCostToStringPipe = _classThis_1 = _classDescriptor_1.value;
        __runInitializers(_classThis_1, _classExtraInitializers_1);
    })();
    return SkillCostToStringPipe = _classThis_1;
}();
var SkillLevelToStringPipe = exports.SkillLevelToStringPipe = function () {
    var _classDecorators_2 = [(0, core_1.Pipe)({ name: 'skillLevelToString' })];
    var _classDescriptor_2;
    var _classExtraInitializers_2 = [];
    var _classThis_2;
    var SkillLevelToStringPipe = _classThis_2 = /** @class */ (function () {
        function SkillLevelToStringPipe_1() {
        }
        SkillLevelToStringPipe_1.prototype.transform = function (value) {
            if (value < 2) {
                return 'Innate';
            }
            if (value < 120) {
                return value.toString();
            }
            return String.fromCharCode(Math.floor(value / 100) + 32) + String.fromCharCode(value % 100 + 32);
        };
        return SkillLevelToStringPipe_1;
    }());
    __setFunctionName(_classThis_2, "SkillLevelToStringPipe");
    (function () {
        __esDecorate(null, _classDescriptor_2 = { value: _classThis_2 }, _classDecorators_2, { kind: "class", name: _classThis_2.name }, null, _classExtraInitializers_2);
        SkillLevelToStringPipe = _classThis_2 = _classDescriptor_2.value;
        __runInitializers(_classThis_2, _classExtraInitializers_2);
    })();
    return SkillLevelToStringPipe = _classThis_2;
}();
var SkillLevelToShortStringPipeLocale = exports.SkillLevelToShortStringPipeLocale = function () {
    var _classDecorators_3 = [(0, core_1.Pipe)({ name: 'skillLevelToShortStringLocale' })];
    var _classDescriptor_3;
    var _classExtraInitializers_3 = [];
    var _classThis_3;
    var SkillLevelToShortStringPipeLocale = _classThis_3 = /** @class */ (function () {
        function SkillLevelToShortStringPipeLocale_1() {
        }
        SkillLevelToShortStringPipeLocale_1.prototype.transform = function (value, lang) {
            if (value < 2) {
                return '';
            }
            if (value < 120) {
                return "(".concat(value.toString(), ")");
            }
            if (value === 3865) {
                return lang === 'ko' ? '(경보)' : '(Fa)';
            }
            if (value === 5275) {
                return lang === 'ko' ? '(협상)' : '(Tk)';
            }
            return '(' + String.fromCharCode(Math.floor(value / 100) + 32) + String.fromCharCode(value % 100 + 32) + ')';
        };
        return SkillLevelToShortStringPipeLocale_1;
    }());
    __setFunctionName(_classThis_3, "SkillLevelToShortStringPipeLocale");
    (function () {
        __esDecorate(null, _classDescriptor_3 = { value: _classThis_3 }, _classDecorators_3, { kind: "class", name: _classThis_3.name }, null, _classExtraInitializers_3);
        SkillLevelToShortStringPipeLocale = _classThis_3 = _classDescriptor_3.value;
        __runInitializers(_classThis_3, _classExtraInitializers_3);
    })();
    return SkillLevelToShortStringPipeLocale = _classThis_3;
}();
var AFFINITY_LVLS = [
    '-', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1',
    '0', '+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8', '+9', 'O', 'B', 'N', 'G', 'G+'
];
var ElementAffinityToStringPipe = exports.ElementAffinityToStringPipe = function () {
    var _classDecorators_4 = [(0, core_1.Pipe)({ name: 'affinityToString' })];
    var _classDescriptor_4;
    var _classExtraInitializers_4 = [];
    var _classThis_4;
    var ElementAffinityToStringPipe = _classThis_4 = /** @class */ (function () {
        function ElementAffinityToStringPipe_1() {
        }
        ElementAffinityToStringPipe_1.prototype.transform = function (value) {
            return AFFINITY_LVLS[value + 10];
        };
        return ElementAffinityToStringPipe_1;
    }());
    __setFunctionName(_classThis_4, "ElementAffinityToStringPipe");
    (function () {
        __esDecorate(null, _classDescriptor_4 = { value: _classThis_4 }, _classDecorators_4, { kind: "class", name: _classThis_4.name }, null, _classExtraInitializers_4);
        ElementAffinityToStringPipe = _classThis_4 = _classDescriptor_4.value;
        __runInitializers(_classThis_4, _classExtraInitializers_4);
    })();
    return ElementAffinityToStringPipe = _classThis_4;
}();
var LvlToNumberPipe = exports.LvlToNumberPipe = function () {
    var _classDecorators_5 = [(0, core_1.Pipe)({ name: 'lvlToNumber' })];
    var _classDescriptor_5;
    var _classExtraInitializers_5 = [];
    var _classThis_5;
    var LvlToNumberPipe = _classThis_5 = /** @class */ (function () {
        function LvlToNumberPipe_1() {
        }
        LvlToNumberPipe_1.prototype.transform = function (value) {
            var lvl = Math.floor(value);
            return lvl <= 0x3FF ? lvl.toString() : "".concat(lvl >> 10, "-").concat(lvl & 0x3FF);
        };
        return LvlToNumberPipe_1;
    }());
    __setFunctionName(_classThis_5, "LvlToNumberPipe");
    (function () {
        __esDecorate(null, _classDescriptor_5 = { value: _classThis_5 }, _classDecorators_5, { kind: "class", name: _classThis_5.name }, null, _classExtraInitializers_5);
        LvlToNumberPipe = _classThis_5 = _classDescriptor_5.value;
        __runInitializers(_classThis_5, _classExtraInitializers_5);
    })();
    return LvlToNumberPipe = _classThis_5;
}();
var RESIST_LVLS = [
    '??', 'ab', 'rp', 'nu', 'rs', 'no', 'wk', 'fr',
    '??', 'ab', 'rp', 'nu'
];
var RESIST_NUMS = [
    { 4: '0.1', 5: '⅛', 8: '0.2', 10: '¼', 15: '⅜', 20: '½', 25: '⅝', 28: '0.7', 30: '¾', 32: '0.8', 35: '⅞' },
    { 40: 'no' },
    { 50: '1.2', 60: '1.5', 70: '1.7', 80: '2.0', 100: '2.5', 120: '3.0' },
];
var ReslvlToStringPipe = exports.ReslvlToStringPipe = function () {
    var _classDecorators_6 = [(0, core_1.Pipe)({ name: 'reslvlToString' })];
    var _classDescriptor_6;
    var _classExtraInitializers_6 = [];
    var _classThis_6;
    var ReslvlToStringPipe = _classThis_6 = /** @class */ (function () {
        function ReslvlToStringPipe_1() {
        }
        ReslvlToStringPipe_1.prototype.transform = function (value) {
            var resLvl = value >> 10;
            return resLvl < 12 ? RESIST_LVLS[resLvl] : RESIST_NUMS[resLvl - 12][value & 0x3FF];
        };
        return ReslvlToStringPipe_1;
    }());
    __setFunctionName(_classThis_6, "ReslvlToStringPipe");
    (function () {
        __esDecorate(null, _classDescriptor_6 = { value: _classThis_6 }, _classDecorators_6, { kind: "class", name: _classThis_6.name }, null, _classExtraInitializers_6);
        ReslvlToStringPipe = _classThis_6 = _classDescriptor_6.value;
        __runInitializers(_classThis_6, _classExtraInitializers_6);
    })();
    return ReslvlToStringPipe = _classThis_6;
}();
var JA_RESIST_LVLS = [
    '??', '吸', '反', '無', '耐', 'ー', '弱', '??',
    '??', '吸', '反', '無', '耐', 'ー', '弱'
];
var KO_RESIST_LVLS = [
    '??', '흡', '반', '무', '내', '-', '약', '??',
    '??', '흡', '반', '무', '내', '-', '약'
];
var ReslvlToStringLocalePipe = exports.ReslvlToStringLocalePipe = function () {
    var _classDecorators_7 = [(0, core_1.Pipe)({ name: 'reslvlToStringLocale' })];
    var _classDescriptor_7;
    var _classExtraInitializers_7 = [];
    var _classThis_7;
    var ReslvlToStringLocalePipe = _classThis_7 = /** @class */ (function () {
        function ReslvlToStringLocalePipe_1() {
        }
        ReslvlToStringLocalePipe_1.prototype.transform = function (value, lang) {
            var resLvl = value >> 10;
            if (lang === 'ja') {
                return JA_RESIST_LVLS[resLvl];
            }
            if (lang === 'ko') {
                return KO_RESIST_LVLS[resLvl];
            }
            return resLvl < 12 ? RESIST_LVLS[resLvl] : RESIST_NUMS[resLvl - 12][value & 0x3FF];
        };
        return ReslvlToStringLocalePipe_1;
    }());
    __setFunctionName(_classThis_7, "ReslvlToStringLocalePipe");
    (function () {
        __esDecorate(null, _classDescriptor_7 = { value: _classThis_7 }, _classDecorators_7, { kind: "class", name: _classThis_7.name }, null, _classExtraInitializers_7);
        ReslvlToStringLocalePipe = _classThis_7 = _classDescriptor_7.value;
        __runInitializers(_classThis_7, _classExtraInitializers_7);
    })();
    return ReslvlToStringLocalePipe = _classThis_7;
}();
var RESIST_COLORS = [
    '??', 'ab', 'rp', 'nu', 'rs', 'no', 'wk', 'fr',
    '??', 'ab', 'rp', 'nu', 'rs', 'no', 'wk', 'fr'
];
var ReslvlToColorPipe = exports.ReslvlToColorPipe = function () {
    var _classDecorators_8 = [(0, core_1.Pipe)({ name: 'reslvlToColor' })];
    var _classDescriptor_8;
    var _classExtraInitializers_8 = [];
    var _classThis_8;
    var ReslvlToColorPipe = _classThis_8 = /** @class */ (function () {
        function ReslvlToColorPipe_1() {
        }
        ReslvlToColorPipe_1.prototype.transform = function (value) {
            return RESIST_COLORS[value >> 10];
        };
        return ReslvlToColorPipe_1;
    }());
    __setFunctionName(_classThis_8, "ReslvlToColorPipe");
    (function () {
        __esDecorate(null, _classDescriptor_8 = { value: _classThis_8 }, _classDecorators_8, { kind: "class", name: _classThis_8.name }, null, _classExtraInitializers_8);
        ReslvlToColorPipe = _classThis_8 = _classDescriptor_8.value;
        __runInitializers(_classThis_8, _classExtraInitializers_8);
    })();
    return ReslvlToColorPipe = _classThis_8;
}();
var ResmodToStringPipe = exports.ResmodToStringPipe = function () {
    var _classDecorators_9 = [(0, core_1.Pipe)({ name: 'resmodToString' })];
    var _classDescriptor_9;
    var _classExtraInitializers_9 = [];
    var _classThis_9;
    var ResmodToStringPipe = _classThis_9 = /** @class */ (function () {
        function ResmodToStringPipe_1() {
        }
        ResmodToStringPipe_1.prototype.transform = function (value) {
            return (value & 0x3FF) * 2.5 + '%';
        };
        return ResmodToStringPipe_1;
    }());
    __setFunctionName(_classThis_9, "ResmodToStringPipe");
    (function () {
        __esDecorate(null, _classDescriptor_9 = { value: _classThis_9 }, _classDecorators_9, { kind: "class", name: _classThis_9.name }, null, _classExtraInitializers_9);
        ResmodToStringPipe = _classThis_9 = _classDescriptor_9.value;
        __runInitializers(_classThis_9, _classExtraInitializers_9);
    })();
    return ResmodToStringPipe = _classThis_9;
}();
var RoundInheritPercentPipe = exports.RoundInheritPercentPipe = function () {
    var _classDecorators_10 = [(0, core_1.Pipe)({ name: 'roundInheritPercent' })];
    var _classDescriptor_10;
    var _classExtraInitializers_10 = [];
    var _classThis_10;
    var RoundInheritPercentPipe = _classThis_10 = /** @class */ (function () {
        function RoundInheritPercentPipe_1() {
        }
        RoundInheritPercentPipe_1.prototype.transform = function (value) {
            if (value === 0) {
                return 0;
            }
            if (value < 100) {
                return 50;
            }
            if (value === 100) {
                return 100;
            }
            if (value < 800) {
                return 500;
            }
            return 1000;
        };
        return RoundInheritPercentPipe_1;
    }());
    __setFunctionName(_classThis_10, "RoundInheritPercentPipe");
    (function () {
        __esDecorate(null, _classDescriptor_10 = { value: _classThis_10 }, _classDecorators_10, { kind: "class", name: _classThis_10.name }, null, _classExtraInitializers_10);
        RoundInheritPercentPipe = _classThis_10 = _classDescriptor_10.value;
        __runInitializers(_classThis_10, _classExtraInitializers_10);
    })();
    return RoundInheritPercentPipe = _classThis_10;
}();
