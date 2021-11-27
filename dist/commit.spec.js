"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var commit_1 = require("./commit");
describe("Traverse linear commit history", function () {
    var commits = [];
    for (var i = 0; i < 10; i++) {
        commits[i] = new commit_1.Commit();
        commits[i].hash = i.toString();
        commits[i].parentHashes = [];
        if (i > 0) {
            commits[i].parentHashes = [(i - 1).toString()];
        }
    }
    test("get all commits", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[9], commits, 10);
        var hashes = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0"];
        hashes.forEach(function (hash, index) {
            expect(predecessors[index].hash).toBe(hash);
        });
    });
    test("get more than all commits", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[9], commits, 15);
        var hashes = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0"];
        hashes.forEach(function (hash, index) {
            expect(predecessors[index].hash).toBe(hash);
        });
        expect(predecessors.length).toBe(10);
    });
    test("get less than all commits", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[9], commits, 5);
        var hashes = ["9", "8", "7", "6", "5"];
        hashes.forEach(function (hash, index) {
            expect(predecessors[index].hash).toBe(hash);
        });
        expect(predecessors.length).toBe(5);
    });
});
describe("Traverse: commit with 2 parents", function () {
    var commits = [];
    for (var i = 0; i < 5; i++) {
        commits[i] = new commit_1.Commit();
        commits[i].hash = i.toString();
        commits[i].parentHashes = [];
    }
    commits[4].parentHashes = ["1", "3"];
    commits[3].parentHashes = ["2"];
    commits[2].parentHashes = ["1"];
    commits[1].parentHashes = ["0"];
    commits[0].parentHashes = [];
    test("get all commits", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[4], commits, 5);
        var hashes = ["4", "3", "2", "1", "0"];
        hashes.forEach(function (hash, index) {
            expect(predecessors[index].hash).toBe(hash);
        });
        expect(predecessors.length).toBe(5);
    });
    test("get more than all commits", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[4], commits, 6);
        var hashes = ["4", "3", "2", "1", "0"];
        hashes.forEach(function (hash, index) {
            expect(predecessors[index].hash).toBe(hash);
        });
        expect(predecessors.length).toBe(5);
    });
    test("get less than all commits", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[4], commits, 3);
        var hashes = ["4", "3", "2"];
        hashes.forEach(function (hash, index) {
            expect(predecessors[index].hash).toBe(hash);
        });
        expect(predecessors.length).toBe(3);
    });
});
describe("Traverse: commit with 3 parents", function () {
    var commits = [];
    for (var i = 0; i < 10; i++) {
        commits[i] = new commit_1.Commit();
        commits[i].hash = i.toString();
        commits[i].parentHashes = [];
    }
    commits[9].parentHashes = ["1", "7", "8"];
    commits[8].parentHashes = ["0"];
    commits[7].parentHashes = ["5", "6"];
    commits[6].parentHashes = ["0"];
    commits[5].parentHashes = ["4"];
    commits[4].parentHashes = ["3"];
    commits[3].parentHashes = ["2"];
    commits[2].parentHashes = ["0"];
    commits[1].parentHashes = ["0"];
    commits[0].parentHashes = [];
    test("get all commits", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[9], commits, 10);
        var hashes = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0"];
        hashes.forEach(function (hash, index) {
            expect(predecessors[index].hash).toBe(hash);
        });
        expect(predecessors.length).toBe(10);
    });
    test("get more than all commits", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[9], commits, 11);
        var hashes = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0"];
        hashes.forEach(function (hash, index) {
            expect(predecessors[index].hash).toBe(hash);
        });
        expect(predecessors.length).toBe(10);
    });
    test("get less than all commits", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[9], commits, 3);
        var hashes = ["9", "8", "7"];
        hashes.forEach(function (hash, index) {
            expect(predecessors[index].hash).toBe(hash);
        });
        expect(predecessors.length).toBe(3);
    });
    test("get commits from middle node", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[8], commits, 1);
        expect(predecessors[0].hash).toBe("8");
        expect(predecessors.length).toBe(1);
        predecessors = commit_1.Commit.getPredecessorCommits(commits[8], commits, 4);
        expect(predecessors[0].hash).toBe("8");
        expect(predecessors[1].hash).toBe("0");
        expect(predecessors.length).toBe(2);
    });
});
describe("real commits with 3 parents:", function () {
    var readCommits = [
        {
            files: {
                files: [],
                changed: undefined,
                insertions: undefined,
                deletions: undefined
            },
            abbreviatedHash: 'ae077e1',
            abbreviatedTreeHash: '7f4f273',
            authorDate: 'Sat May 22 11:46:44 2021 +0200',
            authorDateISO8601LikeFormat: '2021-05-22 11:46:44 +0200',
            authorDateRFC2822Style: 'Sat, 22 May 2021 11:46:44 +0200',
            authorDateRelative: '6 hours ago',
            authorDateStrictIso8601Format: '2021-05-22T11:46:44+02:00',
            authorDateUnixTimeStamp: '1621676804',
            authorEmail: 'robert@k1inger.de',
            authorName: 'Robert Klinger',
            authorNameRespectingMailMap: 'Robert Klinger',
            committerDate: undefined,
            committerDateISO8601LikeFormat: '2021-05-22 11:46:44 +0200',
            committerDateRFC2822Style: undefined,
            committerDateRelative: '6 hours ago',
            committerDateStrictISO8601Format: '2021-05-22T11:46:44+02:00',
            committerDateUnixTimestamp: '1621676804',
            committerName: 'Robert Klinger',
            committerNameRespectingMailMap: 'Robert Klinger',
            hash: 'ae077e1f1e15920a193ff3930663384ece781237',
            rawBody: "Merge commit 'e7cb9d491c4511aaa82aff1e2481d42d99b6617a'; commit '91699d7ed96a51466a69b9571cbbdf63330c70a2' into master\n",
            showG: 'N',
            subject: "Merge commit 'e7cb9d491c4511aaa82aff1e2481d42d99b6617a'; commit '91699d7ed96a51466a69b9571cbbdf63330c70a2' into master",
            treeHash: '7f4f273055a3ce83f1b98f9117b5a204efe0058b',
            parentHashes: [
                '23d17e4c21f1f8fa36be5adc5e0f9d6fa1a27bfe',
                'e7cb9d491c4511aaa82aff1e2481d42d99b6617a',
                '91699d7ed96a51466a69b9571cbbdf63330c70a2'
            ],
            abbreviatedParentHashes: ['23d17e4', 'e7cb9d4', '91699d7'],
            authorEmailLocalPart: 'robert',
            authorEmailLocalPartRespectingMailMap: 'robert',
            authorDateShortFormat: '2021-05-22',
            committerEmail: 'robert@k1inger.de',
            committerEmailRespectingMailMap: 'robert@k1inger.de',
            committerEmailLocalPart: 'robert',
            committerEmailLocalPartRespectingMailMap: 'robert',
            committerDateShortFormat: '2021-05-22',
            refNames: [' (HEAD -> master)'],
            refNamesWithoutCommaWrapping: ['HEAD -> master'],
            refNameGivenOnTheCommandLineByWhichTheCommitWasReached: 'HEAD',
            encoding: '',
            sanitizedSubjectLineSuitableForAFileName: 'Merge-commit-e7cb9d491c4511aaa82aff1e2481d42d99b6617a-commit-91699d7ed96a51466a69b9571cbbdf63330c70a2-into-master',
            body: '',
            commitNotes: '',
            rawVerificationMessageFromGPGForASignedCommit: '',
            signerNameOfSignedCommit: undefined,
            keyOfSignedCommit: '',
            fingerprintOfKeyToSignSignedCommit: '',
            fingerprintOfPrimaryKeyWhoseSubKeyWasUsedToSignACommit: '',
            trustLevelOfKeyOfSignedCommit: 'undefined',
            reflogSelector: '',
            shortenedReflogSelector: '',
            reflogIdentityName: '',
            reflogIdentityEmail: '',
            reflogIdentityEmailRespectingMailMap: '',
            reflogSubject: '',
            file: undefined
        },
        {
            files: { files: [Array], changed: 1, insertions: 0, deletions: 0 },
            abbreviatedHash: '23d17e4',
            abbreviatedTreeHash: 'e863d33',
            authorDate: 'Sat May 22 11:46:44 2021 +0200',
            authorDateISO8601LikeFormat: '2021-05-22 11:46:44 +0200',
            authorDateRFC2822Style: 'Sat, 22 May 2021 11:46:44 +0200',
            authorDateRelative: '6 hours ago',
            authorDateStrictIso8601Format: '2021-05-22T11:46:44+02:00',
            authorDateUnixTimeStamp: '1621676804',
            authorEmail: 'robert@k1inger.de',
            authorName: 'Robert Klinger',
            authorNameRespectingMailMap: 'Robert Klinger',
            committerDate: undefined,
            committerDateISO8601LikeFormat: '2021-05-22 11:46:44 +0200',
            committerDateRFC2822Style: undefined,
            committerDateRelative: '6 hours ago',
            committerDateStrictISO8601Format: '2021-05-22T11:46:44+02:00',
            committerDateUnixTimestamp: '1621676804',
            committerName: 'Robert Klinger',
            committerNameRespectingMailMap: 'Robert Klinger',
            hash: '23d17e4c21f1f8fa36be5adc5e0f9d6fa1a27bfe',
            rawBody: '3\n',
            showG: 'N',
            subject: '3',
            treeHash: 'e863d33df86a2bcbf98a53ac86f5469f4ea1d2c9',
            parentHashes: ['48b039f0eae6faa72d672b200bcca9c922e3ac5b'],
            abbreviatedParentHashes: ['48b039f'],
            authorEmailLocalPart: 'robert',
            authorEmailLocalPartRespectingMailMap: 'robert',
            authorDateShortFormat: '2021-05-22',
            committerEmail: 'robert@k1inger.de',
            committerEmailRespectingMailMap: 'robert@k1inger.de',
            committerEmailLocalPart: 'robert',
            committerEmailLocalPartRespectingMailMap: 'robert',
            committerDateShortFormat: '2021-05-22',
            refNames: [''],
            refNamesWithoutCommaWrapping: [''],
            refNameGivenOnTheCommandLineByWhichTheCommitWasReached: 'HEAD',
            encoding: '',
            sanitizedSubjectLineSuitableForAFileName: '3',
            body: '',
            commitNotes: '',
            rawVerificationMessageFromGPGForASignedCommit: '',
            signerNameOfSignedCommit: undefined,
            keyOfSignedCommit: '',
            fingerprintOfKeyToSignSignedCommit: '',
            fingerprintOfPrimaryKeyWhoseSubKeyWasUsedToSignACommit: '',
            trustLevelOfKeyOfSignedCommit: 'undefined',
            reflogSelector: '',
            shortenedReflogSelector: '',
            reflogIdentityName: '',
            reflogIdentityEmail: '',
            reflogIdentityEmailRespectingMailMap: '',
            reflogSubject: '',
            file: {
                path: '3.txt',
                type: 'added',
                changes: 0,
                insertions: 0,
                deletions: 0
            }
        },
        {
            files: { files: [Array], changed: 1, insertions: 0, deletions: 0 },
            abbreviatedHash: 'e7cb9d4',
            abbreviatedTreeHash: '82e7b18',
            authorDate: 'Sat May 22 11:46:43 2021 +0200',
            authorDateISO8601LikeFormat: '2021-05-22 11:46:43 +0200',
            authorDateRFC2822Style: 'Sat, 22 May 2021 11:46:43 +0200',
            authorDateRelative: '6 hours ago',
            authorDateStrictIso8601Format: '2021-05-22T11:46:43+02:00',
            authorDateUnixTimeStamp: '1621676803',
            authorEmail: 'robert@k1inger.de',
            authorName: 'Robert Klinger',
            authorNameRespectingMailMap: 'Robert Klinger',
            committerDate: undefined,
            committerDateISO8601LikeFormat: '2021-05-22 11:46:43 +0200',
            committerDateRFC2822Style: undefined,
            committerDateRelative: '6 hours ago',
            committerDateStrictISO8601Format: '2021-05-22T11:46:43+02:00',
            committerDateUnixTimestamp: '1621676803',
            committerName: 'Robert Klinger',
            committerNameRespectingMailMap: 'Robert Klinger',
            hash: 'e7cb9d491c4511aaa82aff1e2481d42d99b6617a',
            rawBody: '1\n',
            showG: 'N',
            subject: '1',
            treeHash: '82e7b18c6339653ccac16f82278df2bf54980fb4',
            parentHashes: ['48b039f0eae6faa72d672b200bcca9c922e3ac5b'],
            abbreviatedParentHashes: ['48b039f'],
            authorEmailLocalPart: 'robert',
            authorEmailLocalPartRespectingMailMap: 'robert',
            authorDateShortFormat: '2021-05-22',
            committerEmail: 'robert@k1inger.de',
            committerEmailRespectingMailMap: 'robert@k1inger.de',
            committerEmailLocalPart: 'robert',
            committerEmailLocalPartRespectingMailMap: 'robert',
            committerDateShortFormat: '2021-05-22',
            refNames: [''],
            refNamesWithoutCommaWrapping: [''],
            refNameGivenOnTheCommandLineByWhichTheCommitWasReached: 'HEAD',
            encoding: '',
            sanitizedSubjectLineSuitableForAFileName: '1',
            body: '',
            commitNotes: '',
            rawVerificationMessageFromGPGForASignedCommit: '',
            signerNameOfSignedCommit: undefined,
            keyOfSignedCommit: '',
            fingerprintOfKeyToSignSignedCommit: '',
            fingerprintOfPrimaryKeyWhoseSubKeyWasUsedToSignACommit: '',
            trustLevelOfKeyOfSignedCommit: 'undefined',
            reflogSelector: '',
            shortenedReflogSelector: '',
            reflogIdentityName: '',
            reflogIdentityEmail: '',
            reflogIdentityEmailRespectingMailMap: '',
            reflogSubject: '',
            file: {
                path: '1.txt',
                type: 'added',
                changes: 0,
                insertions: 0,
                deletions: 0
            }
        },
        {
            files: { files: [Array], changed: 1, insertions: 0, deletions: 0 },
            abbreviatedHash: '91699d7',
            abbreviatedTreeHash: '4a94ea3',
            authorDate: 'Sat May 22 11:46:43 2021 +0200',
            authorDateISO8601LikeFormat: '2021-05-22 11:46:43 +0200',
            authorDateRFC2822Style: 'Sat, 22 May 2021 11:46:43 +0200',
            authorDateRelative: '6 hours ago',
            authorDateStrictIso8601Format: '2021-05-22T11:46:43+02:00',
            authorDateUnixTimeStamp: '1621676803',
            authorEmail: 'robert@k1inger.de',
            authorName: 'Robert Klinger',
            authorNameRespectingMailMap: 'Robert Klinger',
            committerDate: undefined,
            committerDateISO8601LikeFormat: '2021-05-22 11:46:43 +0200',
            committerDateRFC2822Style: undefined,
            committerDateRelative: '6 hours ago',
            committerDateStrictISO8601Format: '2021-05-22T11:46:43+02:00',
            committerDateUnixTimestamp: '1621676803',
            committerName: 'Robert Klinger',
            committerNameRespectingMailMap: 'Robert Klinger',
            hash: '91699d7ed96a51466a69b9571cbbdf63330c70a2',
            rawBody: '2\n',
            showG: 'N',
            subject: '2',
            treeHash: '4a94ea3fb72a188730010731f4aa7bc99250fff1',
            parentHashes: ['48b039f0eae6faa72d672b200bcca9c922e3ac5b'],
            abbreviatedParentHashes: ['48b039f'],
            authorEmailLocalPart: 'robert',
            authorEmailLocalPartRespectingMailMap: 'robert',
            authorDateShortFormat: '2021-05-22',
            committerEmail: 'robert@k1inger.de',
            committerEmailRespectingMailMap: 'robert@k1inger.de',
            committerEmailLocalPart: 'robert',
            committerEmailLocalPartRespectingMailMap: 'robert',
            committerDateShortFormat: '2021-05-22',
            refNames: [''],
            refNamesWithoutCommaWrapping: [''],
            refNameGivenOnTheCommandLineByWhichTheCommitWasReached: 'HEAD',
            encoding: '',
            sanitizedSubjectLineSuitableForAFileName: '2',
            body: '',
            commitNotes: '',
            rawVerificationMessageFromGPGForASignedCommit: '',
            signerNameOfSignedCommit: undefined,
            keyOfSignedCommit: '',
            fingerprintOfKeyToSignSignedCommit: '',
            fingerprintOfPrimaryKeyWhoseSubKeyWasUsedToSignACommit: '',
            trustLevelOfKeyOfSignedCommit: 'undefined',
            reflogSelector: '',
            shortenedReflogSelector: '',
            reflogIdentityName: '',
            reflogIdentityEmail: '',
            reflogIdentityEmailRespectingMailMap: '',
            reflogSubject: '',
            file: {
                path: '2.txt',
                type: 'added',
                changes: 0,
                insertions: 0,
                deletions: 0
            }
        },
        {
            files: { files: [Array], changed: 1, insertions: 0, deletions: 0 },
            abbreviatedHash: '48b039f',
            abbreviatedTreeHash: '18e5881',
            authorDate: 'Sat May 22 11:46:43 2021 +0200',
            authorDateISO8601LikeFormat: '2021-05-22 11:46:43 +0200',
            authorDateRFC2822Style: 'Sat, 22 May 2021 11:46:43 +0200',
            authorDateRelative: '6 hours ago',
            authorDateStrictIso8601Format: '2021-05-22T11:46:43+02:00',
            authorDateUnixTimeStamp: '1621676803',
            authorEmail: 'robert@k1inger.de',
            authorName: 'Robert Klinger',
            authorNameRespectingMailMap: 'Robert Klinger',
            committerDate: undefined,
            committerDateISO8601LikeFormat: '2021-05-22 11:46:43 +0200',
            committerDateRFC2822Style: undefined,
            committerDateRelative: '6 hours ago',
            committerDateStrictISO8601Format: '2021-05-22T11:46:43+02:00',
            committerDateUnixTimestamp: '1621676803',
            committerName: 'Robert Klinger',
            committerNameRespectingMailMap: 'Robert Klinger',
            hash: '48b039f0eae6faa72d672b200bcca9c922e3ac5b',
            rawBody: 'root\n',
            showG: 'N',
            subject: 'root',
            treeHash: '18e58814dccdb004fb9c0e4a2d31e93d80a2c501',
            parentHashes: [],
            abbreviatedParentHashes: [],
            authorEmailLocalPart: 'robert',
            authorEmailLocalPartRespectingMailMap: 'robert',
            authorDateShortFormat: '2021-05-22',
            committerEmail: 'robert@k1inger.de',
            committerEmailRespectingMailMap: 'robert@k1inger.de',
            committerEmailLocalPart: 'robert',
            committerEmailLocalPartRespectingMailMap: 'robert',
            committerDateShortFormat: '2021-05-22',
            refNames: [''],
            refNamesWithoutCommaWrapping: [''],
            refNameGivenOnTheCommandLineByWhichTheCommitWasReached: 'HEAD',
            encoding: '',
            sanitizedSubjectLineSuitableForAFileName: 'root',
            body: '',
            commitNotes: '',
            rawVerificationMessageFromGPGForASignedCommit: '',
            signerNameOfSignedCommit: undefined,
            keyOfSignedCommit: '',
            fingerprintOfKeyToSignSignedCommit: '',
            fingerprintOfPrimaryKeyWhoseSubKeyWasUsedToSignACommit: '',
            trustLevelOfKeyOfSignedCommit: 'undefined',
            reflogSelector: '',
            shortenedReflogSelector: '',
            reflogIdentityName: '',
            reflogIdentityEmail: '',
            reflogIdentityEmailRespectingMailMap: '',
            reflogSubject: '',
            file: {
                path: 'root.txt',
                type: 'added',
                changes: 0,
                insertions: 0,
                deletions: 0
            }
        }
    ];
    var commits = [];
    for (var i = 0; i < 5; i++) {
        commits[i] = new commit_1.Commit();
        commits[i] = _.merge(commits[i], readCommits[i]);
    }
    test("get all commits", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[0], commits, 5);
        var hashes = ["ae077e1f1e15920a193ff3930663384ece781237", "91699d7ed96a51466a69b9571cbbdf63330c70a2",
            "e7cb9d491c4511aaa82aff1e2481d42d99b6617a", "23d17e4c21f1f8fa36be5adc5e0f9d6fa1a27bfe",
            "48b039f0eae6faa72d672b200bcca9c922e3ac5b"];
        hashes.forEach(function (hash, index) {
            expect(predecessors[index].hash).toBe(hash);
        });
        expect(predecessors.length).toBe(5);
    });
    test("get more than all", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[0], commits, 5);
        var hashes = ["ae077e1f1e15920a193ff3930663384ece781237", "91699d7ed96a51466a69b9571cbbdf63330c70a2",
            "e7cb9d491c4511aaa82aff1e2481d42d99b6617a", "23d17e4c21f1f8fa36be5adc5e0f9d6fa1a27bfe",
            "48b039f0eae6faa72d672b200bcca9c922e3ac5b"];
        hashes.forEach(function (hash, index) {
            expect(predecessors[index].hash).toBe(hash);
        });
        expect(predecessors.length).toBe(5);
    });
    test("get less than all", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[0], commits, 3);
        var hashes = ["ae077e1f1e15920a193ff3930663384ece781237", "91699d7ed96a51466a69b9571cbbdf63330c70a2",
            "e7cb9d491c4511aaa82aff1e2481d42d99b6617a"];
        hashes.forEach(function (hash, index) {
            expect(predecessors[index].hash).toBe(hash);
        });
        expect(predecessors.length).toBe(3);
    });
    test("get self", function () {
        var predecessors = commit_1.Commit.getPredecessorCommits(commits[4], commits, 5); //(commits[0], commits, 5);
        var hashes = ["48b039f0eae6faa72d672b200bcca9c922e3ac5b"];
        hashes.forEach(function (hash, index) {
            expect(predecessors[index].hash).toBe(hash);
        });
        expect(hashes.length).toBe(1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29tbWl0LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0NBQTRCO0FBQzVCLG1DQUFnQztBQUdoQyxRQUFRLENBQUMsZ0NBQWdDLEVBQUU7SUFDdkMsSUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO0lBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDekIsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7UUFDMUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDL0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1AsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7U0FDakQ7S0FDSjtJQUVELElBQUksQ0FBQyxpQkFBaUIsRUFBRTtRQUNwQixJQUFNLFlBQVksR0FBRyxlQUFNLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMzRSxJQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSztZQUN2QixNQUFN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