"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeDemon = exports.encodeDemon = void 0;
var password_pbox_json_1 = __importDefault(require("../data/password-pbox.json"));
function base2(n, b) {
    var suffix = n.toString(2);
    return '0'.repeat(b - suffix.length) + suffix;
}
function encodeDemon(demon) {
    var baseBits = [
        base2(0, 4),
        base2(demon.demonCode, 9),
        base2(demon.lvl, 7),
        base2(demon.skillCodes[5], 9),
        base2(demon.skillCodes[4], 9),
        base2(demon.skillCodes[3], 9),
        base2(demon.skillCodes[2], 9),
        base2(demon.skillCodes[1], 9),
        base2(demon.skillCodes[0], 9),
        base2(demon.exp, 32),
        base2(demon.stats[1], 7),
        base2(demon.stats[4], 7),
        base2(demon.stats[3], 7),
        base2(demon.stats[2], 7),
        base2(demon.stats[0], 7),
        base2(demon.stats[1], 7),
        base2(demon.stats[4], 7),
        base2(demon.stats[3], 7),
        base2(demon.stats[2], 7),
        base2(demon.stats[0], 7) // St
    ].join('');
    var prow = password_pbox_json_1.default[demon.maskByte];
    var mixedBytes = Array(22);
    // Mask and mix bytes
    for (var i = 0; i < 22; i++) {
        mixedBytes[prow[i]] = parseInt(baseBits.slice(8 * i, 8 * i + 8), 2) ^ demon.maskByte;
    }
    mixedBytes.push(demon.maskByte); // Mask byte
    mixedBytes.push(mixedBytes.reduce(function (acc, b) { return acc + b; }, 0) % 256); // Checksum byte
    var mixedBits = mixedBytes.map(function (b) { return base2(b, 8); }).join('');
    var passBytes = Array(32);
    // Pseudo-base64 encode mixed bits
    for (var i = 0; i < 32; i++) {
        passBytes[i] = parseInt(mixedBits.slice(6 * i, 6 * i + 6), 2);
    }
    return passBytes;
}
exports.encodeDemon = encodeDemon;
function decodeDemon(passBytes) {
    var mixedBits = passBytes.map(function (b) { return base2(b, 6); }).join('');
    var mixedBytes = Array(24);
    for (var i = 0; i < 24; i++) {
        mixedBytes[i] = parseInt(mixedBits.slice(8 * i, 8 * i + 8), 2);
    }
    var checkSum = mixedBytes.pop();
    var maskByte = mixedBytes.pop();
    var prow = password_pbox_json_1.default[maskByte];
    var unmixedBytes = Array(22);
    for (var i = 0; i < 22; i++) {
        unmixedBytes[i] = mixedBytes[prow[i]] ^ maskByte;
    }
    var bits = unmixedBytes.map(function (b) { return base2(b, 8); }).join('');
    var demon = {
        demonCode: parseInt(bits.slice(4, 13), 2),
        lvl: parseInt(bits.slice(13, 20), 2),
        exp: parseInt(bits.slice(74, 106), 2),
        baseStats: [
            parseInt(bits.slice(134, 141), 2),
            parseInt(bits.slice(106, 113), 2),
            parseInt(bits.slice(127, 134), 2),
            parseInt(bits.slice(120, 127), 2),
            parseInt(bits.slice(113, 120), 2)
        ],
        stats: [
            parseInt(bits.slice(169, 176), 2),
            parseInt(bits.slice(141, 148), 2),
            parseInt(bits.slice(162, 169), 2),
            parseInt(bits.slice(155, 162), 2),
            parseInt(bits.slice(148, 155), 2)
        ],
        skillCodes: [
            parseInt(bits.slice(65, 74), 2),
            parseInt(bits.slice(56, 65), 2),
            parseInt(bits.slice(47, 56), 2),
            parseInt(bits.slice(38, 47), 2),
            parseInt(bits.slice(29, 38), 2),
            parseInt(bits.slice(20, 29), 2)
        ],
        maskByte: maskByte
    };
    return demon;
}
exports.decodeDemon = decodeDemon;
