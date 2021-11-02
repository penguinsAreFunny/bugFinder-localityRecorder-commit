"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitImpl = void 0;
var child_process_1 = require("child_process");
var simple_git_1 = __importDefault(require("simple-git"));
var inversify_1 = require("inversify");
var formatParser_1 = require("./parser/formatParser");
var commit_1 = require("../commit");
var TYPES_1 = require("../TYPES");
/**
 * GitTool utility class
 * Used git-version: 2.19.1.windows.1
 * @usage const options: SimpleGitOptions = {
 *          baseDir: "../Repositories/Typescript",
 *          binary: 'git',
 *          maxConcurrentProcesses: 4
 *      }
 *      gitContainer.bind<SimpleGitOptions>(API_TYPES.SimpleGitOptions).toConstantValue(options)
 *      const git: GitTool = gitContainer.get<GitTool>(API_TYPES.Git)
 */
var GitImpl = /** @class */ (function () {
    /**
     * @usage const options: GitOptions = {
     *          baseDir: "../Repositories/Typescript",
     *          maxConcurrentProcesses: 4,
     *          ignoreMergeCommits: true
     *      }
     *      gitContainer.bind<SimpleGitOptions>(API_TYPES.GitOptions).toConstantValue(options)
     *      const git: GitTool = gitContainer.get<GitTool>(API_TYPES.Git)
     */
    function GitImpl() {
        this.gitCommitParser = new formatParser_1.FormatParser();
        var simpleGitOptions = {
            baseDir: this.options.baseDir,
            binary: 'git',
            maxConcurrentProcesses: this.options.maxConcurrentProcesses
        };
        this.git = (0, simple_git_1.default)(simpleGitOptions);
    }
    /**
     * Returns the parsed log as an array of GitCommits
     * @See GitCommit
     */
    GitImpl.prototype.logAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var format, flags, flagsStringified, log, simpleCommits, command, prettyFormatLog, commits, parsedCommits, commitsFromFirstToLast, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Running GitTool.logAll. This might take a few minutes.");
                        format = this.gitCommitParser.gitFormat();
                        flags = ["--stat=4096"].filter(function (element) {
                            return element != null && element != "";
                        });
                        flagsStringified = flags.reduce(function (prev, cur) {
                            return cur != null ? prev + " " + cur : prev;
                        });
                        return [4 /*yield*/, this.git.log(flags)];
                    case 1:
                        log = _a.sent();
                        simpleCommits = log.all;
                        command = "git log --name-status -r " + flagsStringified + " --pretty=format:\"" + format + "\"";
                        prettyFormatLog = (0, child_process_1.execSync)(command, {
                            cwd: this.options.baseDir,
                            maxBuffer: 1024 * 1024 * 1024 * 4
                        }).toString();
                        commits = this.splitLogIntoCommits(prettyFormatLog, formatParser_1.BEGIN_COMMIT_MARKER);
                        parsedCommits = new Map();
                        commits.forEach(function (commit) {
                            var parsedCommit = _this.gitCommitParser.parse(commit);
                            parsedCommits.set(parsedCommit.hash, parsedCommit);
                        });
                        simpleCommits.forEach(function (simpleCommit) {
                            var _a, _b, _c, _d, _e;
                            var parsedCommit = parsedCommits.get(simpleCommit.hash);
                            if (!parsedCommit) {
                                console.warn("GitTool.logAll: Could not find commit " + simpleCommit.hash + " in parsed commits.\n                    This commit will not be parsed and returned. This might be an internal fault. Please check\n                    whether " + simpleCommit.hash + " is important and expected in the results in your use case.");
                                return;
                            }
                            // add simpleCommit diff parsed information into parsed commit
                            // @formatter:off
                            parsedCommit.files.changed = (_a = simpleCommit.diff) === null || _a === void 0 ? void 0 : _a.changed;
                            parsedCommit.files.insertions = (_b = simpleCommit.diff) === null || _b === void 0 ? void 0 : _b.insertions;
                            parsedCommit.files.deletions = (_c = simpleCommit.diff) === null || _c === void 0 ? void 0 : _c.deletions;
                            // @formatter:on
                            // add simpleCommit diff.files parsed information into parsedCommit
                            (_e = (_d = simpleCommit.diff) === null || _d === void 0 ? void 0 : _d.files) === null || _e === void 0 ? void 0 : _e.forEach(function (file) {
                                var modifiedFileMatch = parsedCommit.files.files.find(function (modifiedFile) {
                                    return modifiedFile.path === file.file && modifiedFile.type === commit_1.GitFileType.modified;
                                });
                                var addedFileMatch = parsedCommit.files.files.find(function (addedFile) {
                                    return addedFile.path === file.file && addedFile.type === commit_1.GitFileType.added;
                                });
                                var deletedFileMatch = parsedCommit.files.files.find(function (deletedFile) {
                                    return deletedFile.path === file.file && deletedFile.type === commit_1.GitFileType.deleted;
                                });
                                // @formatter:off
                                var binaryFile = file;
                                var textFile = file;
                                // set values for binary path match
                                if (typeof binaryFile.after === "number" && typeof binaryFile.before === "number") {
                                    var setBinaryValues = function (fileDest, fileSrc) {
                                        fileDest.after = fileSrc.after;
                                        fileDest.before = fileSrc.before;
                                    };
                                    var binaryModifiedFile = modifiedFileMatch;
                                    var binaryAddedFile = addedFileMatch;
                                    var binaryDeletedFile = deletedFileMatch;
                                    if (binaryModifiedFile)
                                        setBinaryValues(binaryModifiedFile, binaryFile);
                                    if (binaryAddedFile)
                                        setBinaryValues(binaryAddedFile, binaryFile);
                                    if (binaryDeletedFile)
                                        setBinaryValues(binaryDeletedFile, binaryFile);
                                    // set values for other files than modified, added or deleted files
                                    if (!modifiedFileMatch && !addedFileMatch && !deletedFileMatch) {
                                        var binaryFileFound = {
                                            path: binaryFile.file,
                                            type: commit_1.GitFileType.other,
                                            before: binaryFile.before,
                                            after: binaryFile.after
                                        };
                                        parsedCommit.files.files.push(binaryFileFound);
                                    }
                                }
                                // @formatter:on
                                // @formatter:off
                                // set values for text path match
                                if (typeof textFile.changes === "number" && typeof textFile.deletions === "number"
                                    && typeof textFile.insertions === "number") {
                                    var setTextValues = function (fileDest, fileSrc) {
                                        fileDest.deletions = fileSrc.deletions;
                                        fileDest.insertions = fileSrc.insertions;
                                        fileDest.changes = fileSrc.changes;
                                    };
                                    var textModifiedFile = modifiedFileMatch;
                                    var textAddedFile = addedFileMatch;
                                    var textDeletedFile = deletedFileMatch;
                                    if (textModifiedFile)
                                        setTextValues(textModifiedFile, textFile);
                                    if (textAddedFile)
                                        setTextValues(textAddedFile, textFile);
                                    if (textDeletedFile)
                                        setTextValues(textDeletedFile, textFile);
                                    // set values for other files than modified, added or deleted files
                                    if (!modifiedFileMatch && !addedFileMatch && !deletedFileMatch) {
                                        var textFileFound = {
                                            path: textFile.file,
                                            type: commit_1.GitFileType.other,
                                            deletions: textFile.deletions,
                                            insertions: textFile.insertions,
                                            changes: textFile.changes
                                        };
                                        parsedCommit.files.files.push(textFileFound);
                                    }
                                }
                                // @formatter:on
                            });
                        });
                        commitsFromFirstToLast = Array.from(parsedCommits.values()).reverse();
                        for (i = 0; i < commitsFromFirstToLast.length; i++) {
                            commitsFromFirstToLast[i].order = i;
                        }
                        return [2 /*return*/, Promise.resolve(commitsFromFirstToLast)];
                }
            });
        });
    };
    GitImpl.prototype.checkout = function (hash, force) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1, command, headHash, checkoutWorked;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!force) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.git.checkout(hash, ["--force"])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.git.checkout(hash)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        command = "git rev-parse HEAD";
                        headHash = (0, child_process_1.execSync)(command, { cwd: this.options.baseDir }).toString().split("\n")[0];
                        checkoutWorked = headHash === hash;
                        if (!checkoutWorked) {
                            console.error("\x1b[31m%s\x1b[0m", "Git checkout error: " + error_1.message);
                            throw new Error("Git checkout failed with msg: " + error_1.message);
                        }
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    GitImpl.prototype.MADFiles = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var gitDiffLines, modifiedFiles, addedFiles, deletedFiles, rmFirstTwoChars;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changedFiles(hash)];
                    case 1:
                        gitDiffLines = _a.sent();
                        modifiedFiles = this.getLine(gitDiffLines, "\tM");
                        addedFiles = this.getLine(gitDiffLines, "\tA");
                        deletedFiles = this.getLine(gitDiffLines, "\tD");
                        rmFirstTwoChars = function (lines) {
                            return lines.map(function (line) {
                                return line.slice(2, line.length);
                            });
                        };
                        // @Formatter:off
                        return [2 /*return*/, Promise.resolve({
                                modifiedFiles: rmFirstTwoChars(modifiedFiles),
                                addedFiles: rmFirstTwoChars(addedFiles),
                                deletedFiles: rmFirstTwoChars(deletedFiles)
                            })];
                }
            });
        });
    };
    /**
     * Returns all modified files of a commit
     * @param hash
     */
    GitImpl.prototype.modifiedFiles = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var lineMatcher;
            return __generator(this, function (_a) {
                lineMatcher = "M\t";
                return [2 /*return*/, this.fileParser(hash, lineMatcher)];
            });
        });
    };
    /**
     * Returns all modified files of a commit
     * @param hash
     */
    GitImpl.prototype.modifiedFilesSync = function (hash) {
        var lineMatcher = "M\t";
        return this.fileParserSync(hash, lineMatcher);
    };
    /**
     * Returns all added files of a commit
     * @param hash
     */
    GitImpl.prototype.addedFiles = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var lineMatcher;
            return __generator(this, function (_a) {
                lineMatcher = "A\t";
                return [2 /*return*/, this.fileParser(hash, lineMatcher)];
            });
        });
    };
    /**
     * Returns all added files of a commit
     * @param hash
     */
    GitImpl.prototype.addedFilesSync = function (hash) {
        var lineMatcher = "A\t";
        return this.fileParserSync(hash, lineMatcher);
    };
    /**
     * Returns all deleted files of a certain commit
     * @param hash
     */
    GitImpl.prototype.deletedFiles = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var lineMatcher;
            return __generator(this, function (_a) {
                lineMatcher = "D\t";
                return [2 /*return*/, this.fileParser(hash, lineMatcher)];
            });
        });
    };
    /**
     * Returns all deleted files of a certain commit
     * @param hash
     */
    GitImpl.prototype.deletedFilesSync = function (hash) {
        var lineMatcher = "D\t";
        return this.fileParserSync(hash, lineMatcher);
    };
    /**
     * Returns all commits from a log formated with each commit beginning with beginCommitMarker
     * @param log
     * @param beginCommitMarker
     * @private
     */
    GitImpl.prototype.splitLogIntoCommits = function (log, beginCommitMarker) {
        var lines = log.split("\n");
        var idxes = [];
        var commitsLines = [];
        lines.forEach(function (line, index) {
            if (line.match(beginCommitMarker)) {
                idxes.push(index);
            }
        });
        idxes.forEach(function (idx, index) {
            var nextIndex = index + 1 >= idxes.length ? lines.length : idxes[index + 1];
            commitsLines[index] = lines.slice(idx + 1, nextIndex);
        });
        return commitsLines.map(function (commitLines) {
            return commitLines.join("\n");
        });
    };
    /**
     * Returns all deleted | modified | added files of a certain commit
     * @param hash
     * @param lineMatcher
     */
    GitImpl.prototype.fileParser = function (hash, lineMatcher) {
        return __awaiter(this, void 0, void 0, function () {
            var gitDiffLines, files, rmFirstTwoChars;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changedFiles(hash)];
                    case 1:
                        gitDiffLines = _a.sent();
                        files = this.getLine(gitDiffLines, lineMatcher);
                        rmFirstTwoChars = function (lines) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, Promise.resolve(lines.map(function (line) {
                                        return line.slice(2, line.length);
                                    }))];
                            });
                        }); };
                        return [2 /*return*/, rmFirstTwoChars(files)];
                }
            });
        });
    };
    /**
     * Returns all deleted | modified | added files of a certain commit
     * @param hash
     * @param lineMatcher
     */
    GitImpl.prototype.fileParserSync = function (hash, lineMatcher) {
        var gitDiffLines = this.changedFilesSync(hash);
        var files = this.getLine(gitDiffLines, lineMatcher);
        /**
         * Removes first two character in each line.
         * Used for deletion of annotations returned by git diff
         * @example
         * lines:   ['M\tsrc/compiler/checker.ts',  'D\tsrc/compiler/types.ts']
         * return:  [   'src/compiler/checker.ts',     'src/compiler/types.ts']
         * @param lines
         */
        var rmFirstTwoChars = function (lines) {
            return lines.map(function (line) {
                return line.slice(2, line.length);
            });
        };
        return rmFirstTwoChars(files);
    };
    /**
     * Returns a string array containing the git diff with modified, deleted and added files.
     * @example return value:
     * ['M\tsrc/compiler/checker.ts',
     * 'A\ttests/baselines/reference/api/tsserverlibrary.d.ts',
     * 'A\ttests/baselines/reference/api/typescript.d.ts',
     * 'D\ttests/cases/fourslash/codeFixClassImplementInterface_noUndefinedOnOptionalParameter.ts']
     * @param hash
     */
    GitImpl.prototype.changedFilesSync = function (hash) {
        // "M   src/compiler/diagnosticMessages.json"   MODIFIED
        // "A   ..."                                    ADDED
        // "D   ..."                                    DELETED
        var command = "git diff-tree --no-commit-id --name-status -r " + hash;
        return (0, child_process_1.execSync)(command, { cwd: this.options.baseDir }).toString().split("\n");
    };
    /**
     * Async version of changedFilesSync
     * Returns a string array containing the git diff with modified, deleted and added files.
     * @example return value:
     * ['M\tsrc/compiler/checker.ts',
     * 'A\ttests/baselines/reference/api/tsserverlibrary.d.ts',
     * 'A\ttests/baselines/reference/api/typescript.d.ts',
     * 'D\ttests/cases/fourslash/codeFixClassImplementInterface_noUndefinedOnOptionalParameter.ts']
     * @param hash
     */
    GitImpl.prototype.changedFiles = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var command, gitDiff, chunks;
            return __generator(this, function (_a) {
                command = "git diff-tree --no-commit-id --name-status -r " + hash;
                gitDiff = (0, child_process_1.exec)(command, { cwd: this.options.baseDir, maxBuffer: 1024 * 1024 * 256 });
                chunks = [];
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        gitDiff.on("data", function (chunk) { return chunks.push(chunk); });
                        gitDiff.on("error", reject);
                        gitDiff.on("end", function () { return resolve(Buffer.concat(chunks).toString().split("\n")); });
                    })];
            });
        });
    };
    /**
     * Returns all lines matching the matcher
     * @param lines
     * @param matcher
     */
    GitImpl.prototype.getLine = function (lines, matcher) {
        var isMatched = function (line) {
            return line.match(matcher);
        };
        return lines.filter(isMatched);
    };
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.gitOptions),
        __metadata("design:type", Object)
    ], GitImpl.prototype, "options", void 0);
    __decorate([
        (0, inversify_1.optional)(),
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.gitCommitParser),
        __metadata("design:type", formatParser_1.FormatParser)
    ], GitImpl.prototype, "gitCommitParser", void 0);
    GitImpl = __decorate([
        (0, inversify_1.injectable)(),
        __metadata("design:paramtypes", [])
    ], GitImpl);
    return GitImpl;
}());
exports.GitImpl = GitImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0SW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9naXQvZ2l0SW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQ0FBNkM7QUFDN0MsMERBUW9CO0FBQ3BCLHVDQUF1RDtBQUN2RCxzREFBd0U7QUFFeEUsb0NBQTBFO0FBQzFFLGtDQUFpRTtBQUVqRTs7Ozs7Ozs7OztHQVVHO0FBRUg7SUFPSTs7Ozs7Ozs7T0FRRztJQUNIO1FBVlMsb0JBQWUsR0FBaUIsSUFBSSwyQkFBWSxFQUFFLENBQUE7UUFZdkQsSUFBTSxnQkFBZ0IsR0FBcUI7WUFDdkMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTztZQUM3QixNQUFNLEVBQUUsS0FBSztZQUNiLHNCQUFzQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCO1NBQzlELENBQUE7UUFDRCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUEsb0JBQVMsRUFBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7O09BR0c7SUFDRyx3QkFBTSxHQUFaOzs7Ozs7O3dCQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0RBQXdELENBQUMsQ0FBQzt3QkFFaEUsTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBRTFDLEtBQUssR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLE9BQU87NEJBQ3pDLE9BQU8sT0FBTyxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksRUFBRSxDQUFDO3dCQUM1QyxDQUFDLENBQUMsQ0FBQzt3QkFFRyxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBWSxFQUFFLEdBQVc7NEJBQzVELE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxH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