import { Git } from "./git";
import { Commit } from "./commit";
import { LocalityRecorder } from "bugfinder-framework";
export declare class CommitRecorder implements LocalityRecorder<Commit> {
    git: Git;
    getLocalities(): Promise<Commit[]>;
}
