import {inject, injectable, optional} from "inversify";
import {BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES} from "./TYPES";
import {Git, GitImpl} from "./git";
import {Commit} from "./commit";
import {LocalityRecorder} from "bugfinder-framework";

@injectable()
export class CommitRecorder implements LocalityRecorder<Commit>{

    @optional() @inject(BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.git)
    git: Git

    async getLocalities(): Promise<Commit[]> {
        return this.git.logAll()
    }

}