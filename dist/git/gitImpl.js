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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
     * @param options
     * @param gitCommitParser
     */
    function GitImpl(options, gitCommitParser) {
        this.options = options;
        this.gitCommitParser = gitCommitParser;
        var simpleGitOptions = {
            baseDir: options.baseDir,
            binary: 'git',
            maxConcurrentProcesses: options.maxConcurrentProcesses
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
            var command, command, headHash, checkoutWorked;
            return __generator(this, function (_a) {
                try {
                    command = force ? "git checkout -f " + hash : "git checkout " + hash;
                    (0, child_process_1.execSync)(command, { cwd: this.options.baseDir });
                    //if (force) command = await this.git.checkout(hash, ["--force"]);
                    //else await this.git.checkout(hash);
                }
                catch (error) {
                    command = "git rev-parse HEAD";
                    headHash = (0, child_process_1.execSync)(command, { cwd: this.options.baseDir }).toString().split("\n")[0];
                    checkoutWorked = headHash === hash;
                    //const description = checkoutWorked ? "git checkout rejected with error, but worked" : "git checkout failed";
                    //this.logger?.log({error: description + "\nError Message:" + error.message},
                    // hash, description, "yellow");
                    if (!checkoutWorked) {
                        console.error("\x1b[31m%s\x1b[0m", "Git checkout error: " + error.message);
                        throw new Error("Git checkout failed with msg: " + error.message);
                    }
                }
                return [2 /*return*/];
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
            //commitsLines[index] = [];
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
        var lines = (0, child_process_1.execSync)(command, { cwd: this.options.baseDir }).toString().split("\n");
        return lines;
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
    GitImpl = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.gitOptions)),
        __param(1, (0, inversify_1.inject)(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.gitCommitParser)),
        __metadata("design:paramtypes", [Object, formatParser_1.FormatParser])
    ], GitImpl);
    return GitImpl;
}());
exports.GitImpl = GitImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0SW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9naXQvZ2l0SW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQ0FBNkM7QUFDN0MsMERBUW9CO0FBQ3BCLHVDQUE2QztBQUM3QyxzREFBd0U7QUFFeEUsb0NBQTBFO0FBQzFFLGtDQUFpRTtBQUVqRTs7Ozs7Ozs7OztHQVVHO0FBRUg7SUFHSTs7Ozs7Ozs7OztPQVVHO0lBQ0gsaUJBQWlGLE9BQW1CLEVBQ2QsZUFBNkI7UUFEbEMsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNkLG9CQUFlLEdBQWYsZUFBZSxDQUFjO1FBSS9HLElBQU0sZ0JBQWdCLEdBQXFCO1lBQ3ZDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztZQUN4QixNQUFNLEVBQUUsS0FBSztZQUNiLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxzQkFBc0I7U0FDekQsQ0FBQTtRQUNELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBQSxvQkFBUyxFQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7T0FHRztJQUNHLHdCQUFNLEdBQVo7Ozs7Ozs7d0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO3dCQUVoRSxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFFMUMsS0FBSyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBTzs0QkFDekMsT0FBTyxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxFQUFFLENBQUM7d0JBQzVDLENBQUMsQ0FBQyxDQUFDO3dCQUVHLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFZLEVBQUUsR0FBVzs0QkFDNUQsT0FBTyxHQUFHLElBQUksSUFB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