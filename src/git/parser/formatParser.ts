import {inject, injectable} from "inversify";
import {GitCommitParser} from "./gitCommitParser";
import {MADFiles, MADFilesFromCommit} from "./MADFilesFromCommit";
import {Commit, GitFileType} from "../../commit";
import {BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES} from "../../TYPES";

/**
 * Important: the following constants will be used as RegEx-Matchers!
 * Therefore partial strings as \\ are not allowed
 */
// @formatter:off
export const BEGIN_COMMIT_MARKER        = "@@§COMMIT@@";                    // used to determine begin of a commit
export const BEGIN_PLACEHOLDER_MARKER   = "@@§BEGIN_PLACEHOLDER_MARKER@@";  // used to determine begin of 1 placeholder expansion
export const END_PLACEHOLDER_MARKER     = "@@§END_PLACEHOLDER_MARKER@@";    // used to determine end of 1 placeholder expansion
export const END_PLACEHOLDERS_MARKER    = "@@§END_PLACEHOLDERS_MARKER@@";   // used to determine end of all placeholder expansion
// @formatter:on

/**
 * FormatParser is able to parse a git commit shown by git show or git log with the pretty-format flag set to
 * gitFormat()
 */
@injectable()
export class FormatParser implements GitCommitParser {

    partialParsers = [];

    constructor(@inject(BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.madFilesFromCommitParser) public readonly MADFilesParser: MADFilesFromCommit) {
        this.partialParsers.push({
            marker: "@@\\COMMIT_HASH@@",
            gitPlaceholder: "%H",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.hash = lines[0];
                if (dto.hash === gitPlaceholder) dto.hash = "";
            }
        }, {
            marker: "@@\\ABBREVIATED_COMMIT_HASH@@",
            gitPlaceholder: "%h",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.abbreviatedHash = lines[0];
                if (dto.abbreviatedHash === gitPlaceholder) dto.abbreviatedHash = "";
            }
        }, {
            marker: "@@\\TREE_HASH@@",
            gitPlaceholder: "%T",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.treeHash = lines[0];
                if (dto.treeHash === gitPlaceholder) dto.treeHash = "";
            }
        }, {
            marker: "@@\\ABBREVIATED_TREE_HASH@@",
            gitPlaceholder: "%t",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.abbreviatedTreeHash = lines[0];
                if (dto.abbreviatedTreeHash === gitPlaceholder) dto.abbreviatedTreeHash = "";
            }
        }, {
            marker: "@@\\PARENT_HASHES@@",
            gitPlaceholder: "%P",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.parentHashes = lines[0].split(" ").filter((hash) => {
                    return hash != "";
                });
            }
        }, {
            marker: "@@\\ABBREVIATED_PARENT_HASHES@@",
            gitPlaceholder: "%p",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.abbreviatedParentHashes = lines[0].split(" ").filter((hash) => {
                    return hash != "";
                });
            }
        }, {
            marker: "@@\\AUTHOR_NAME@@",
            gitPlaceholder: "%an",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorName = lines[0];
                if (dto.authorName === gitPlaceholder) dto.authorName = "";
            }
        }, {
            marker: "@@\\AUTHOR_NAME_RESPECTING_MAILMAP@@",
            gitPlaceholder: "%aN",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorNameRespectingMailMap = lines[0];
                if (dto.authorNameRespectingMailMap === gitPlaceholder) dto.authorNameRespectingMailMap = undefined;
            }
        }, {
            marker: "@@\\AUTHOR_EMAIL@@",
            gitPlaceholder: "%ae",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorEmail = lines[0];
                if (dto.authorEmail === gitPlaceholder) dto.authorEmail = "";
            }
        },
            /*
            {
            marker: "@@\\AUTHOR_EMAIL_LOCAL_PART@@",
            gitPlaceholder: "%al",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorEmailLocalPart = lines[0];
                if (dto.authorEmailLocalPart === gitPlaceholder) dto.authorEmailLocalPart = undefined;
            }

        },*/
            /*
         {
            marker: "@@\\AUTHOR_EMAIL_LOCAL_PART_RESPECTING_MAIL_MAP@@",
            gitPlaceholder: "%aL",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorEmailLocalPartRespectingMailMap = lines[0];
                if (dto.authorEmailLocalPartRespectingMailMap === gitPlaceholder) {
                    dto.authorEmailLocalPartRespectingMailMap = undefined;
                }
            }
        },*/ {
            marker: "@@\\AUTHOR_DATE@@",
            gitPlaceholder: "%ad",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorDate = lines[0];
                if (dto.authorDate === gitPlaceholder) dto.authorDate = "";
            }
        },/* {
            marker: "@@\\AUTHOR_DATE_RFC2822_STYLE@@",
            gitPlaceholder: "%aD",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorDateRFC2822Style = lines[0];
                if (dto.authorDateRFC2822Style === gitPlaceholder) dto.authorDateRFC2822Style = "";
            }
        }, *//*{
            marker: "@@\\AUTHOR_DATE_RELATIVE@@",
            gitPlaceholder: "%ar",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorDateRelative = lines[0];
                if (dto.authorDateRelative === gitPlaceholder) dto.authorDateRelative = "";
            }
        }, */{
            marker: "@@\\AUTHOR_DATE_UNIX_TIMESTAMP@@",
            gitPlaceholder: "%at",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorDateUnixTimeStamp = lines[0];
                if (dto.authorDateUnixTimeStamp === gitPlaceholder) dto.authorDateUnixTimeStamp = "";
            }
        }, /*{
            marker: "@@\\AUTHOR_DATE_ISO_8601_LIKE_FORMAT@@",
            gitPlaceholder: "%ai",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorDateISO8601LikeFormat = lines[0];
                if (dto.authorDateISO8601LikeFormat === gitPlaceholder) dto.authorDateISO8601LikeFormat = "";
            }
        },*/ {
            marker: "@@\\AUTHOR_DATE_STRICT_ISO_8601_FORMAT@@",
            gitPlaceholder: "%aI",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorDateStrictIso8601Format = lines[0];
                if (dto.authorDateStrictIso8601Format === gitPlaceholder) dto.authorDateStrictIso8601Format = "";
            }
        }, /*{
            marker: "@@\\AUTHOR_DATE_SHORT_FORMAT@@",
            gitPlaceholder: "%as",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorDateShortFormat = lines[0];
                if (dto.authorDateShortFormat === gitPlaceholder) dto.authorDateShortFormat = undefined;
            }
        }, */{
            marker: "@@\\COMMITTER_NAME@@",
            gitPlaceholder: "%cn",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerName = lines[0];
                if (dto.committerName === gitPlaceholder) dto.committerName = "";
            }
        }, {
            marker: "@@\\COMMITTER_NAME_RESPECTING_MAIL_MAP@@",
            gitPlaceholder: "%cN",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerNameRespectingMailMap = lines[0];
                if (dto.committerNameRespectingMailMap === gitPlaceholder) {
                    dto.committerNameRespectingMailMap = undefined;
                }
            }
        }, {
            marker: "@@\\COMMITTER_EMAIL@@",
            gitPlaceholder: "%ce",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerEmail = lines[0];
                if (dto.committerEmail === gitPlaceholder) dto.committerEmail = undefined;
            }
        }, {
            marker: "@@\\COMMITTER_EMAIL_RESPECTING_MAIL_MAP@@",
            gitPlaceholder: "%cE",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerEmailRespectingMailMap = lines[0];
                if (dto.committerEmailRespectingMailMap === gitPlaceholder) {
                    dto.committerEmailRespectingMailMap = undefined;
                }
            }
        }, /*{
            marker: "@@\\COMMITTER_EMAIL_LOCAL_PART@@",
            gitPlaceholder: "%cl",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerEmailLocalPart = lines[0];
                if (dto.committerEmailLocalPart === gitPlaceholder) dto.committerEmailLocalPart = undefined;
            }
        },*//* {
            marker: "@@\\COMMITTER_EMAIL_LOCAL_PART_RESPECTING_MAIL_MAP@@",
            gitPlaceholder: "%cL",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerEmailLocalPartRespectingMailMap = lines[0];
                if (dto.committerEmailLocalPartRespectingMailMap === gitPlaceholder) {
                    dto.committerEmailLocalPartRespectingMailMap = undefined;
                }
            }
        }, */{
            marker: "@@\\COMMITTER_DATE@@",
            gitPlaceholder: "%cd",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerDate = lines[0];
                if (dto.committerDate === gitPlaceholder) dto.committerDate = "";
            }
        }, /*{
            marker: "@@\\COMMITTER_DATE_RFC2822_STYLE@@",
            gitPlaceholder: "%cD",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerDateRFC2822Style = lines[0];
                if (dto.committerDateRFC2822Style === gitPlaceholder) dto.committerDateRFC2822Style = "";
            }
        }, *//*{
            marker: "@@\\COMMITTER_DATE_RELATIVE@@",
            gitPlaceholder: "%cr",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerDateRelative = lines[0];
                if (dto.committerDateRelative === gitPlaceholder) dto.committerDateRelative = "";
            }
        }, */{
            marker: "@@\\COMMITTER_DATE_UNIX_TIMESTAMP@@",
            gitPlaceholder: "%ct",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerDateUnixTimestamp = lines[0];
                if (dto.committerDateUnixTimestamp === gitPlaceholder) dto.committerDateUnixTimestamp = "";
            }
        }, /*{
            marker: "@@\\COMMITTER_DATE_ISO_8601_LIKE_FORMAT@@",
            gitPlaceholder: "%ci",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerDateISO8601LikeFormat = lines[0];
                if (dto.committerDateISO8601LikeFormat === gitPlaceholder) dto.committerDateISO8601LikeFormat = "";
            }
        }, */{
            marker: "@@\\COMMITTER_DATE_STRICT_ISO_8601_FORMAT@@",
            gitPlaceholder: "%cI",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerDateStrictISO8601Format = lines[0];
                if (dto.committerDateStrictISO8601Format === gitPlaceholder) dto.committerDateStrictISO8601Format = "";
            }
        }, /*{
            marker: "@@\\COMMITTER_DATE_SHORT_FORMAT@@",
            gitPlaceholder: "%cs",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerDateShortFormat = lines[0];
                if (dto.committerDateShortFormat === gitPlaceholder) dto.committerDateShortFormat = undefined;
            }
        }, */{
            marker: "@@\\REF_NAMES@@",
            gitPlaceholder: "%d",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.refNames = lines;
            }
        }, {
            marker: "@@\\REF_NAME_WITHOUT_COMMA_WRAPPING@@",
            gitPlaceholder: "%D",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.refNamesWithoutCommaWrapping = lines;
            }
        }, {
            marker: "@@\\REF_NAMES_GIVEN_ON_THE_COMMAND_LINE_BY_WHICH_THE_COMMIT_WAS_REACHED@@",
            gitPlaceholder: "%S",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.refNameGivenOnTheCommandLineByWhichTheCommitWasReached = lines[0];
                if (dto.refNameGivenOnTheCommandLineByWhichTheCommitWasReached === gitPlaceholder) {
                    dto.refNameGivenOnTheCommandLineByWhichTheCommitWasReached = undefined;
                }
            }
        }, {
            marker: "@@\\ENCODING@@",
            gitPlaceholder: "%e",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.encoding = lines[0];
                if (dto.encoding === gitPlaceholder) dto.encoding = undefined;
            }
        }, {
            marker: "@@\\SUBJECT@@",
            gitPlaceholder: "%s",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.subject = lines[0];
                if (dto.subject === gitPlaceholder) dto.subject = "";
            }
        }, {
            marker: "@@\\SANITIZED_SUBJECT_LINE_SUITABLE_FOR_A_FILENAME@@",
            gitPlaceholder: "%f",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.sanitizedSubjectLineSuitableForAFileName = lines[0];
                if (dto.sanitizedSubjectLineSuitableForAFileName === gitPlaceholder) {
                    dto.sanitizedSubjectLineSuitableForAFileName = undefined;
                }
            }
        }, {
            marker: "@@\\BODY@@",
            gitPlaceholder: "%b",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                if (lines[0] === gitPlaceholder) {
                    lines[0] = undefined;
                } else {
                    dto.body = lines.join("\n");
                }
            }
        }, {
            marker: "@@\\RAW_BODY@@",
            gitPlaceholder: "%B",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                if (lines[0] === gitPlaceholder) {
                    lines[0] = "";
                } else {
                    dto.rawBody = lines.join("\n");
                }
            }
        }, {
            marker: "@@\\COMMIT_NOTES@@",
            gitPlaceholder: "%N",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                if (lines[0] === gitPlaceholder) {
                    lines[0] = undefined;
                } else {
                    dto.commitNotes = lines.join("\n");
                }
            }
        }, {
            marker: "@@\\RAW_VERIFICATION_MESSAGE_FROM_GPG_FOR_A_SIGNED_COMMIT@@",
            gitPlaceholder: "%GG",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                if (lines[0] === gitPlaceholder) {
                    lines[0] = undefined;
                } else {
                    dto.rawVerificationMessageFromGPGForASignedCommit = lines.join("\n");

                }
            }
        }, {
            marker: "@@\\SHOW_G@@",
            gitPlaceholder: "%G?",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.showG = lines[0];
                if (dto.showG === gitPlaceholder) dto.showG = "";
            }
        }, {
            marker: "@@\\SIGNER_NAME_FOR_A_SIGNED_COMMIT@@",
            gitPlaceholder: "%GS",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.signerNameOfSignedCommit = lines[0];
                if (dto.signerNameOfSignedCommit === gitPlaceholder || dto.signerNameOfSignedCommit === "") {
                    dto.signerNameOfSignedCommit = undefined;
                }
            }
        }, {
            marker: "@@\\KEY_USED_TO_SIGN_COMMIT@@",
            gitPlaceholder: "%GK",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.keyOfSignedCommit = lines[0];
                if (dto.keyOfSignedCommit === gitPlaceholder) dto.keyOfSignedCommit = undefined;
            }
        }, {
            marker: "@@\\FINGERPRINT_OF_KEY_USED_TO_SIGN_COMMIT@@",
            gitPlaceholder: "%GF",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.fingerprintOfKeyToSignSignedCommit = lines[0];
                if (dto.fingerprintOfKeyToSignSignedCommit === gitPlaceholder) {
                    dto.fingerprintOfKeyToSignSignedCommit = undefined;
                }
            }
        }, {
            marker: "@@\\FINGERPRINT_OF_PRIMARY_KEY_WHOSE_SUBKEY_WAS_USED_TO_SIGN_COMMIT@@",
            gitPlaceholder: "%GP",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.fingerprintOfPrimaryKeyWhoseSubKeyWasUsedToSignACommit = lines[0];
                if (dto.fingerprintOfPrimaryKeyWhoseSubKeyWasUsedToSignACommit === gitPlaceholder) {
                    dto.fingerprintOfPrimaryKeyWhoseSubKeyWasUsedToSignACommit = undefined;
                }
            }
        }, {
            marker: "@@\\TRUST_LEVEL_FOR_KEY_USED_TO_SIGN@@",
            gitPlaceholder: "%GT",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.trustLevelOfKeyOfSignedCommit = lines[0];
                if (dto.trustLevelOfKeyOfSignedCommit === gitPlaceholder) dto.trustLevelOfKeyOfSignedCommit = undefined;
            }
        }, {
            marker: "@@\\REFLOG_SELECTOR@@",
            gitPlaceholder: "%gD",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.reflogSelector = lines[0];
                if (dto.reflogSelector === gitPlaceholder) dto.reflogSelector = undefined;
            }
        }, {
            marker: "@@\\SHORTENED_REFLOG_SELECTOR@@",
            gitPlaceholder: "%gd",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.shortenedReflogSelector = lines[0];
                if (dto.shortenedReflogSelector === gitPlaceholder) dto.shortenedReflogSelector = undefined;
            }
        }, {
            marker: "@@\\REFLOG_IDENTITY_NAME@@",
            gitPlaceholder: "%gN",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.reflogIdentityName = lines[0];
                if (dto.reflogIdentityName === gitPlaceholder) dto.reflogIdentityName = undefined;
            }
        }, {
            marker: "@@\\REFLOG_IDENTITY_EMAIL@@",
            gitPlaceholder: "%ge",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.reflogIdentityEmail = lines[0];
                if (dto.reflogIdentityEmail === gitPlaceholder) dto.reflogIdentityEmail = undefined;
            }
        }, {
            marker: "@@\\REFLOG_IDENTITY_EMAIL_RESPECTING_MAIL_MAP@@",
            gitPlaceholder: "%gE",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.reflogIdentityEmailRespectingMailMap = lines[0];
                if (dto.reflogIdentityEmailRespectingMailMap === gitPlaceholder) {
                    dto.reflogIdentityEmailRespectingMailMap = undefined;
                }
            }
        }, {
            marker: "@@\\REFLOG_SUBJECT@@",
            gitPlaceholder: "%gs",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.reflogSubject = lines[0];
                if (dto.reflogSubject === gitPlaceholder) dto.reflogSubject = undefined;
            }
        });
    }

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
    gitFormat(): string {
        return BEGIN_COMMIT_MARKER + "%n" + this.partialParsers.map(partialParser => {
            return BEGIN_PLACEHOLDER_MARKER + "%n" + partialParser.marker + "%n" + partialParser.gitPlaceholder + "%n"
                + END_PLACEHOLDER_MARKER + "%n";
        }).reduce((accumulator, partialFormatString) => {
            return accumulator + partialFormatString;
        }) + END_PLACEHOLDERS_MARKER;
    }

    /**
     * parses a commit shown with format: gitFormat() and --name-status flag
     * @see gitFormat
     * @param commit
     */
    parse(commit: string): Commit {
        const dto = new Commit();
        dto.files = undefined;
        dto.abbreviatedHash = "";
        dto.abbreviatedTreeHash = ""
        dto.authorDate = ""
        dto.authorDateStrictIso8601Format = ""
        dto.authorDateUnixTimeStamp = ""
        dto.authorEmail = ""
        dto.authorName = ""
        dto.authorNameRespectingMailMap = ""
        dto.committerDate = ""
        dto.committerDateStrictISO8601Format = ""
        dto.committerDateUnixTimestamp = ""
        dto.committerName = ""
        dto.committerNameRespectingMailMap = ""
        dto.hash = ""
        dto.rawBody = ""
        dto.showG = ""
        dto.subject = ""
        dto.treeHash = ""

        this.parseByRef(commit, dto);
        return dto;
    }

    /**
     * Parses a commit string formatted with string gitFormat() into @param DTO
     * @see gitFormat
     * @see parse
     * @param commit
     * @param DTO
     */
    parseByRef(commit: string, DTO: Commit) {
        // 1. Commit in expandedPlaceholders und rest (residual) aufteilen
        // @formatter:off
        const lines                 = commit.split("\n");
        const idx                   = lines.indexOf(END_PLACEHOLDERS_MARKER);
        const expandedPlaceholders  = lines.slice(0, idx);
        const residual              = lines.slice(idx + 1, lines.length);
        // @formatter:on

        // each pair of 2 indxes determine the content expanded by the gitPlaceholder
        const idxes = expandedPlaceholders.map((line, index) => {
            if (line.match(BEGIN_PLACEHOLDER_MARKER) || line.match(END_PLACEHOLDER_MARKER))
                return index;
        }).filter(idx => {
            return idx !== undefined;
        });

        const expandedPlaceholdersArray = idxes.filter((idx, index) => {
            return (index % 2 === 0);
        }).map((idx, index) => {
            return lines.slice(idx + 2, idxes[2 * index + 1]);
        });

        expandedPlaceholdersArray.forEach((expandedPlaceholder, index) => {
            const placeholder = this.partialParsers[index].gitPlaceholder;
            this.partialParsers[index].parseContent(expandedPlaceholder, DTO, placeholder);
            /*
            const parsedContent = this.partialParsers[index].parseContent(expandedPlaceholder, DTO);
            Object.keys(parsedContent).forEach((key) => {
                if (parsedContent[key] != this.partialParsers[index].gitPlaceholder)
                    DTO[key] = parsedContent[key];
            })
            */
        });

        const madFiles: MADFiles = this.MADFilesParser.MADFilesFromCommit(residual.join("\n"));
        // @formatter:off
        DTO.files = {
            files:          [],
            //modifiedFiles:  [],
            //addedFiles:     [],
            //deletedFiles:   [],
            //otherFiles:     [],
            changed:        undefined,
            insertions:     undefined,
            deletions:      undefined
        };

        madFiles.modifiedFiles.forEach(modifiedFile => {
            DTO.files.files.push({
                path:       modifiedFile,
                type:       GitFileType.modified,
                changes:    undefined,
                insertions: undefined,
                deletions:  undefined
            });
        });

        madFiles.addedFiles.forEach(addedFile => {
            DTO.files.files.push({
                path:       addedFile,
                type:       GitFileType.added,
                changes:    undefined,
                insertions: undefined,
                deletions:  undefined
            });
        });

        madFiles.deletedFiles.forEach(deletedFile => {
            DTO.files.files.push({
                path:       deletedFile,
                type:       GitFileType.deleted,
                changes:    undefined,
                insertions: undefined,
                deletions:  undefined
            });
        });
        // @formatter:on
    }

}
