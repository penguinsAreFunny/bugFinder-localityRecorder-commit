import {Locality} from "bugfinder-framework";

export class Commit implements Locality {

    /**
     * returns n predecessors of current beginning with current commit
     * @param cur
     * @param all
     * @param n
     */
    static getPredecessorCommits(cur: Commit, all: Commit[], n: number): Commit[] {
        // @formatter:off
        const allMap    = new Map<string, Commit>(); // map of all commits. hash -> commit
        const children  = new Map<string, number>(); // #children of a commit:
                                                     // map of how often commit needs to be visited in traversal
        // @formatter:on

        // init allMap
        all.forEach(commit => {
            allMap.set(commit.hash, commit);
        });

        /**
         * Children analysis | paths to watch from current commit
         * Goal: get a childrenMap which determines how often a commit need to be visited before
         * considering this commit as the current node for further traversal
         */
        const toVisit = [];
        const visited = new Map<string, Commit>();

        // init
        visited.set(cur.hash, cur);
        cur.parentHashes.forEach(hash => {
            const commit = allMap.get(hash);
            if (commit != null) toVisit.push(allMap.get(hash));
        })
        children.set(cur.hash, 1);

        while (toVisit.length > 0) {
            const curAncestor = toVisit.pop();
            const visits = children.get(curAncestor.hash);
            children.set(curAncestor.hash, visits == null ? 1 : visits + 1);
            // do not visit ancestors if node is already visited | this node is visited from another path
            if (visited.get(curAncestor.hash)) {
                visited.set(curAncestor.hash, curAncestor);
                continue;
            }

            visited.set(curAncestor.hash, curAncestor);
            curAncestor.parentHashes.forEach(hash => {
                const commit = allMap.get(hash);
                if (commit != null) toVisit.push(allMap.get(hash));
            })
        }

        const predecessors: Commit[] = this._traverseIterative(cur, allMap, children);
        if (predecessors.length <= n) {
            return predecessors;
        }

        return predecessors.slice(0, n);

    }

    /**
     * Optimized iterative algorithm for git log graph traversion.
     * Returns n > all? all: n ancestor-commits of cur-commit.
     * @param cur
     * @param all
     * @param ancestors map of hash of a commit to their number of children commits
     */
    static _traverseIterative(cur: Commit, all: Map<string, Commit>, ancestors: Map<string, number>): Commit[] {
        // @formatter:off
        let curCommit:  Commit      = cur;
        const path:     Commit[]    = [cur];
        const toVisit:  Commit[]    = [];
        const visitsLeftByChildren  = new Map<string, number>(ancestors); // copy map because map will be changed!
        // @formatter:on

        // init
        curCommit.parentHashes.forEach(hash => {
            const commit = all.get(hash);
            if (commit != null) toVisit.push(all.get(hash));
        })
        // cur commit should be visited once and directly written to result path
        ancestors.set(curCommit.hash, 1);

        while (toVisit.length > 0) {
            curCommit = toVisit.pop();

            const visitsLeft = visitsLeftByChildren.get(curCommit.hash);
            visitsLeftByChildren.set(curCommit.hash, visitsLeft - 1);

            if (visitsLeft > 1) {
                continue;
            }

            path.push(curCommit);
            curCommit.parentHashes.forEach(hash => {
                const commit = all.get(hash);
                if (commit != null) toVisit.push(all.get(hash));
            })

        }

        return path;
    }

    /**
     * Recursive traversion implementation. This algorithm is not optimized especially for node v8 application.
     * Consider using the _traverse-algorithm instead of this. There are small differences between these two algorithms
     * as the iterative version only return direct ancestors of the current commit and does not iterate the whole
     * historic graph.
     * @param cur
     * @param all
     * @param visited
     */
    static _traverseRecursive(cur: Commit, all: Map<string, Commit>, visited: Map<string, Commit>): Commit[] {
        if (visited.get(cur.hash) != null) return [];
        visited.set(cur.hash, cur);
        if (cur.parentHashes?.length === 0) return [cur];

        let paths = [];
        cur.parentHashes?.forEach((hash, index) => {
            const nextCommit = all.get(hash);
            if (nextCommit == undefined) {
                console.log(`Could not find commit for parent-hash ${hash}. You need to provide all commits to be able
                to reconstruct commit history`);
            }

            paths[index] = this._traverseRecursive(nextCommit, all, visited);
        });

        const reversedPaths = paths.reverse().reduce((accumulator, currentValue) => {
            return [...accumulator, ...currentValue];
        })
        return [cur, ...reversedPaths]
    }

    is(other: Commit): boolean {
        return this.hash === other.hash;
    }

    key(): string {
        return this.hash;
    }

    setMethods(localityDTO: Commit) {
        localityDTO.is = Commit.prototype.is;
        localityDTO.key = Commit.prototype.key;
        localityDTO.setMethods = Commit.prototype.setMethods;
    }

    // @formatter:off
    order:                                                      number;
    files:                                                      GitFiles;
    hash:                                                       string;
    abbreviatedHash:                                            string;
    treeHash:                                                   string;
    abbreviatedTreeHash:                                        string;
    parentHashes?:                                              string[]; // ? ?
    abbreviatedParentHashes?:                                   string[]; // ? ?
    authorName:                                                 string;
    authorNameRespectingMailMap:                                string;
    authorEmail:                                                string;
    authorEmailRespectingMailMap?:                              string;
    authorDate:                                                 string;
    authorDateUnixTimeStamp:                                    string;
    authorDateStrictIso8601Format:                              string; // alias date
    committerName:                                              string;
    committerNameRespectingMailMap:                             string;
    committerEmail?:                                            string;
    committerEmailRespectingMailMap?:                           string;
    committerEmailLocalPart?:                                   string;
    committerEmailLocalPartRespectingMailMap?:                  string;
    committerDate:                                              string;
    committerDateUnixTimestamp:                                 string;
    committerDateStrictISO8601Format:                           string;
    refNames?:                                                  string[];
    refNamesWithoutCommaWrapping?:                              string[]; // alias refs
    refNameGivenOnTheCommandLineByWhichTheCommitWasReached?:    string;
    encoding?:                                                  string;
    subject:                                                    string; // ? ?
    sanitizedSubjectLineSuitableForAFileName?:                  string;
    body?:                                                      string;
    rawBody:                                                    string; // alias message
    commitNotes?:                                               string;
    rawVerificationMessageFromGPGForASignedCommit?:             string;
    showG:                                                      string; //? ? Signature @see https://git-scm.com/docs/pretty-formats
    signerNameOfSignedCommit?:                                  string;
    keyOfSignedCommit?:                                         string;
    fingerprintOfKeyToSignSignedCommit?:                        string;
    fingerprintOfPrimaryKeyWhoseSubKeyWasUsedToSignACommit?:    string;
    trustLevelOfKeyOfSignedCommit?:                             string;
    reflogSelector?:                                            string;
    shortenedReflogSelector?:                                   string;
    reflogIdentityName?:                                        string;
    reflogIdentityNameRespectingMailMap?:                       string;
    reflogIdentityEmail?:                                       string;
    reflogIdentityEmailRespectingMailMap?:                      string;
    reflogSubject?:                                             string;

    // !! ATTENTION !! DiffResult documentation might be wrong in some cases !!
    // DiffResult.deletions ARE NOT the number of FILES changed with deletions!
    // public diff?:                                                      DiffResult;
    //@formatter:on

}

/**
 * Representation of GitFiles.
 * To determine type of a modified, added or deleted path use
 * the user-defined type guards: isGitTextFile(path) and isGitBinaryFile(path) | path: GitTextFile | GitBinaryFile
 * @see isGitTextFile
 * @see isGitBinaryFile
 */
export interface GitFiles {
    // @formatter:off
    files: (GitTextFile | GitBinaryFile)[];
    changed:        number;
    insertions:     number;
    deletions:      number;
    // @formatter:on
}

export enum GitFileType {
    modified,
    added,
    deleted,
    other,
    injected
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
    // @formatter:off
    changes:    number;
    insertions: number;
    deletions:  number;
    // @formatter:on
}

export function isGitTextFile(file: GitTextFile | GitBinaryFile): file is GitTextFile {
    const textFile = file as GitTextFile;
    return typeof textFile.changes === "number" && typeof textFile.insertions === "number"
        && typeof textFile.deletions === "number";
}

/**
 * Representation of a binary path.
 * @See isGitBinaryFile
 */
export interface GitBinaryFile extends GitFile {
    // @formatter:off
    before: number;
    after:  number;
    // @formatter:on
}

export function isGitBinaryFile(file: GitTextFile | GitBinaryFile): file is GitBinaryFile {
    const binaryFile = file as GitBinaryFile;
    return typeof binaryFile.after === "number" && typeof binaryFile.before === "number";
}
