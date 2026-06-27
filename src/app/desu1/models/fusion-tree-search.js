"use strict";
/**
 * fusion-tree-search.ts (Bidirectional DP Hypergraph Shortest Path)
 * -----------------------------------------------------------------
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFusionTree = void 0;
var fusion_tree_types_1 = require("./fusion-tree-types");
var PASSIVE_ELEMENTS = new Set(['aut', 'pas', 'auto']);
function isPassiveSkill(comp, skillName) {
    var sk = comp.getSkill(skillName);
    if (!sk) {
        return false;
    }
    return PASSIVE_ELEMENTS.has((sk.element || '').toLowerCase());
}
function demonSlotUsage(demon, comp) {
    var usedCmd = 0;
    var usedPas = 0;
    for (var _i = 0, _a = Object.entries(demon.skills); _i < _a.length; _i++) {
        var skillName = _a[_i][0];
        if (isPassiveSkill(comp, skillName)) {
            usedPas++;
        }
        else {
            usedCmd++;
        }
    }
    return { usedCmd: usedCmd, usedPas: usedPas };
}
function checkSlots(demon, inheritedMask, comp, inheritableSkills) {
    if (inheritedMask === 0)
        return true;
    var _a = demonSlotUsage(demon, comp), usedCmd = _a.usedCmd, usedPas = _a.usedPas;
    var freeCmd = Math.max(0, 3 - usedCmd);
    var freePas = Math.max(0, 3 - usedPas);
    var neededCmd = 0;
    var neededPas = 0;
    for (var i = 0; i < inheritableSkills.length; i++) {
        if ((inheritedMask & (1 << i)) !== 0) {
            if (isPassiveSkill(comp, inheritableSkills[i]))
                neededPas++;
            else
                neededCmd++;
        }
    }
    return neededCmd <= freeCmd && neededPas <= freePas;
}
function getNativeSkillMask(demon, playerState, inheritableSkills) {
    var mask = 0;
    for (var i = 0; i < inheritableSkills.length; i++) {
        var s = inheritableSkills[i];
        var lvl = demon.skills[s];
        if (lvl !== undefined && !(0, fusion_tree_types_1.isAHExclusiveSkill)(lvl)) {
            if (lvl <= 0.9 || Math.round(lvl) <= playerState.maxLevel) {
                mask |= (1 << i);
            }
        }
    }
    return mask;
}
function isReachableBaseCase(demon, playerState) {
    if (demon.name === 'Pixie')
        return true;
    if (demon.lvl > playerState.maxLevel)
        return false;
    if (demon.fusion === 'story' && !playerState.unlockedFusions.includes(demon.name))
        return false;
    var hasAuction = Boolean(demon.auctions);
    var canNeg = !demon.price || demon.price === 0;
    if (canNeg)
        return true;
    if (hasAuction && playerState.currentDay >= 2)
        return true;
    return false;
}
var PriorityQueue = /** @class */ (function () {
    function PriorityQueue(compare) {
        this.compare = compare;
        this.data = [];
    }
    PriorityQueue.prototype.push = function (item) {
        this.data.push(item);
        this.bubbleUp(this.data.length - 1);
    };
    PriorityQueue.prototype.pop = function () {
        var top = this.data[0];
        var bottom = this.data.pop();
        if (this.data.length > 0 && bottom !== undefined) {
            this.data[0] = bottom;
            this.sinkDown(0);
        }
        return top;
    };
    PriorityQueue.prototype.isEmpty = function () { return this.data.length === 0; };
    PriorityQueue.prototype.bubbleUp = function (n) {
        var item = this.data[n];
        while (n > 0) {
            var p = Math.floor((n - 1) / 2);
            if (this.compare(item, this.data[p]) >= 0)
                break;
            this.data[n] = this.data[p];
            n = p;
        }
        this.data[n] = item;
    };
    PriorityQueue.prototype.sinkDown = function (n) {
        var len = this.data.length;
        var item = this.data[n];
        while (true) {
            var left = 2 * n + 1;
            var right = 2 * n + 2;
            var swap = -1;
            if (left < len && this.compare(this.data[left], item) < 0)
                swap = left;
            if (right < len && this.compare(this.data[right], swap === -1 ? item : this.data[left]) < 0)
                swap = right;
            if (swap === -1)
                break;
            this.data[n] = this.data[swap];
            n = swap;
        }
        this.data[n] = item;
    };
    return PriorityQueue;
}());
function searchFusionTree(target, comp, squareChart, recipeConfig) {
    var targetDemon = target.targetDemon, requiredSkills = target.requiredSkills, playerState = target.playerState, maxResults = target.maxResults;
    var normalChart = squareChart.normalChart;
    var ahOnlySkillNames = requiredSkills.filter(function (s) { return isSkillAHOnly(s, comp); });
    var inheritableSkills = requiredSkills.filter(function (s) { return !isSkillAHOnly(s, comp); });
    var N = inheritableSkills.length;
    var ALL_SKILLS = (1 << N) - 1;
    // 1. Precompute Forward Fusions
    var forwardFusions = {};
    for (var _i = 0, _a = comp.allDemons; _i < _a.length; _i++) {
        var resultDemon = _a[_i];
        if (resultDemon.isEnemy)
            continue;
        var fissions = recipeConfig.fissionCalculator.getFusions(resultDemon.name, comp, normalChart);
        for (var _b = 0, fissions_1 = fissions; _b < fissions_1.length; _b++) {
            var pair = fissions_1[_b];
            var A = pair.name1;
            var B = pair.name2;
            if (A === resultDemon.name || B === resultDemon.name)
                continue;
            if (!forwardFusions[A])
                forwardFusions[A] = [];
            forwardFusions[A].push({ partner: B, result: resultDemon.name });
            if (A !== B) {
                if (!forwardFusions[B])
                    forwardFusions[B] = [];
                forwardFusions[B].push({ partner: A, result: resultDemon.name });
            }
        }
    }
    // 2. Initialize DP Table
    var dist = {};
    var best = {};
    var activeMasks = {};
    for (var _c = 0, _d = comp.allDemons; _c < _d.length; _c++) {
        var d = _d[_c];
        dist[d.name] = {};
        best[d.name] = {};
        activeMasks[d.name] = [];
        for (var m = 0; m <= ALL_SKILLS; m++)
            dist[d.name][m] = Infinity;
    }
    var pq = new PriorityQueue(function (a, b) { return a.cost - b.cost; });
    function relax(name, mask, cost, state) {
        for (var sub = mask; sub >= 0; sub = (sub - 1) & mask) {
            if (cost < dist[name][sub]) {
                if (dist[name][sub] === Infinity)
                    activeMasks[name].push(sub);
                dist[name][sub] = cost;
                best[name][sub] = __assign(__assign({}, state), { mask: sub });
                pq.push({ cost: cost, name: name, mask: sub });
            }
            if (sub === 0)
                break;
        }
    }
    var _loop_1 = function (demon) {
        if (demon.isEnemy)
            return "continue";
        // Check owned
        var owned = playerState.ownedDemons.find(function (d) { return d.name === demon.name; });
        var baseMask = 0;
        if (owned) {
            for (var i = 0; i < N; i++) {
                if (owned.skills.includes(inheritableSkills[i]) ||
                    (demon.skills[inheritableSkills[i]] !== undefined && demon.skills[inheritableSkills[i]] <= 0.9) ||
                    (demon.skills[inheritableSkills[i]] !== undefined && Math.round(demon.skills[inheritableSkills[i]]) <= owned.currentLevel)) {
                    baseMask |= (1 << i);
                }
            }
            relax(demon.name, baseMask, 0, { demonName: demon.name, mask: baseMask, cost: 0, depth: 0, isOwned: true });
        }
        if (isReachableBaseCase(demon, playerState)) {
            var nativeMask = getNativeSkillMask(demon, playerState, inheritableSkills);
            relax(demon.name, nativeMask, demon.price, { demonName: demon.name, mask: nativeMask, cost: demon.price, depth: 0, isOwned: false });
        }
    };
    // 3. Base Cases
    for (var _e = 0, _f = comp.allDemons; _e < _f.length; _e++) {
        var demon = _f[_e];
        _loop_1(demon);
    }
    // 4. Dijkstra Loop
    while (!pq.isEmpty()) {
        var _g = pq.pop(), costA = _g.cost, nameA = _g.name, maskA = _g.mask;
        if (costA > dist[nameA][maskA])
            continue;
        var fusions = forwardFusions[nameA] || [];
        for (var _h = 0, fusions_1 = fusions; _h < fusions_1.length; _h++) {
            var _j = fusions_1[_h], nameB = _j.partner, nameC = _j.result;
            var demonC = comp.getDemon(nameC);
            if (!demonC || demonC.lvl > playerState.maxLevel)
                continue;
            var nativeMaskC = getNativeSkillMask(demonC, playerState, inheritableSkills);
            for (var _k = 0, _l = activeMasks[nameB]; _k < _l.length; _k++) {
                var maskB = _l[_k];
                var costB = dist[nameB][maskB];
                var newCost = costA + costB + demonC.price;
                var combinedMask = maskA | maskB | nativeMaskC;
                if (newCost >= dist[nameC][combinedMask])
                    continue;
                var inheritedMask = (maskA | maskB) & (~nativeMaskC);
                if (!checkSlots(demonC, inheritedMask, comp, inheritableSkills))
                    continue;
                var bestA = best[nameA][maskA];
                var bestB = best[nameB][maskB];
                relax(nameC, combinedMask, newCost, {
                    demonName: nameC,
                    mask: combinedMask,
                    cost: newCost,
                    left: bestA,
                    right: bestB,
                    depth: Math.max(bestA.depth, bestB.depth) + 1,
                    isOwned: false
                });
            }
        }
    }
    // 5. Build Top Results
    var finalPaths = [];
    var targetNative = getNativeSkillMask(comp.getDemon(targetDemon), playerState, inheritableSkills);
    // Direct buy/own
    if (dist[targetDemon][ALL_SKILLS] !== Infinity) {
        var bestDirect = best[targetDemon][ALL_SKILLS];
        if (!bestDirect.left && !bestDirect.right) {
            finalPaths.push({ cost: bestDirect.cost, state: bestDirect });
        }
    }
    var targetFissions = recipeConfig.fissionCalculator.getFusions(targetDemon, comp, normalChart);
    for (var _m = 0, targetFissions_1 = targetFissions; _m < targetFissions_1.length; _m++) {
        var pair = targetFissions_1[_m];
        var nameA = pair.name1;
        var nameB = pair.name2;
        if (comp.getDemon(nameA).lvl > playerState.maxLevel || comp.getDemon(nameB).lvl > playerState.maxLevel)
            continue;
        for (var _o = 0, _p = activeMasks[nameA]; _o < _p.length; _o++) {
            var maskA = _p[_o];
            for (var _q = 0, _r = activeMasks[nameB]; _q < _r.length; _q++) {
                var maskB = _r[_q];
                if ((maskA | maskB | targetNative) === ALL_SKILLS) {
                    var inheritedMask = (maskA | maskB) & (~targetNative);
                    if (checkSlots(comp.getDemon(targetDemon), inheritedMask, comp, inheritableSkills)) {
                        var cost = dist[nameA][maskA] + dist[nameB][maskB] + comp.getDemon(targetDemon).price;
                        finalPaths.push({
                            a: best[nameA][maskA],
                            b: best[nameB][maskB],
                            cost: cost
                        });
                    }
                }
            }
        }
    }
    finalPaths.sort(function (x, y) { return x.cost - y.cost; });
    // Deduplicate
    var seenKeys = new Set();
    var uniquePaths = [];
    for (var _s = 0, finalPaths_1 = finalPaths; _s < finalPaths_1.length; _s++) {
        var p = finalPaths_1[_s];
        var key = '';
        if (p.state) {
            key = p.state.demonName + '_direct';
        }
        else {
            var a = p.a.demonName;
            var b = p.b.demonName;
            key = a < b ? "".concat(a, "_").concat(b) : "".concat(b, "_").concat(a);
        }
        if (!seenKeys.has(key)) {
            seenKeys.add(key);
            uniquePaths.push(p);
        }
    }
    var results = [];
    var rank = 1;
    var _loop_2 = function (p) {
        var rootNode = void 0;
        var demon = comp.getDemon(targetDemon);
        if (p.state) {
            rootNode = buildNodeFromDpState(p.state, requiredSkills, comp, playerState, inheritableSkills);
        }
        else {
            var leftNode = buildNodeFromDpState(p.a, inheritableSkills, comp, playerState, inheritableSkills);
            var rightNode = buildNodeFromDpState(p.b, inheritableSkills, comp, playerState, inheritableSkills);
            var reachability = evaluateDemonReachability(targetDemon, demon, playerState);
            var skillReach = requiredSkills.map(function (s) { return evaluateSkillReachability(s, targetDemon, demon, playerState); });
            rootNode = {
                demon: targetDemon,
                skillsContributed: requiredSkills,
                left: leftNode,
                right: rightNode,
                inheritMask: leftNode.inheritMask | rightNode.inheritMask,
                totalCost: p.cost,
                depth: Math.max(leftNode.depth, rightNode.depth) + 1,
                reachability: reachability,
                skillReachability: skillReach,
            };
        }
        var allBlockers = collectTreeBlockers(rootNode);
        var ahReach = ahOnlySkillNames.map(function (s) { return buildAHSkillReachability(s, comp, playerState); });
        results.push({
            rank: rank++,
            root: rootNode,
            reachabilityTier: classifyTier(allBlockers),
            totalCost: rootNode.totalCost,
            totalFusions: countFusions(rootNode),
            ownedLeafCount: countOwnedLeaves(rootNode),
            ahOnlySkills: ahReach,
            blockers: allBlockers,
        });
    };
    for (var _t = 0, _u = uniquePaths.slice(0, maxResults); _t < _u.length; _t++) {
        var p = _u[_t];
        _loop_2(p);
    }
    return results;
}
exports.searchFusionTree = searchFusionTree;
function buildNodeFromDpState(state, skillsContributed, comp, playerState, inheritableSkills) {
    var demon = comp.getDemon(state.demonName);
    var reachability = evaluateDemonReachability(state.demonName, demon, playerState);
    var skillReach = skillsContributed.map(function (s) { return evaluateSkillReachability(s, state.demonName, demon, playerState); });
    if (!state.left || !state.right) {
        return {
            demon: state.demonName,
            skillsContributed: skillsContributed,
            inheritMask: demon.inherits || 0x3FFF,
            totalCost: state.cost,
            depth: 0,
            isOwned: state.isOwned,
            reachability: reachability,
            skillReachability: skillReach
        };
    }
    // Figure out which skills flowed from left vs right
    var leftMask = state.left.mask;
    var rightMask = state.right.mask;
    var leftSkills = [];
    var rightSkills = [];
    for (var i = 0; i < inheritableSkills.length; i++) {
        if (skillsContributed.includes(inheritableSkills[i])) {
            if ((leftMask & (1 << i)) !== 0)
                leftSkills.push(inheritableSkills[i]);
            else if ((rightMask & (1 << i)) !== 0)
                rightSkills.push(inheritableSkills[i]);
        }
    }
    var leftNode = buildNodeFromDpState(state.left, leftSkills, comp, playerState, inheritableSkills);
    var rightNode = buildNodeFromDpState(state.right, rightSkills, comp, playerState, inheritableSkills);
    return {
        demon: state.demonName,
        skillsContributed: skillsContributed,
        left: leftNode,
        right: rightNode,
        inheritMask: leftNode.inheritMask | rightNode.inheritMask,
        totalCost: state.cost,
        depth: state.depth,
        reachability: reachability,
        skillReachability: skillReach
    };
}
// ---------------------------------------------------------------------------
// Reachability evaluators (unchanged logic)
// ---------------------------------------------------------------------------
function evaluateDemonReachability(demonName, demon, playerState) {
    var _a, _b;
    var blockers = [];
    if (demon.lvl > playerState.maxLevel) {
        blockers.push({ type: 'level_too_low', detail: "".concat(demonName, " (Lv ").concat(demon.lvl, ") exceeds your level (").concat(playerState.maxLevel, ")"), unlockCondition: "Reach Level ".concat(demon.lvl) });
    }
    if (demon.fusion === 'story') {
        var condition = demon.prereq || "Unlock ".concat(demonName);
        if (!playerState.unlockedFusions.includes(demonName)) {
            blockers.push({ type: 'story_locked', detail: "".concat(demonName, " requires a story unlock: \"").concat(condition, "\""), unlockCondition: condition });
        }
    }
    var hasAuction = Boolean(demon.auctions);
    var canNeg = !demon.price || demon.price === 0;
    if (!canNeg && hasAuction) {
        if (playerState.currentDay < 2) {
            blockers.push({ type: 'ah_tier_locked', detail: "Auction House not open until Day 2 (currently Day ".concat(playerState.currentDay, ")"), unlockCondition: "Reach Day 2" });
        }
        // Note: We're not doing strictly ah tier detection yet like in checkAHTierBlocker because we rely on the day here, but if we need to, we could.
    }
    var method = demon.fusion === 'story' ? { type: 'story_unlock', condition: (_a = demon.prereq) !== null && _a !== void 0 ? _a : '' }
        : canNeg ? { type: 'fusion' } // We don't have a 'negotiate' type in AcquisitionMethod right now, so we can just use 'fusion' or add it. Let's add 'negotiate' to the type if needed, but it might break angular templates if we don't update them. Let's use 'fusion' for now but it's a base case.
            : hasAuction ? { type: 'auction', tier: (_b = detectDemonAHTier(demon)) !== null && _b !== void 0 ? _b : 'basic', buyoutCost: demon.price }
                : { type: 'fusion' };
    return { demonName: demonName, method: method, isReachableNow: blockers.length === 0, blockers: blockers };
}
function evaluateSkillReachability(skillName, demonName, demon, playerState) {
    var _a;
    var skillLevel = demon.skills[skillName];
    var blockers = [];
    var method;
    var canBeInherited = true;
    if (skillLevel === undefined) {
        return { skillName: skillName, onDemon: demonName, method: { type: 'fusion' }, canBeInherited: true, isReachableNow: true, blockers: [] };
    }
    if ((0, fusion_tree_types_1.isAHExclusiveSkill)(skillLevel)) {
        canBeInherited = false;
        var tier = (_a = (0, fusion_tree_types_1.decodeAHSkillTier)(skillLevel)) !== null && _a !== void 0 ? _a : 'occult';
        method = { type: 'auction', tier: tier, buyoutCost: demon.price };
        var b = checkAHTierBlocker(tier, playerState);
        if (b) {
            blockers.push(b);
        }
    }
    else if (skillLevel <= 0.9) {
        method = { type: 'innate' };
    }
    else {
        var requiredLevel = Math.round(skillLevel);
        method = { type: 'levelup', requiredLevel: requiredLevel };
        var owned = playerState.ownedDemons.find(function (d) { return d.name === demonName; });
        if (owned && owned.currentLevel < requiredLevel) {
            blockers.push({ type: 'level_too_low', detail: "".concat(demonName, " must reach Lv ").concat(requiredLevel, " to learn ").concat(skillName), unlockCondition: "Level ".concat(demonName, " to ").concat(requiredLevel) });
        }
    }
    return { skillName: skillName, onDemon: demonName, method: method, canBeInherited: canBeInherited, isReachableNow: blockers.length === 0, blockers: blockers };
}
function classifyTier(blockers) {
    if (blockers.length === 0) {
        return 'available_now';
    }
    var hardGate = blockers.some(function (b) { return b.type === 'story_locked' || (b.type === 'ah_tier_locked' && b.detail.toLowerCase().includes('occult')); });
    return (hardGate || blockers.length > 1) ? 'later_game' : 'soon';
}
function collectTreeBlockers(node) {
    var all = __spreadArray(__spreadArray([], node.reachability.blockers, true), node.skillReachability.flatMap(function (s) { return s.blockers; }), true);
    if (node.left) {
        all.push.apply(all, collectTreeBlockers(node.left));
    }
    if (node.right) {
        all.push.apply(all, collectTreeBlockers(node.right));
    }
    return all.filter(function (b, i, a) { return a.findIndex(function (x) { return x.detail === b.detail; }) === i; });
}
function countFusions(node) {
    if (!node.left && !node.right) {
        return 0;
    }
    return 1 + (node.left ? countFusions(node.left) : 0) + (node.right ? countFusions(node.right) : 0);
}
function countOwnedLeaves(node) {
    if (!node.left && !node.right) {
        return node.isOwned ? 1 : 0;
    }
    return (node.left ? countOwnedLeaves(node.left) : 0) + (node.right ? countOwnedLeaves(node.right) : 0);
}
function isSkillAHOnly(skillName, comp) {
    var skill = comp.getSkill(skillName);
    if (!skill) {
        return false;
    }
    return skill.learnedBy.length > 0 && skill.learnedBy.every(function (e) { return (0, fusion_tree_types_1.isAHExclusiveSkill)(e.level); });
}
function buildAHSkillReachability(skillName, comp, playerState) {
    var _a, _b, _c;
    var skill = comp.getSkill(skillName);
    var first = skill === null || skill === void 0 ? void 0 : skill.learnedBy[0];
    var tier = first ? ((_a = (0, fusion_tree_types_1.decodeAHSkillTier)(first.level)) !== null && _a !== void 0 ? _a : 'occult') : 'occult';
    var demon = first ? comp.getDemon(first.demon) : null;
    var b = checkAHTierBlocker(tier, playerState);
    return { skillName: skillName, onDemon: (_b = first === null || first === void 0 ? void 0 : first.demon) !== null && _b !== void 0 ? _b : 'unknown', method: { type: 'auction', tier: tier, buyoutCost: (_c = demon === null || demon === void 0 ? void 0 : demon.price) !== null && _c !== void 0 ? _c : 0 }, canBeInherited: false, isReachableNow: !b, blockers: b ? [b] : [] };
}
function detectDemonAHTier(demon) {
    var order = ['basic', 'gold', 'platinum', 'occult'];
    var highest = null;
    for (var _i = 0, _a = Object.values(demon.skills); _i < _a.length; _i++) {
        var level = _a[_i];
        var t = (0, fusion_tree_types_1.decodeAHSkillTier)(level);
        if (t && (highest === null || order.indexOf(t) > order.indexOf(highest))) {
            highest = t;
        }
    }
    return highest;
}
function checkAHTierBlocker(tier, playerState) {
    if (playerState.ahTiersUnlocked.includes(tier)) {
        return null;
    }
    var req = fusion_tree_types_1.AH_TIER_REQUIREMENTS[tier];
    var parts = [];
    if (playerState.currentDay < req.minDay) {
        parts.push("Day ".concat(req.minDay));
    }
    return { type: 'ah_tier_locked', detail: "AH Tier requires ".concat(parts.join(' + ')), unlockCondition: "Reach ".concat(parts.join(' and ')) };
}
