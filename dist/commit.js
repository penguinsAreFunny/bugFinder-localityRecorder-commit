"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
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
exports.isGitBinaryFile = exports.isGitTextFile = exports.GitFileType = exports.Commit = void 0;
var Commit = /** @class */ (function () {
    function Commit() {
    }
    /**
     * returns n predecessors of current beginning with current commit
     * @param cur
     * @param all
     * @param n
     */
    Commit.getPredecessorCommits = function (cur, all, n) {
        // @formatter:off
        var allMap = new Map(); // map of all commits. hash -> commit
        var children = new Map(); // #children of a commit:
        // map of how often commit needs to be visited in traversal
        // @formatter:on
        // init allMap
        all.forEach(function (commit) {
            allMap.set(commit.hash, commit);
        });
        /**
         * Children analysis | paths to watch from current commit
         * Goal: get a childrenMap which determines how often a commit need to be visited before
         * considering this commit as the current node for further traversal
         */
        var toVisit = [];
        var visited = new Map();
        // init
        visited.set(cur.hash, cur);
        cur.parentHashes.forEach(function (hash) {
            var commit = allMap.get(hash);
            if (commit != null)
                toVisit.push(allMap.get(hash));
        });
        children.set(cur.hash, 1);
        while (toVisit.length > 0) {
            var curAncestor = toVisit.pop();
            var visits = children.get(curAncestor.hash);
            children.set(curAncestor.hash, visits == null ? 1 : visits + 1);
            // do not visit ancestors if node is already visited | this node is visited from another path
            if (visited.get(curAncestor.hash)) {
                visited.set(curAncestor.hash, curAncestor);
                continue;
            }
            visited.set(curAncestor.hash, curAncestor);
            curAncestor.parentHashes.forEach(function (hash) {
                var commit = allMap.get(hash);
                if (commit != null)
                    toVisit.push(allMap.get(hash));
            });
        }
        var predecessors = this._traverseIterative(cur, allMap, children);
        if (predecessors.length <= n) {
            return predecessors;
        }
        return predecessors.slice(0, n);
    };
    /**
     * Optimized iterative algorithm for git log graph traversion.
     * Returns n > all? all: n ancestor-commits of cur-commit.
     * @param cur
     * @param all
     * @param ancestors map of hash of a commit to their number of children commits
     */
    Commit._traverseIterative = function (cur, all, ancestors) {
        // @formatter:off
        var curCommit = cur;
        var path = [cur];
        var toVisit = [];
        var visitsLeftByChildren = new Map(ancestors); // copy map because map will be changed!
        // @formatter:on
        // init
        curCommit.parentHashes.forEach(function (hash) {
            var commit = all.get(hash);
            if (commit != null)
                toVisit.push(all.get(hash));
        });
        // cur commit should be visited once and directly written to result path
        ancestors.set(curCommit.hash, 1);
        while (toVisit.length > 0) {
            curCommit = toVisit.pop();
            var visitsLeft = visitsLeftByChildren.get(curCommit.hash);
            visitsLeftByChildren.set(curCommit.hash, visitsLeft - 1);
            if (visitsLeft > 1) {
                continue;
            }
            path.push(curCommit);
            curCommit.parentHashes.forEach(function (hash) {
                var commit = all.get(hash);
                if (commit != null)
                    toVisit.push(all.get(hash));
            });
        }
        return path;
    };
    /**
     * Recursive traversion implementation. This algorithm is not optimized especially for node v8 application.
     * Consider using the _traverse-algorithm instead of this. There are small differences between these two algorithms
     * as the iterative version only return direct ancestors of the current commit and does not iterate the whole
     * historic graph.
     * @param cur
     * @param all
     * @param visited
     */
    Commit._traverseRecursive = function (cur, all, visited) {
        var _this = this;
        var _a, _b;
        if (visited.get(cur.hash) != null)
            return [];
        visited.set(cur.hash, cur);
        if (((_a = cur.parentHashes) === null || _a === void 0 ? void 0 : _a.length) === 0)
            return [cur];
        var paths = [];
        (_b = cur.parentHashes) === null || _b === void 0 ? void 0 : _b.forEach(function (hash, index) {
            var nextCommit = all.get(hash);
            if (nextCommit == undefined) {
                console.log("Could not find commit for parent-hash " + hash + ". You need to provide all commits to be able\n                to reconstruct commit history");
            }
            paths[index] = _this._traverseRecursive(nextCommit, all, visited);
        });
        return __spreadArray([cur], __read(paths.reverse().reduce(function (accumulator, currentValue) {
            return __spreadArray(__spreadArray([], __read(accumulator), false), __read(currentValue), false);
        })), false);
    };
    Commit.prototype.is = function (other) {
        return this.hash === other.hash;
    };
    Commit.prototype.key = function () {
        return this.hash;
    };
    Commit.prototype.setMethods = function (localityDTO) {
        localityDTO.is = Commit.prototype.is;
        localityDTO.key = Commit.prototype.key;
        localityDTO.setMethods = Commit.prototype.setMethods;
    };
    return Commit;
}());
exports.Commit = Commit;
var GitFileType;
(function (GitFileType) {
    GitFileType[GitFileType["modified"] = 0] = "modified";
    GitFileType[GitFileType["added"] = 1] = "added";
    GitFileType[GitFileType["deleted"] = 2] = "deleted";
    GitFileType[GitFileType["other"] = 3] = "other";
})(GitFileType = exports.GitFileType || (exports.GitFileType = {}));
function isGitTextFile(file) {
    var textFile = file;
    return typeof textFile.changes === "number" && typeof textFile.insertions === "number"
        && typeof textFile.deletions === "number";
}
exports.isGitTextFile = isGitTextFile;
function isGitBinaryFile(file) {
    var binaryFile = file;
    return typeof binaryFile.after === "number" && typeof binaryFile.before === "number";
}
exports.isGitBinaryFile = isGitBinaryFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbW1pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7SUFBQTtJQTBOQSxDQUFDO0lBeE5HOzs7OztPQUtHO0lBQ0ksNEJBQXFCLEdBQTVCLFVBQTZCLEdBQVcsRUFBRSxHQUFhLEVBQUUsQ0FBUztRQUM5RCxpQkFBaUI7UUFDakIsSUFBTSxNQUFNLEdBQU0sSUFBSSxHQUFHLEVBQWtCLENBQUMsQ0FBQyxxQ0FBcUM7UUFDbEYsSUFBTSxRQUFRLEdBQUksSUFBSSxHQUFHLEVBQWtCLENBQUMsQ0FBQyx5QkFBeUI7UUFDekIsMkRBQTJEO1FBQ3hHLGdCQUFnQjtRQUVoQixjQUFjO1FBQ2QsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU07WUFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFFSDs7OztXQUlHO1FBQ0gsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQU0sT0FBTyxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO1FBRTFDLE9BQU87UUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0IsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO1lBQ3pCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxNQUFNLElBQUksSUFBSTtnQkFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQTtRQUNGLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUks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