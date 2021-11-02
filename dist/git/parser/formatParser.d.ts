import { GitCommitParser } from "./gitCommitParser";
import { MADFilesFromCommit } from "./MADFilesFromCommit";
import { Commit } from "../../commit";
/**
 * Important: the following constants will be used as RegEx-Matchers!
 * Therefore partial strings as \\ are not allowed
 */
export declare const BEGIN_COMMIT_MARKER = "@@\u00A7COMMIT@@";
export declare const BEGIN_PLACEHOLDER_MARKER = "@@\u00A7BEGIN_PLACEHOLDER_MARKER@@";
export declare const END_PLACEHOLDER_MARKER = "@@\u00A7END_PLACEHOLDER_MARKER@@";
export declare const END_PLACEHOLDERS_MARKER = "@@\u00A7END_PLACEHOLDERS_MARKER@@";
/**
 * FormatParser is able to parse a git commit shown by git show or git log with the pretty-format flag set to
 * gitFormat()
 */
export declare class FormatParser implements GitCommitParser {
    readonly MADFilesParser: MADFilesFromCommit;
    partialParsers: any[];
    constructor();
    /**
     * Returns the string used for pretty-format in git so that the function parse is able to parse all necessary data
     * @see parse
     * @example: Format should look something like this:
     * @@$COMMIT@@
     * @@$BEGIN_PLACEHOLDER_MARKER@@
     * @@$COMMITHASH@@
     * 71c3bccef4d6492ee3bdcd170d551376fcb5ef42
     * @@$END_PLACEHOLDER_MARKER@@
     * @@$BEGIN_PLACEHOLDER_MARKER@@
     * @@$PARENTHASHES@@
     * 21fb559b534e9c7c32a83693d3323ae18a7a5276
     * @@$END_PLACEHOLDER_MARKER
     * @@$END_PLACEHOLDERS_MARKER@@
     */
    gitFormat(): string;
    /**
     * parses a commit shown with format: gitFormat() and --name-status flag
     * @see gitFormat
     * @param commit
     */
    parse(commit: string): Commit;
    /**
     * Parses a commit string formatted with string gitFormat() into @param DTO
     * @see gitFormat
     * @see parse
     * @param commit
     * @param DTO
     */
    parseByRef(commit: string, DTO: Commit): void;
}
