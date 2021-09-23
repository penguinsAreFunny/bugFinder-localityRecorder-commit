import {FormatParser, Git, GitImpl, MADFilesFromCommit, MADFilesFromLogImpl} from "./git";
import {BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES} from "./TYPES";
import {localityAContainer} from "bugfinder-framework-defaultcontainer";

export * from "./commit"
export * from "./commitRecorder"
export * from "./git"
export * from "./TYPES"

/**
 * Default configuration
 */
localityAContainer.bind<Git>                 (BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.git).to(GitImpl)
localityAContainer.bind<FormatParser>        (BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.gitCommitParser).to(FormatParser)
localityAContainer.bind<MADFilesFromCommit>  (BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.madFilesFromCommitParser).to(MADFilesFromLogImpl)