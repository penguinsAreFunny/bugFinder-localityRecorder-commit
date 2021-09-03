/*
Marker Newline ContentParser

CommitMarker
Hash
$Hash
Name
$Name
ParentHashes
$ParentHash1
$ParentHash2

 */

import {Commit} from "../../commit";

export interface GitCommitParser {
    /**
     * Each partial parser parses the expansion of its own gitPlaceholder
     * @see Commit
     * @example:
     * [{
     *     marker: $$COMMITHASH
     *     gitPlaceholder: %H
     *     parseContent: (lines: string[]) => {
     *         return {hash: lines[0]};
     *     }
     * },
     * {
     *      marker: $$PARENTHASHES
     *      gitPlaceholder: %P
     *      parseContent: (lines: string[]) => {
     *          return {parentHashes: lines}
     *      }
     * }]
     */
    partialParsers: {
        /**
         * Marker used in pretty-format to identify lines to be parsed by parseContent
         * @see parseContent
         */
        marker: string;

        /**
         * git placeholder used in pretty-format to be expanded to information extracted from the commit
         * @see https://git-scm.com/docs/pretty-formats Placeholders
         */
        gitPlaceholder: string;

        /**
         * Parses the content expanded by the gitPlaceholder
         * @see gitPlaceholder
         * @see parse
         * @param lines representing the lines expanded by the gitPlaceholder
         */
        parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => void;
    } [];

    /**
     * Returns the pretty-format-string for a git command
     */
    gitFormat(): string;

    /**
     * Parses commitLines into a GitCommit
     * @param commit
     */
    parse(commit: string): Commit;

    /**
     * Parses commitLines into DTO: GitCommit
     * @param commit
     * @param DTO
     */
    parseByRef(commit: string, DTO: Commit);

}
