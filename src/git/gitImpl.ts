import {exec, execSync} from 'child_process';
import simpleGit, {
    DefaultLogFields,
    DiffResultBinaryFile,
    DiffResultTextFile,
    ListLogLine,
    ListLogSummary,
    SimpleGit,
    SimpleGitOptions
} from 'simple-git';
import {inject, injectable} from "inversify";
import {BEGIN_COMMIT_MARKER, FormatParser} from "./parser/formatParser";
import {Git, GitOptions} from "../git";
import {Commit, GitBinaryFile, GitFileType, GitTextFile} from "../commit";
import {BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES} from "../TYPES";

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
@injectable()
export class GitImpl implements Git {
    private git: SimpleGit;

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
    constructor(@inject(BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.gitOptions) readonly options: GitOptions,
                @inject(BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.gitCommitParser) readonly gitCommitParser: FormatParser,
                //@inject(API_TYPES.logger) @optional() readonly logger?: CommitLogger
                ) {

        const simpleGitOptions: SimpleGitOptions = {
            baseDir: options.baseDir,
            binary: 'git',
            maxConcurrentProcesses: options.maxConcurrentProcesses
        }
        this.git = simpleGit(simpleGitOptions);
    }

    /**
     * Returns the parsed log as an array of GitCommits
     * @See GitCommit
     */
    async logAll(): Promise<Commit[]> {
        console.log("Running GitTool.logAll. This might take a few minutes.");

        const format = this.gitCommitParser.gitFormat();

        const flags = ["--stat=4096"].filter((element) => {
            return element != null && element != "";
        });

        const flagsStringified = flags.reduce((prev: string, cur: string) => {
            return cur != null ? prev + " " + cur : prev;
        });

        const log: ListLogSummary<DefaultLogFields> = await this.git.log(flags);
        const simpleCommits: readonly (DefaultLogFields & ListLogLine)[] = log.all;

        // @see: https://git-scm.com/docs/pretty-formats especially placeholders that expand to information
        // extracted from the commit
        // git show head --name-status --pretty=format:"CommitMarker%n%H%n"
        // "M   src/compiler/diagnosticMessages.json"   MODIFIED
        // "A   ..."                                    ADDED
        // "D   ..."                                    DELETED
        const command = `git log --name-status -r ${flagsStringified} --pretty=format:"${format}"`;

        const prettyFormatLog = execSync(command, {
            cwd: this.options.baseDir,
            maxBuffer: 1024 * 1024 * 1024 * 4
        }).toString();


        // split into commits
        const commits: string[] = this.splitLogIntoCommits(prettyFormatLog, BEGIN_COMMIT_MARKER);

        // parse
        const parsedCommits = new Map<string, Commit>();
        commits.forEach(commit => {
            const parsedCommit = this.gitCommitParser.parse(commit);
            parsedCommits.set(parsedCommit.hash, parsedCommit);
        })

        simpleCommits.forEach(simpleCommit => {
            const parsedCommit = parsedCommits.get(simpleCommit.hash);
            if (!parsedCommit) {
                console.warn(`GitTool.logAll: Could not find commit ${simpleCommit.hash} in parsed commits.
                    This commit will not be parsed and returned. This might be an internal fault. Please check
                    whether ${simpleCommit.hash} is important and expected in the results in your use case.`);
                return;
            }

            // add simpleCommit diff parsed information into parsed commit
            // @formatter:off
            parsedCommit.files.changed      = simpleCommit.diff?.changed;
            parsedCommit.files.insertions   = simpleCommit.diff?.insertions;
            parsedCommit.files.deletions    = simpleCommit.diff?.deletions;
            // @formatter:on

            // add simpleCommit diff.files parsed information into parsedCommit
            simpleCommit.diff?.files?.forEach((file: (DiffResultTextFile | DiffResultBinaryFile)) => {

                const modifiedFileMatch = parsedCommit.files.files.find(modifiedFile => {
                    return modifiedFile.path === file.file && modifiedFile.type === GitFileType.modified;
                });

                const addedFileMatch = parsedCommit.files.files.find(addedFile => {
                    return addedFile.path === file.file && addedFile.type === GitFileType.added;
                });

                const deletedFileMatch = parsedCommit.files.files.find(deletedFile => {
                    return deletedFile.path === file.file && deletedFile.type === GitFileType.deleted;
                });

                // @formatter:off
                const binaryFile    = file as DiffResultBinaryFile;
                const textFile      = file as DiffResultTextFile;

                // set values for binary path match
                if (typeof binaryFile.after === "number" && typeof binaryFile.before === "number") {

                    const setBinaryValues = (fileDest: GitBinaryFile, fileSrc: DiffResultBinaryFile) => {
                        fileDest.after  = fileSrc.after;
                        fileDest.before = fileSrc.before;
                    }

                    const binaryModifiedFile    = modifiedFileMatch as GitBinaryFile;
                    const binaryAddedFile       = addedFileMatch    as GitBinaryFile;
                    const binaryDeletedFile     = deletedFileMatch  as GitBinaryFile;

                    if (binaryModifiedFile)  setBinaryValues(binaryModifiedFile, binaryFile);
                    if (binaryAddedFile)     setBinaryValues(binaryAddedFile,    binaryFile);
                    if (binaryDeletedFile)   setBinaryValues(binaryDeletedFile,  binaryFile);

                    // set values for other files than modified, added or deleted files
                    if (!modifiedFileMatch && !addedFileMatch && !deletedFileMatch) {
                        const binaryFileFound: GitBinaryFile = {
                            path:   binaryFile.file,
                            type:   GitFileType.other,
                            before: binaryFile.before,
                            after:  binaryFile.after
                        }
                        parsedCommit.files.files.push(binaryFileFound);
                    }
                }
                // @formatter:on

                // @formatter:off
                // set values for text path match
                if (typeof textFile.changes === "number" && typeof textFile.deletions === "number"
                    && typeof textFile.insertions === "number") {

                    const setTextValues = (fileDest: GitTextFile, fileSrc: DiffResultTextFile) => {
                        fileDest.deletions  = fileSrc.deletions;
                        fileDest.insertions = fileSrc.insertions;
                        fileDest.changes    = fileSrc.changes;
                    }

                    const textModifiedFile  = modifiedFileMatch as GitTextFile;
                    const textAddedFile     = addedFileMatch    as GitTextFile;
                    const textDeletedFile   = deletedFileMatch  as GitTextFile;

                    if (textModifiedFile)   setTextValues(textModifiedFile, textFile)
                    if (textAddedFile)      setTextValues(textAddedFile,    textFile)
                    if (textDeletedFile)    setTextValues(textDeletedFile,  textFile)

                    // set values for other files than modified, added or deleted files
                    if (!modifiedFileMatch && ! addedFileMatch && !deletedFileMatch) {
                        const textFileFound: GitTextFile = {
                            path:       textFile.file,
                            type:       GitFileType.other,
                            deletions:  textFile.deletions,
                            insertions: textFile.insertions,
                            changes:    textFile.changes
                        }
                        parsedCommit.files.files.push(textFileFound);
                    }
                }
                // @formatter:on
            });
        });

        const commitsFromFirstToLast = Array.from(parsedCommits.values()).reverse();
        for(let i = 0; i < commitsFromFirstToLast.length; i++){
            commitsFromFirstToLast[i].order = i;
        }
        return Promise.resolve(commitsFromFirstToLast);
    }

    public async checkout(hash: string, force?: boolean) {
        try {
            if (force) await this.git.checkout(hash, ["--force"]);
            else await this.git.checkout(hash);
        } catch (error) {
            const command = "git rev-parse HEAD"
            const headHash = execSync(command, {cwd: this.options.baseDir}).toString().split("\n")[0];
            const checkoutWorked = headHash === hash;
            //const description = checkoutWorked ? "git checkout rejected with error, but worked" : "git checkout failed";
            //this.logger?.log({error: description + "\nError Message:" + error.message},
               // hash, description, "yellow");
            if (!checkoutWorked) {
                console.error("\x1b[31m%s\x1b[0m", `Git checkout error: ${error.message}`);
                throw new Error(`Git checkout failed with msg: ${error.message}`);
            }
        }
    }

    public async MADFiles(hash: string): Promise<{ modifiedFiles: string[]; addedFiles: string[]; deletedFiles: string[] }> {
        // @formatter:off
        const gitDiffLines  = await this.changedFiles(hash);
        const modifiedFiles = this.getLine(gitDiffLines, "\tM");
        const addedFiles    = this.getLine(gitDiffLines, "\tA");
        const deletedFiles  = this.getLine(gitDiffLines, "\tD");
        // @formatter:on
        /**
         * Removes first two character in each line.
         * Used for deletion of annotations returned by git diff
         * @example
         * lines:   ['M\tsrc/compiler/checker.ts',  'D\tsrc/compiler/types.ts']
         * return:  [   'src/compiler/checker.ts',     'src/compiler/types.ts']
         * @param lines
         */
        const rmFirstTwoChars = (lines: string[]) => {
            return lines.map((line: string) => {
                return line.slice(2, line.length);
            })
        }

        // @Formatter:off
        return Promise.resolve({
            modifiedFiles:  rmFirstTwoChars(modifiedFiles),
            addedFiles:     rmFirstTwoChars(addedFiles),
            deletedFiles:   rmFirstTwoChars(deletedFiles)
        });
        // @Formatter:on
    }

    /**
     * Returns all modified files of a commit
     * @param hash
     */
    public async modifiedFiles(hash: string): Promise<string[]> {
        const lineMatcher = "M\t";
        return this.fileParser(hash, lineMatcher);
    }

    /**
     * Returns all modified files of a commit
     * @param hash
     */
    public modifiedFilesSync(hash: string): string[] {
        const lineMatcher = "M\t";
        return this.fileParserSync(hash, lineMatcher);
    }

    /**
     * Returns all added files of a commit
     * @param hash
     */
    public async addedFiles(hash: string): Promise<string[]> {
        const lineMatcher = "A\t";
        return this.fileParser(hash, lineMatcher);
    }

    /**
     * Returns all added files of a commit
     * @param hash
     */
    public addedFilesSync(hash: string): string[] {
        const lineMatcher = "A\t";
        return this.fileParserSync(hash, lineMatcher);
    }

    /**
     * Returns all deleted files of a certain commit
     * @param hash
     */
    public async deletedFiles(hash: string): Promise<string[]> {
        const lineMatcher = "D\t";
        return this.fileParser(hash, lineMatcher);
    }

    /**
     * Returns all deleted files of a certain commit
     * @param hash
     */
    public deletedFilesSync(hash: string): string[] {
        const lineMatcher = "D\t";
        return this.fileParserSync(hash, lineMatcher);
    }


    /**
     * Returns all commits from a log formated with each commit beginning with beginCommitMarker
     * @param log
     * @param beginCommitMarker
     * @private
     */
    private splitLogIntoCommits(log: string, beginCommitMarker: string): string[] {
        const lines = log.split("\n");
        const idxes: number[] = [];
        const commitsLines: string[][] = [];

        lines.forEach((line, index) => {
            if (line.match(beginCommitMarker)) {
                idxes.push(index);
            }
        })

        idxes.forEach((idx, index) => {
            const nextIndex = index + 1 >= idxes.length ? lines.length : idxes[index + 1];
            //commitsLines[index] = [];
            commitsLines[index] = lines.slice(idx + 1, nextIndex);
        })

        return commitsLines.map(commitLines => {
            return commitLines.join("\n");
        });
    }

    /**
     * Returns all deleted | modified | added files of a certain commit
     * @param hash
     * @param lineMatcher
     */
    private async fileParser(hash: string, lineMatcher: "D\t" | "M\t" | "A\t"): Promise<string[]> {
        const gitDiffLines = await this.changedFiles(hash);
        const files = this.getLine(gitDiffLines, lineMatcher);

        /**
         * Removes first two character in each line.
         * Used for deletion of annotations returned by git diff
         * @example
         * lines:   ['M\tsrc/compiler/checker.ts',  'D\tsrc/compiler/types.ts']
         * return:  [   'src/compiler/checker.ts',     'src/compiler/types.ts']
         * @param lines
         */
        const rmFirstTwoChars = async (lines: string[]) => {
            return Promise.resolve(
                lines.map((line: string) => {
                    return line.slice(2, line.length);
                })
            );
        }

        return rmFirstTwoChars(files);
    }

    /**
     * Returns all deleted | modified | added files of a certain commit
     * @param hash
     * @param lineMatcher
     */
    private fileParserSync(hash: string, lineMatcher: "D\t" | "M\t" | "A\t"): string[] {
        const gitDiffLines = this.changedFilesSync(hash);
        const files = this.getLine(gitDiffLines, lineMatcher);

        /**
         * Removes first two character in each line.
         * Used for deletion of annotations returned by git diff
         * @example
         * lines:   ['M\tsrc/compiler/checker.ts',  'D\tsrc/compiler/types.ts']
         * return:  [   'src/compiler/checker.ts',     'src/compiler/types.ts']
         * @param lines
         */
        const rmFirstTwoChars = (lines: string[]) => {
            return lines.map((line: string) => {
                return line.slice(2, line.length);
            });
        }

        return rmFirstTwoChars(files);
    }

    /**
     * Returns a string array containing the git diff with modified, deleted and added files.
     * @example return value:
     * ['M\tsrc/compiler/checker.ts',
     * 'A\ttests/baselines/reference/api/tsserverlibrary.d.ts',
     * 'A\ttests/baselines/reference/api/typescript.d.ts',
     * 'D\ttests/cases/fourslash/codeFixClassImplementInterface_noUndefinedOnOptionalParameter.ts']
     * @param hash
     */
    private changedFilesSync(hash: string): string[] {
        // "M   src/compiler/diagnosticMessages.json"   MODIFIED
        // "A   ..."                                    ADDED
        // "D   ..."                                    DELETED
        const command = `git diff-tree --no-commit-id --name-status -r ${hash}`;
        const lines = execSync(command, {cwd: this.options.baseDir}).toString().split("\n")
        return lines;
    }

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
    private async changedFiles(hash: string): Promise<string[]> {
        // "M   src/compiler/diagnosticMessages.json"   MODIFIED
        // "A   ..."                                    ADDED
        // "D   ..."                                    DELETED
        const command = `git diff-tree --no-commit-id --name-status -r ${hash}`;
        const gitDiff = exec(command, {cwd: this.options.baseDir, maxBuffer: 1024 * 1024 * 256});

        const chunks = [];
        return new Promise((resolve, reject) => {
            gitDiff.on("data", chunk => chunks.push(chunk));
            gitDiff.on("error", reject);
            gitDiff.on("end", () => resolve(Buffer.concat(chunks).toString().split("\n")));
        });

    }

    /**
     * Returns all lines matching the matcher
     * @param lines
     * @param matcher
     */
    private getLine(lines: string[], matcher: string | RegExp): string[] {
        const isMatched = (line: string) => {
            return line.match(matcher);
        }
        return lines.filter(isMatched);
    }

}
