import { Locality } from "bugfinder-framework";
export declare class Commit implements Locality {
    /**
     * returns n predecessors of current beginning with current commit
     * @param cur
     * @param all
     * @param n
     */
    static getPredecessorCommits(cur: Commit, all: Commit[], n: number): Commit[];
    /**
     * Optimized iterative algorithm for git log graph traversion.
     * Returns n > all? all: n ancestor-commits of cur-commit.
     * @param cur
     * @param all
     * @param ancestors map of hash of a commit to their number of children commits
     */
    static _traverseIterative(cur: Commit, all: Map<string, Commit>, ancestors: Map<string, number>): Commit[];
    /**
     * Recursive traversion implementation. This algorithm is not optimized especially for node v8 application.
     * Consider using the _traverse-algorithm instead of this. There are small differences between these two algorithms
     * as the iterative version only return direct ancestors of the current commit and does not iterate the whole
     * historic graph.
     * @param cur
     * @param all
     * @param visited
     */
    static _traverseRecursive(cur: Commit, all: Map<string, Commit>, visited: Map<string, Commit>): Commit[];
    is(other: Commit): boolean;
    key(): string;
    setMethods(localityDTO: Commit): void;
    order: number;
    files: GitFiles;
    hash: string;
    abbreviatedHash: string;
    treeHash: string;
    abbreviatedTreeHash: string;
    parentHashes?: string[];
    abbreviatedParentHashes?: string[];
    authorName: string;
    authorNameRespectingMailMap: string;
    authorEmail: string;
    authorEmailRespectingMailMap?: string;
    authorDate: string;
    authorDateUnixTimeStamp: string;
    authorDateStrictIso8601Format: string;
    committerName: string;
    committerNameRespectingMailMap: string;
    committerEmail?: string;
    committerEmailRespectingMailMap?: string;
    committerEmailLocalPart?: string;
    committerEmailLocalPartRespectingMailMap?: string;
    committerDate: string;
    committerDateUnixTimestamp: string;
    committerDateStrictISO8601Format: string;
    refNames?: string[];
    refNamesWithoutCommaWrapping?: string[];
    refNameGivenOnTheCommandLineByWhichTheCommitWasReached?: string;
    encoding?: string;
    subject: string;
    sanitizedSubjectLineSuitableForAFileName?: string;
    body?: string;
    rawBody: string;
    commitNotes?: string;
    rawVerificationMessageFromGPGForASignedCommit?: string;
    showG: string;
    signerNameOfSignedCommit?: string;
    keyOfSignedCommit?: string;
    fingerprintOfKeyToSignSignedCommit?: string;
    fingerprintOfPrimaryKeyWhoseSubKeyWasUsedToSignACommit?: string;
    trustLevelOfKeyOfSignedCommit?: string;
    reflogSelector?: string;
    shortenedReflogSelector?: string;
    reflogIdentityName?: string;
    reflogIdentityNameRespectingMailMap?: string;
    reflogIdentityEmail?: string;
    reflogIdentityEmailRespectingMailMap?: string;
    reflogSubject?: string;
}
/**
 * Representation of GitFiles.
 * To determine type of a modified, added or deleted path use
 * the user-defined type guards: isGitTextFile(path) and isGitBinaryFile(path) | path: GitTextFile | GitBinaryFile
 * @see isGitTextFile
 * @see isGitBinaryFile
 * TODO: decide whether defined type guard or TypeDiscriminator is best solution
 */
export interface GitFiles {
    files: (GitTextFile | GitBinaryFile)[];
    changed: number;
    insertions: number;
    deletions: number;
}
export declare enum GitFileType {
    modified = 0,
    added = 1,
    deleted = 2,
    other = 3
}
export interface GitFile {
    path: string;
    type: GitFileType;
}
/**
 * Representation of a text path
 * @see isGitTextFile
 */
export interface GitTextFile extends GitFile {
    changes: number;
    insertions: number;
    deletions: number;
}
export declare function isGitTextFile(file: GitTextFile | GitBinaryFile): file is GitTextFile;
/**
 * Representation of a binary path.
 * @See isGitBinaryFile
 */
export interface GitBinaryFile extends GitFile {
    before: number;
    after: number;
}
export declare function isGitBinaryFile(file: GitTextFile | GitBinaryFile): file is GitBinaryFile;
