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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatParser = exports.END_PLACEHOLDERS_MARKER = exports.END_PLACEHOLDER_MARKER = exports.BEGIN_PLACEHOLDER_MARKER = exports.BEGIN_COMMIT_MARKER = void 0;
var inversify_1 = require("inversify");
var commit_1 = require("../../commit");
var TYPES_1 = require("../../TYPES");
/**
 * Important: the following constants will be used as RegEx-Matchers!
 * Therefore partial strings as \\ are not allowed
 */
// @formatter:off
exports.BEGIN_COMMIT_MARKER = "@@§COMMIT@@"; // used to determine begin of a commit
exports.BEGIN_PLACEHOLDER_MARKER = "@@§BEGIN_PLACEHOLDER_MARKER@@"; // used to determine begin of 1 placeholder expansion
exports.END_PLACEHOLDER_MARKER = "@@§END_PLACEHOLDER_MARKER@@"; // used to determine end of 1 placeholder expansion
exports.END_PLACEHOLDERS_MARKER = "@@§END_PLACEHOLDERS_MARKER@@"; // used to determine end of all placeholder expansion
// @formatter:on
/**
 * FormatParser is able to parse a git commit shown by git show or git log with the pretty-format flag set to
 * gitFormat()
 */
var FormatParser = /** @class */ (function () {
    function FormatParser() {
        this.partialParsers = [];
        this.partialParsers.push({
            marker: "@@\\COMMIT_HASH@@",
            gitPlaceholder: "%H",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.hash = lines[0];
                if (dto.hash === gitPlaceholder)
                    dto.hash = "";
            }
        }, {
            marker: "@@\\ABBREVIATED_COMMIT_HASH@@",
            gitPlaceholder: "%h",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.abbreviatedHash = lines[0];
                if (dto.abbreviatedHash === gitPlaceholder)
                    dto.abbreviatedHash = "";
            }
        }, {
            marker: "@@\\TREE_HASH@@",
            gitPlaceholder: "%T",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.treeHash = lines[0];
                if (dto.treeHash === gitPlaceholder)
                    dto.treeHash = "";
            }
        }, {
            marker: "@@\\ABBREVIATED_TREE_HASH@@",
            gitPlaceholder: "%t",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.abbreviatedTreeHash = lines[0];
                if (dto.abbreviatedTreeHash === gitPlaceholder)
                    dto.abbreviatedTreeHash = "";
            }
        }, {
            marker: "@@\\PARENT_HASHES@@",
            gitPlaceholder: "%P",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.parentHashes = lines[0].split(" ").filter(function (hash) {
                    return hash != "";
                });
            }
        }, {
            marker: "@@\\ABBREVIATED_PARENT_HASHES@@",
            gitPlaceholder: "%p",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.abbreviatedParentHashes = lines[0].split(" ").filter(function (hash) {
                    return hash != "";
                });
            }
        }, {
            marker: "@@\\AUTHOR_NAME@@",
            gitPlaceholder: "%an",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.authorName = lines[0];
                if (dto.authorName === gitPlaceholder)
                    dto.authorName = "";
            }
        }, {
            marker: "@@\\AUTHOR_NAME_RESPECTING_MAILMAP@@",
            gitPlaceholder: "%aN",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.authorNameRespectingMailMap = lines[0];
                if (dto.authorNameRespectingMailMap === gitPlaceholder)
                    dto.authorNameRespectingMailMap = undefined;
            }
        }, {
            marker: "@@\\AUTHOR_EMAIL@@",
            gitPlaceholder: "%ae",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.authorEmail = lines[0];
                if (dto.authorEmail === gitPlaceholder)
                    dto.authorEmail = "";
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
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.authorDate = lines[0];
                if (dto.authorDate === gitPlaceholder)
                    dto.authorDate = "";
            }
        }, /* {
            marker: "@@\\AUTHOR_DATE_RFC2822_STYLE@@",
            gitPlaceholder: "%aD",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorDateRFC2822Style = lines[0];
                if (dto.authorDateRFC2822Style === gitPlaceholder) dto.authorDateRFC2822Style = "";
            }
        }, */ /*{
            marker: "@@\\AUTHOR_DATE_RELATIVE@@",
            gitPlaceholder: "%ar",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorDateRelative = lines[0];
                if (dto.authorDateRelative === gitPlaceholder) dto.authorDateRelative = "";
            }
        }, */ {
            marker: "@@\\AUTHOR_DATE_UNIX_TIMESTAMP@@",
            gitPlaceholder: "%at",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.authorDateUnixTimeStamp = lines[0];
                if (dto.authorDateUnixTimeStamp === gitPlaceholder)
                    dto.authorDateUnixTimeStamp = "";
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
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.authorDateStrictIso8601Format = lines[0];
                if (dto.authorDateStrictIso8601Format === gitPlaceholder)
                    dto.authorDateStrictIso8601Format = "";
            }
        }, /*{
            marker: "@@\\AUTHOR_DATE_SHORT_FORMAT@@",
            gitPlaceholder: "%as",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.authorDateShortFormat = lines[0];
                if (dto.authorDateShortFormat === gitPlaceholder) dto.authorDateShortFormat = undefined;
            }
        }, */ {
            marker: "@@\\COMMITTER_NAME@@",
            gitPlaceholder: "%cn",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.committerName = lines[0];
                if (dto.committerName === gitPlaceholder)
                    dto.committerName = "";
            }
        }, {
            marker: "@@\\COMMITTER_NAME_RESPECTING_MAIL_MAP@@",
            gitPlaceholder: "%cN",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.committerNameRespectingMailMap = lines[0];
                if (dto.committerNameRespectingMailMap === gitPlaceholder) {
                    dto.committerNameRespectingMailMap = undefined;
                }
            }
        }, {
            marker: "@@\\COMMITTER_EMAIL@@",
            gitPlaceholder: "%ce",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.committerEmail = lines[0];
                if (dto.committerEmail === gitPlaceholder)
                    dto.committerEmail = undefined;
            }
        }, {
            marker: "@@\\COMMITTER_EMAIL_RESPECTING_MAIL_MAP@@",
            gitPlaceholder: "%cE",
            parseContent: function (lines, dto, gitPlaceholder) {
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
        },*/ /* {
            marker: "@@\\COMMITTER_EMAIL_LOCAL_PART_RESPECTING_MAIL_MAP@@",
            gitPlaceholder: "%cL",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerEmailLocalPartRespectingMailMap = lines[0];
                if (dto.committerEmailLocalPartRespectingMailMap === gitPlaceholder) {
                    dto.committerEmailLocalPartRespectingMailMap = undefined;
                }
            }
        }, */ {
            marker: "@@\\COMMITTER_DATE@@",
            gitPlaceholder: "%cd",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.committerDate = lines[0];
                if (dto.committerDate === gitPlaceholder)
                    dto.committerDate = "";
            }
        }, /*{
            marker: "@@\\COMMITTER_DATE_RFC2822_STYLE@@",
            gitPlaceholder: "%cD",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerDateRFC2822Style = lines[0];
                if (dto.committerDateRFC2822Style === gitPlaceholder) dto.committerDateRFC2822Style = "";
            }
        }, */ /*{
            marker: "@@\\COMMITTER_DATE_RELATIVE@@",
            gitPlaceholder: "%cr",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerDateRelative = lines[0];
                if (dto.committerDateRelative === gitPlaceholder) dto.committerDateRelative = "";
            }
        }, */ {
            marker: "@@\\COMMITTER_DATE_UNIX_TIMESTAMP@@",
            gitPlaceholder: "%ct",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.committerDateUnixTimestamp = lines[0];
                if (dto.committerDateUnixTimestamp === gitPlaceholder)
                    dto.committerDateUnixTimestamp = "";
            }
        }, /*{
            marker: "@@\\COMMITTER_DATE_ISO_8601_LIKE_FORMAT@@",
            gitPlaceholder: "%ci",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerDateISO8601LikeFormat = lines[0];
                if (dto.committerDateISO8601LikeFormat === gitPlaceholder) dto.committerDateISO8601LikeFormat = "";
            }
        }, */ {
            marker: "@@\\COMMITTER_DATE_STRICT_ISO_8601_FORMAT@@",
            gitPlaceholder: "%cI",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.committerDateStrictISO8601Format = lines[0];
                if (dto.committerDateStrictISO8601Format === gitPlaceholder)
                    dto.committerDateStrictISO8601Format = "";
            }
        }, /*{
            marker: "@@\\COMMITTER_DATE_SHORT_FORMAT@@",
            gitPlaceholder: "%cs",
            parseContent: (lines: string[], dto: Commit, gitPlaceholder: string) => {
                dto.committerDateShortFormat = lines[0];
                if (dto.committerDateShortFormat === gitPlaceholder) dto.committerDateShortFormat = undefined;
            }
        }, */ {
            marker: "@@\\REF_NAMES@@",
            gitPlaceholder: "%d",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.refNames = lines;
            }
        }, {
            marker: "@@\\REF_NAME_WITHOUT_COMMA_WRAPPING@@",
            gitPlaceholder: "%D",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.refNamesWithoutCommaWrapping = lines;
            }
        }, {
            marker: "@@\\REF_NAMES_GIVEN_ON_THE_COMMAND_LINE_BY_WHICH_THE_COMMIT_WAS_REACHED@@",
            gitPlaceholder: "%S",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.refNameGivenOnTheCommandLineByWhichTheCommitWasReached = lines[0];
                if (dto.refNameGivenOnTheCommandLineByWhichTheCommitWasReached === gitPlaceholder) {
                    dto.refNameGivenOnTheCommandLineByWhichTheCommitWasReached = undefined;
                }
            }
        }, {
            marker: "@@\\ENCODING@@",
            gitPlaceholder: "%e",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.encoding = lines[0];
                if (dto.encoding === gitPlaceholder)
                    dto.encoding = undefined;
            }
        }, {
            marker: "@@\\SUBJECT@@",
            gitPlaceholder: "%s",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.subject = lines[0];
                if (dto.subject === gitPlaceholder)
                    dto.subject = "";
            }
        }, {
            marker: "@@\\SANITIZED_SUBJECT_LINE_SUITABLE_FOR_A_FILENAME@@",
            gitPlaceholder: "%f",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.sanitizedSubjectLineSuitableForAFileName = lines[0];
                if (dto.sanitizedSubjectLineSuitableForAFileName === gitPlaceholder) {
                    dto.sanitizedSubjectLineSuitableForAFileName = undefined;
                }
            }
        }, {
            marker: "@@\\BODY@@",
            gitPlaceholder: "%b",
            parseContent: function (lines, dto, gitPlaceholder) {
                if (lines[0] === gitPlaceholder) {
                    lines[0] = undefined;
                }
                else {
                    dto.body = lines.join("\n");
                }
            }
        }, {
            marker: "@@\\RAW_BODY@@",
            gitPlaceholder: "%B",
            parseContent: function (lines, dto, gitPlaceholder) {
                if (lines[0] === gitPlaceholder) {
                    lines[0] = "";
                }
                else {
                    dto.rawBody = lines.join("\n");
                }
            }
        }, {
            marker: "@@\\COMMIT_NOTES@@",
            gitPlaceholder: "%N",
            parseContent: function (lines, dto, gitPlaceholder) {
                if (lines[0] === gitPlaceholder) {
                    lines[0] = undefined;
                }
                else {
                    dto.commitNotes = lines.join("\n");
                }
            }
        }, {
            marker: "@@\\RAW_VERIFICATION_MESSAGE_FROM_GPG_FOR_A_SIGNED_COMMIT@@",
            gitPlaceholder: "%GG",
            parseContent: function (lines, dto, gitPlaceholder) {
                if (lines[0] === gitPlaceholder) {
                    lines[0] = undefined;
                }
                else {
                    dto.rawVerificationMessageFromGPGForASignedCommit = lines.join("\n");
                }
            }
        }, {
            marker: "@@\\SHOW_G@@",
            gitPlaceholder: "%G?",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.showG = lines[0];
                if (dto.showG === gitPlaceholder)
                    dto.showG = "";
            }
        }, {
            marker: "@@\\SIGNER_NAME_FOR_A_SIGNED_COMMIT@@",
            gitPlaceholder: "%GS",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.signerNameOfSignedCommit = lines[0];
                if (dto.signerNameOfSignedCommit === gitPlaceholder || dto.signerNameOfSignedCommit === "") {
                    dto.signerNameOfSignedCommit = undefined;
                }
            }
        }, {
            marker: "@@\\KEY_USED_TO_SIGN_COMMIT@@",
            gitPlaceholder: "%GK",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.keyOfSignedCommit = lines[0];
                if (dto.keyOfSignedCommit === gitPlaceholder)
                    dto.keyOfSignedCommit = undefined;
            }
        }, {
            marker: "@@\\FINGERPRINT_OF_KEY_USED_TO_SIGN_COMMIT@@",
            gitPlaceholder: "%GF",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.fingerprintOfKeyToSignSignedCommit = lines[0];
                if (dto.fingerprintOfKeyToSignSignedCommit === gitPlaceholder) {
                    dto.fingerprintOfKeyToSignSignedCommit = undefined;
                }
            }
        }, {
            marker: "@@\\FINGERPRINT_OF_PRIMARY_KEY_WHOSE_SUBKEY_WAS_USED_TO_SIGN_COMMIT@@",
            gitPlaceholder: "%GP",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.fingerprintOfPrimaryKeyWhoseSubKeyWasUsedToSignACommit = lines[0];
                if (dto.fingerprintOfPrimaryKeyWhoseSubKeyWasUsedToSignACommit === gitPlaceholder) {
                    dto.fingerprintOfPrimaryKeyWhoseSubKeyWasUsedToSignACommit = undefined;
                }
            }
        }, {
            marker: "@@\\TRUST_LEVEL_FOR_KEY_USED_TO_SIGN@@",
            gitPlaceholder: "%GT",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.trustLevelOfKeyOfSignedCommit = lines[0];
                if (dto.trustLevelOfKeyOfSignedCommit === gitPlaceholder)
                    dto.trustLevelOfKeyOfSignedCommit = undefined;
            }
        }, {
            marker: "@@\\REFLOG_SELECTOR@@",
            gitPlaceholder: "%gD",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.reflogSelector = lines[0];
                if (dto.reflogSelector === gitPlaceholder)
                    dto.reflogSelector = undefined;
            }
        }, {
            marker: "@@\\SHORTENED_REFLOG_SELECTOR@@",
            gitPlaceholder: "%gd",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.shortenedReflogSelector = lines[0];
                if (dto.shortenedReflogSelector === gitPlaceholder)
                    dto.shortenedReflogSelector = undefined;
            }
        }, {
            marker: "@@\\REFLOG_IDENTITY_NAME@@",
            gitPlaceholder: "%gN",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.reflogIdentityName = lines[0];
                if (dto.reflogIdentityName === gitPlaceholder)
                    dto.reflogIdentityName = undefined;
            }
        }, {
            marker: "@@\\REFLOG_IDENTITY_EMAIL@@",
            gitPlaceholder: "%ge",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.reflogIdentityEmail = lines[0];
                if (dto.reflogIdentityEmail === gitPlaceholder)
                    dto.reflogIdentityEmail = undefined;
            }
        }, {
            marker: "@@\\REFLOG_IDENTITY_EMAIL_RESPECTING_MAIL_MAP@@",
            gitPlaceholder: "%gE",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.reflogIdentityEmailRespectingMailMap = lines[0];
                if (dto.reflogIdentityEmailRespectingMailMap === gitPlaceholder) {
                    dto.reflogIdentityEmailRespectingMailMap = undefined;
                }
            }
        }, {
            marker: "@@\\REFLOG_SUBJECT@@",
            gitPlaceholder: "%gs",
            parseContent: function (lines, dto, gitPlaceholder) {
                dto.reflogSubject = lines[0];
                if (dto.reflogSubject === gitPlaceholder)
                    dto.reflogSubject = undefined;
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
    FormatParser.prototype.gitFormat = function () {
        return exports.BEGIN_COMMIT_MARKER + "%n" + this.partialParsers.map(function (partialParser) {
            return exports.BEGIN_PLACEHOLDER_MARKER + "%n" + partialParser.marker + "%n" + partialParser.gitPlaceholder + "%n"
                + exports.END_PLACEHOLDER_MARKER + "%n";
        }).reduce(function (accumulator, partialFormatString) {
            return accumulator + partialFormatString;
        }) + exports.END_PLACEHOLDERS_MARKER;
    };
    /**
     * parses a commit shown with format: gitFormat() and --name-status flag
     * @see gitFormat
     * @param commit
     */
    FormatParser.prototype.parse = function (commit) {
        var dto = new commit_1.Commit();
        dto.files = undefined;
        dto.abbreviatedHash = "";
        dto.abbreviatedTreeHash = "";
        dto.authorDate = "";
        dto.authorDateStrictIso8601Format = "";
        dto.authorDateUnixTimeStamp = "";
        dto.authorEmail = "";
        dto.authorName = "";
        dto.authorNameRespectingMailMap = "";
        dto.committerDate = "";
        dto.committerDateStrictISO8601Format = "";
        dto.committerDateUnixTimestamp = "";
        dto.committerName = "";
        dto.committerNameRespectingMailMap = "";
        dto.hash = "";
        dto.rawBody = "";
        dto.showG = "";
        dto.subject = "";
        dto.treeHash = "";
        this.parseByRef(commit, dto);
        return dto;
    };
    /**
     * Parses a commit string formatted with string gitFormat() into @param DTO
     * @see gitFormat
     * @see parse
     * @param commit
     * @param DTO
     */
    FormatParser.prototype.parseByRef = function (commit, DTO) {
        var _this = this;
        // 1. Commit in expandedPlaceholders und rest (residual) aufteilen
        // @formatter:off
        var lines = commit.split("\n");
        var idx = lines.indexOf(exports.END_PLACEHOLDERS_MARKER);
        var expandedPlaceholders = lines.slice(0, idx);
        var residual = lines.slice(idx + 1, lines.length);
        // @formatter:on
        // each pair of 2 indxes determine the content expanded by the gitPlaceholder
        var idxes = expandedPlaceholders.map(function (line, index) {
            if (line.match(exports.BEGIN_PLACEHOLDER_MARKER) || line.match(exports.END_PLACEHOLDER_MARKER))
                return index;
        }).filter(function (idx2) {
            return idx2 !== undefined;
        });
        var expandedPlaceholdersArray = idxes.filter(function (idx2, index) {
            return (index % 2 === 0);
        }).map(function (idx3, index) {
            return lines.slice(idx3 + 2, idxes[2 * index + 1]);
        });
        expandedPlaceholdersArray.forEach(function (expandedPlaceholder, index) {
            var placeholder = _this.partialParsers[index].gitPlaceholder;
            _this.partialParsers[index].parseContent(expandedPlaceholder, DTO, placeholder);
        });
        var madFiles = this.MADFilesParser.MADFilesFromCommit(residual.join("\n"));
        // @formatter:off
        DTO.files = {
            files: [],
            changed: undefined,
            insertions: undefined,
            deletions: undefined
        };
        madFiles.modifiedFiles.forEach(function (modifiedFile) {
            DTO.files.files.push({
                path: modifiedFile,
                type: commit_1.GitFileType.modified,
                changes: undefined,
                insertions: undefined,
                deletions: undefined
            });
        });
        madFiles.addedFiles.forEach(function (addedFile) {
            DTO.files.files.push({
                path: addedFile,
                type: commit_1.GitFileType.added,
                changes: undefined,
                insertions: undefined,
                deletions: undefined
            });
        });
        madFiles.deletedFiles.forEach(function (deletedFile) {
            DTO.files.files.push({
                path: deletedFile,
                type: commit_1.GitFileType.deleted,
                changes: undefined,
                insertions: undefined,
                deletions: undefined
            });
        });
        // @formatter:on
    };
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.madFilesFromCommitParser),
        __metadata("design:type", Object)
    ], FormatParser.prototype, "MADFilesParser", void 0);
    FormatParser = __decorate([
        (0, inversify_1.injectable)(),
        __metadata("design:paramtypes", [])
    ], FormatParser);
    return FormatParser;
}());
exports.FormatParser = FormatParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0UGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dpdC9wYXJzZXIvZm9ybWF0UGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHVDQUF1RDtBQUd2RCx1Q0FBaUQ7QUFDakQscUNBQW9FO0FBR3BFOzs7R0FHRztBQUNILGlCQUFpQjtBQUNKLFFBQUEsbUJBQW1CLEdBQVUsYUFBYSxDQUFDLENBQW9CLHNDQUFzQztBQUNyRyxRQUFBLHdCQUF3QixHQUFLLCtCQUErQixDQUFDLENBQUUscURBQXFEO0FBQ3BILFFBQUEsc0JBQXNCLEdBQU8sNkJBQTZCLENBQUMsQ0FBSSxtREFBbUQ7QUFDbEgsUUFBQSx1QkFBdUIsR0FBTSw4QkFBOEIsQ0FBQyxDQUFHLHFEQUFxRDtBQUNqSSxnQkFBZ0I7QUFFaEI7OztHQUdHO0FBRUg7SUFLSTtRQURBLG1CQUFjLEdBQUcsRUFBRSxDQUFDO1FBRWhCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO1lBQ3JCLE1BQU0sRUFBRSxtQkFBbUI7WUFDM0IsY0FBYyxFQUFFLElBQUk7WUFDcEIsWUFBWSxFQUFFLFVBQUMsS0FBZSxFQUFFLEdBQVcsRUFBRSxjQUFzQjtnQkFDL0QsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxjQUFjO29CQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ25ELENBQUM7U0FDSixFQUFFO1lBQ0MsTUFBTSxFQUFFLCtCQUErQjtZQUN2QyxjQUFjLEVBQUUsSUFBSTtZQUNwQixZQUFZLEVBQUUsVUFBQyxLQUFlLEVBQUUsR0FBVyxFQUFFLGNBQXNCO2dCQUMvRCxHQUFHLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxHQUFHLENBQUMsZUFBZSxLQUFL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