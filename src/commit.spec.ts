import * as _ from "lodash";
import {Commit} from "./commit";


describe("Traverse linear commit history", () => {
    const commits: Commit[] = [];
    for (let i = 0; i < 10; i++) {
        commits[i] = new Commit();
        commits[i].hash = i.toString();
        commits[i].parentHashes = [];
        if (i > 0) {
            commits[i].parentHashes = [(i - 1).toString()]
        }
    }

    test("get all commits", () => {
        const predecessors = Commit.getPredecessorCommits(commits[9], commits, 10);
        const hashes = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0"];
        hashes.forEach((hash, index) => {
            expect(predecessors[index].hash).toBe(hash);
        })
    });


    test("get more than all commits", () => {
        const predecessors = Commit.getPredecessorCommits(commits[9], commits, 15);
        const hashes = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0"];
        hashes.forEach((hash, index) => {
            expect(predecessors[index].hash).toBe(hash);
        })
        expect(predecessors.length).toBe(10);
    });

    test("get less than all commits", () => {
        const predecessors = Commit.getPredecessorCommits(commits[9], commits, 5);
        const hashes = ["9", "8", "7", "6", "5"];
        hashes.forEach((hash, index) => {
            expect(predecessors[index].hash).toBe(hash);
        })
        expect(predecessors.length).toBe(5);
    });

})


describe("Traverse: commit with 2 parents", () => {
    const commits: Commit[] = [];
    for (let i = 0; i < 5; i++) {
        commits[i] = new Commit();
        commits[i].hash = i.toString();
        commits[i].parentHashes = [];
    }

    commits[4].parentHashes = ["1", "3"];
    commits[3].parentHashes = ["2"];
    commits[2].parentHashes = ["1"];
    commits[1].parentHashes = ["0"];
    commits[0].parentHashes = [];

    test("get all commits", () => {
        const predecessors = Commit.getPredecessorCommits(commits[4], commits, 5);

        const hashes = ["4", "3", "2", "1", "0"];
        hashes.forEach((hash, index) => {
            expect(predecessors[index].hash).toBe(hash);
        })
        expect(predecessors.length).toBe(5);
    });


    test("get more than all commits", () => {
        const predecessors = Commit.getPredecessorCommits(commits[4], commits, 6);

        const hashes = ["4", "3", "2", "1", "0"];
        hashes.forEach((hash, index) => {
            expect(predecessors[index].hash).toBe(hash);
        })
        expect(predecessors.length).toBe(5);
    });

    test("get less than all commits", () => {
        const predecessors = Commit.getPredecessorCommits(commits[4], commits, 3);

        const hashes = ["4", "3", "2"];
        hashes.forEach((hash, index) => {
            expect(predecessors[index].hash).toBe(hash);
        })
        expect(predecessors.length).toBe(3);
    });


})

describe("Traverse: commit with 3 parents", () => {

    const commits: Commit[] = [];
    for (let i = 0; i < 10; i++) {
        commits[i] = new Commit();
        commits[i].hash = i.toString();
        commits[i].parentHashes = [];
    }

    commits[9].parentHashes = ["1", "7", "8"]
    commits[8].parentHashes = ["0"];
    commits[7].parentHashes = ["5", "6"];
    commits[6].parentHashes = ["0"];
    commits[5].parentHashes = ["4"];
    commits[4].parentHashes = ["3"];
    commits[3].parentHashes = ["2"];
    commits[2].parentHashes = ["0"];
    commits[1].parentHashes = ["0"];
    commits[0].parentHashes = [];

    test("get all commits", () => {
        const predecessors = Commit.getPredecessorCommits(commits[9], commits, 10);

        const hashes = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0"];
        hashes.forEach((hash, index) => {
            expect(predecessors[index].hash).toBe(hash);
        })
        expect(predecessors.length).toBe(10);
    });

    test("get more than all commits", () => {
        const predecessors = Commit.getPredecessorCommits(commits[9], commits, 11);

        const hashes = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0"];
        hashes.forEach((hash, index) => {
            expect(predecessors[index].hash).toBe(hash);
        })
        expect(predecessors.length).toBe(10);
    });

    test("get less than all commits", () => {
        const predecessors = Commit.getPredecessorCommits(commits[9], commits, 3);

        const hashes = ["9", "8", "7"];
        hashes.forEach((hash, index) => {
            expect(predecessors[index].hash).toBe(hash);
        })
        expect(predecessors.length).toBe(3);
    });

    test("get commits from middle node", () => {
        let predecessors = Commit.getPredecessorCommits(commits[8], commits, 1)
        expect(predecessors[0].hash).toBe("8")
        expect(predecessors.length).toBe(1);
        predecessors = Commit.getPredecessorCommits(commits[8], commits, 4);
        expect(predecessors[0].hash).toBe("8")
        expect(predecessors[1].hash).toBe("0")
        expect(predecessors.length).toBe(2);
    })


})

describe("real commits with 3 parents:", () => {

    const readCommits =

        [
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
                files: {files: [Array], changed: 1, insertions: 0, deletions: 0},
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
                files: {files: [Array], changed: 1, insertions: 0, deletions: 0},
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
                files: {files: [Array], changed: 1, insertions: 0, deletions: 0},
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
                files: {files: [Array], changed: 1, insertions: 0, deletions: 0},
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
        ]

    const commits: Commit[] = [];
    for (let i = 0; i < 5; i++) {
        commits[i] = new Commit();
        commits[i] = _.merge(commits[i], readCommits[i]);
    }

    test("get all commits", () => {
        const predecessors = Commit.getPredecessorCommits(commits[0], commits, 5);
        const hashes = ["ae077e1f1e15920a193ff3930663384ece781237", "91699d7ed96a51466a69b9571cbbdf63330c70a2",
            "e7cb9d491c4511aaa82aff1e2481d42d99b6617a", "23d17e4c21f1f8fa36be5adc5e0f9d6fa1a27bfe",
            "48b039f0eae6faa72d672b200bcca9c922e3ac5b"];

        hashes.forEach((hash, index) => {
            expect(predecessors[index].hash).toBe(hash);
        })
        expect(predecessors.length).toBe(5);
    });

    test("get more than all", () => {
        const predecessors = Commit.getPredecessorCommits(commits[0], commits, 5);
        const hashes = ["ae077e1f1e15920a193ff3930663384ece781237", "91699d7ed96a51466a69b9571cbbdf63330c70a2",
            "e7cb9d491c4511aaa82aff1e2481d42d99b6617a", "23d17e4c21f1f8fa36be5adc5e0f9d6fa1a27bfe",
            "48b039f0eae6faa72d672b200bcca9c922e3ac5b"];

        hashes.forEach((hash, index) => {
            expect(predecessors[index].hash).toBe(hash);
        })
        expect(predecessors.length).toBe(5);
    });

    test("get less than all", () => {
        const predecessors = Commit.getPredecessorCommits(commits[0], commits, 3);
        const hashes = ["ae077e1f1e15920a193ff3930663384ece781237", "91699d7ed96a51466a69b9571cbbdf63330c70a2",
            "e7cb9d491c4511aaa82aff1e2481d42d99b6617a"];

        hashes.forEach((hash, index) => {
            expect(predecessors[index].hash).toBe(hash);
        })
        expect(predecessors.length).toBe(3);
    });

    test("get self", () => {
        const predecessors = Commit.getPredecessorCommits(commits[4], commits, 5)//(commits[0], commits, 5);
        const hashes = ["48b039f0eae6faa72d672b200bcca9c922e3ac5b"];

        hashes.forEach((hash, index) => {
            expect(predecessors[index].hash).toBe(hash);
        })
        expect(hashes.length).toBe(1);
    })
})