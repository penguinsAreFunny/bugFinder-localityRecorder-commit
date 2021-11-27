import { FormatParser } from "./parser";
import { Git, GitOptions } from "./git";
import { Commit } from "../commit";
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
export declare class GitImpl implements Git {
    readonly options: GitOptions;
    readonly gitCommitParser: FormatParser;
    private git;
    /**
     * @usage const options: GitOptions = {
     *          baseDir: "../Repositories/Typescript",
     *          maxConcurrentProcesses: 4,
     *          ignoreMergeCommits: true
     *      }
     *      gitContainer.bind<SimpleGitOptions>(API_TYPES.GitOptions).toConstantValue(options)
     *      const git: GitTool = gitContainer.get<GitTool>(API_TYPES.Git)
     */
    constructor(options: GitOptions, gitCommitParser: FormatParser);
    /**
     * Returns the parsed log as an array of GitCommits
     * @See GitCommit
     */
    logAll(): Promise<Commit[]>;
    checkout(hash: string, force?: boolean): Promise<void>;
    MADFiles(hash: string): Promise<{
        modifiedFiles: string[];
        addedFiles: string[];
        deletedFiles: string[];
    }>;
    /**
     * Returns all modified files of a commit
     * @param hash
     */
    modifiedFiles(hash: string): Promise<string[]>;
    /**
     * Returns all modified files of a commit
     * @param hash
     */
    modifiedFilesSync(hash: string): string[];
    /**
     * Returns all added files of a commit
     * @param hash
     */
    addedFiles(hash: string): Promise<string[]>;
    /**
     * Returns all added files of a commit
     * @param hash
     */
    addedFilesSync(hash: string): string[];
    /**
     * Returns all deleted files of a certain commit
     * @param hash
     */
    deletedFiles(hash: string): Promise<string[]>;
    /**
     * Returns all deleted files of a certain commit
     * @param hash
     */
    deletedFilesSync(hash: string): string[];
    /**
     * Returns all commits from a log formated with each commit beginning with beginCommitMarker
     * @param log
     * @param beginCommitMarker
     * @private
     */
    private splitLogIntoCommits;
    /**
     * Returns all deleted | modified | added files of a certain commit
     * @param hash
     * @param lineMatcher
     */
    private fileParser;
    /**
     * Returns all deleted | modified | added files of a certain commit
     * @param hash
     * @param lineMatcher
     */
    private fileParserSync;
    /**
     * Returns a string array containing the git diff with modified, deleted and added files.
     * @example return value:
     * ['M\tsrc/compiler/checker.ts',
     * 'A\ttests/baselines/reference/api/tsserverlibrary.d.ts',
     * 'A\ttests/baselines/reference/api/typescript.d.ts',
     * 'D\ttests/cases/fourslash/codeFixClassImplementInterface_noUndefinedOnOptionalParameter.ts']
     * @param hash
     */
    private changedFilesSync;
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
    private changedFiles;
    /**
     * Returns all lines matching the matcher
     * @param lines
     * @param matcher
     */
    private getLine;
}
