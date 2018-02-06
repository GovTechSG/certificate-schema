# Certificate Schema v1.0

## Introduction

An example of a valid certificate:

```
{
    "type": "Assertion",
    "issuedOn": "2017-05-01",
    "id": "urn:uuid:8e0b8a28-beff-43de-a72c-820bc360db3d",
    "@context": [
        "https://openbadgespec.org/v2/context.json",
        "https://govtechsg.github.io/certificate-schema/schema/1.0/context.json"
    ],
    "badge": {
        "type": "BadgeClass",
        "issuer": {
            "type": "Profile",
            "id": "https://www.nus.edu.sg/profile.json",
            "url": "https://www.nus.edu.sg",
            "name": "National University of Singapore"
        },
        "name": "BACHELOR OF ARTS",
        "criteria": {
            "narrative": "Student must complete all require academic units"
        },
        "evidencePrivacyFilter": {
            "type": "SaltedProof",
            "saltLength": "10"
        },
        "evidence": {
            "transcript": [{
                "name": "AUSJDLEOFP:AN INTRODUCTION TO LITERARY STUDIES",
                "grade": "DUEJFOSDEL:C+",
                "courseCredit": "UDIFMCJSPD:4.00",
                "courseCode": "EPDUSJCNZL:EN1101E"
            },{
                "name": "PAJSUDJCHS:EINSTEIN's UNIVERSE & QUANTUM WEIRDNESS",
                "grade": "IWUEJDKZMS:C+",
                "courseCredit": "QPWOEKDNZJ:4.00",
                "courseCode": "KSIDMAJJAP:PC1325"
            }]
        }
    },
    "verification": {
        "type": "ETHStoreProof",
        "contractAddress": "0x76bc9e61a1904b82cbf70d1fd9c0f8a120483bbb"
    },
    "signature": {
        "type": "ETHStoreProof",
        "targetHash": "0x76bc9e61a1904b82cbf70d1fd9c0f8a120483bbb",
        "proof": [
            "0x76bc9e61a1904b82cbf70d1fd9c0f8a120483bbb",
            "0x76bc9e61a1904b82cbf70d1fd9c0f8a120483bbb"
        ],
        "merkleRoot": "0x76bc9e61a1904b82cbf70d1fd9c0f8a120483bbb"
    },
    "recipient": [{
        "type": "email",
        "identity": "sample@example.com"
    },{
        "type": "did",
        "identity": "did:example:123456789abcdefghi"
    }]
}
```

## Summary of extensions to Open Badge v2

- Blockchain verification type `ETHStoreProof`
- Identity type `did`
- Addition of `transcript` data in `evidence`

## Verification of certificate

### Step 1. Remove signature

```
{
    "type": "Assertion",
    "issuedOn": "2017-05-01",
    "id": "urn:uuid:8e0b8a28-beff-43de-a72c-820bc360db3d",
    "@context": [
        "https://openbadgespec.org/v2/context.json",
        "https://govtechsg.github.io/certificate-schema/schema/1.0/context.json"
    ],
    "badge": {
        "type": "BadgeClass",
        "issuer": {
            "type": "Profile",
            "id": "https://www.nus.edu.sg/profile.json",
            "url": "https://www.nus.edu.sg",
            "name": "National University of Singapore"
        },
        "name": "BACHELOR OF ARTS",
        "criteria": {
            "narrative": "Student must complete all require academic units"
        },
        "evidencePrivacyFilter": {
            "type": "SaltedProof",
            "saltLength": "10"
        },
        "evidence": {
            "transcript": [{
                "name": "AUSJDLEOFP:AN INTRODUCTION TO LITERARY STUDIES",
                "grade": "DUEJFOSDEL:C+",
                "courseCredit": "UDIFMCJSPD:4.00",
                "courseCode": "EPDUSJCNZL:EN1101E"
            },{
            },{
                "name": "PAJSUDJCHS:EINSTEIN's UNIVERSE & QUANTUM WEIRDNESS",
                "grade": "IWUEJDKZMS:C+",
                "courseCredit": "QPWOEKDNZJ:4.00",
                "courseCode": "KSIDMAJJAP:PC1325"
            }]
        }
        "privateEvidence": [
        	"SOME_HASH_REPRESENTING_SOME_EVIDENCE_1",
        	"SOME_HASH_REPRESENTING_SOME_EVIDENCE_2",
        	"SOME_HASH_REPRESENTING_SOME_EVIDENCE_3"
        ]
    },
    "verification": {
        "type": "ETHStoreProof",
        "contractAddress": "0x76bc9e61a1904b82cbf70d1fd9c0f8a120483bbb"
    },
    "recipient": [{
        "type": "email",
        "identity": "sample@example.com"
    },{
        "type": "did",
        "identity": "did:example:123456789abcdefghi"
    }]
}
```

### Step 2. Compute evidence hash

1. Normalise evidence object
2. Hash individual lines
3. Sort hashes in accending order
4. Compute hash for all lines, including private hashes from `privateEvidence`

```
{
    "type": "Assertion",
    "issuedOn": "2017-05-01",
    "id": "urn:uuid:8e0b8a28-beff-43de-a72c-820bc360db3d",
    "@context": [
        "https://openbadgespec.org/v2/context.json",
        "https://govtechsg.github.io/certificate-schema/schema/1.0/context.json"
    ],
    "badge": {
        "type": "BadgeClass",
        "issuer": {
            "type": "Profile",
            "id": "https://www.nus.edu.sg/profile.json",
            "url": "https://www.nus.edu.sg",
            "name": "National University of Singapore"
        },
        "name": "BACHELOR OF ARTS",
        "criteria": {
            "narrative": "Student must complete all require academic units"
        },
        "evidencePrivacyFilter": {
            "type": "SaltedProof",
            "saltLength": "10"
        },
        "evidence": "SOME_HASH_GOES_HERE"
    },
    "verification": {
        "type": "ETHStoreProof",
        "contractAddress": "0x76bc9e61a1904b82cbf70d1fd9c0f8a120483bbb"
    },
    "recipient": [{
        "type": "email",
        "identity": "sample@example.com"
    },{
        "type": "did",
        "identity": "did:example:123456789abcdefghi"
    }]
}
```

### Step 3. Verify signature

1. Perform RDF Dataset Normalisation to get target hash
2. Ensure target hash matches that in signature
3. Ensure that merkle root matches target root and proof

### Step 4. Verify merkle root on smart contract

Ensure that the merkle root is valid on the contract at the address

### Step 5. Verify that the contract is owned by issuing institution


## Certificate Vocabulary

TBD