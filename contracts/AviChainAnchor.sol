// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * AviChainAnchor — Immutable public registry of per-aircraft blockchain coin records.
 *
 * Each aircraft (FAA N-number) gets a unique on-chain anchor. When a coin is minted
 * in the AviChain browser app, the SHA-256 Merkle root of its full block chain is
 * written here as a permanent, ownerless public record. No admin keys, no upgrades,
 * no fees beyond gas. The record is the public record.
 *
 * Data sources anchored per coin:
 *   FAA Registration · NTSB CAROL Accidents · FAA Airmen · FAA SDRs ·
 *   FAA Form 337s · FAA Airworthiness Directives · OpenSky flight plans
 *
 * All field values are stored plaintext in the browser app (public federal records).
 * Only the Merkle root (tamper-detection fingerprint) is written on-chain here.
 */
contract AviChainAnchor {

    struct AnchorRecord {
        bytes32 merkleRoot;   // SHA-256 Merkle root of the full coin block chain
        uint256 blockNumber;  // Polygon block at time of anchoring
        uint256 timestamp;    // Unix timestamp
        uint32  chainLength;  // number of blocks in the coin chain at anchor time
    }

    // keccak256(nNumber) => ordered list of anchor records (grows as chain grows)
    mapping(bytes32 => AnchorRecord[]) private _anchors;

    // Ordered list of unique N-number keys for enumeration
    bytes32[] private _keys;
    mapping(bytes32 => bool) private _seen;

    // ── Events ────────────────────────────────────────────────────
    event Anchored(
        bytes32 indexed nKey,
        string          nNumber,
        bytes32         merkleRoot,
        uint32          chainLength,
        uint256         timestamp
    );

    // ── Write ─────────────────────────────────────────────────────

    /**
     * Anchor (or re-anchor) the Merkle root of an aircraft's coin chain.
     * Anyone can call this — no owner, no access control.
     * Called by the AviChain browser app after every coin mint.
     *
     * @param nNumber     FAA N-number exactly as entered (e.g. "N12345")
     * @param merkleRoot  SHA-256 Merkle root of the coin's block chain (as bytes32)
     * @param chainLength Number of blocks in the chain at this snapshot
     */
    function anchor(
        string  calldata nNumber,
        bytes32          merkleRoot,
        uint32           chainLength
    ) external {
        require(bytes(nNumber).length > 0,    "nNumber required");
        require(merkleRoot != bytes32(0),      "merkleRoot required");

        bytes32 nKey = keccak256(abi.encodePacked(nNumber));

        if (!_seen[nKey]) {
            _seen[nKey] = true;
            _keys.push(nKey);
        }

        _anchors[nKey].push(AnchorRecord({
            merkleRoot:  merkleRoot,
            blockNumber: block.number,
            timestamp:   block.timestamp,
            chainLength: chainLength
        }));

        emit Anchored(nKey, nNumber, merkleRoot, chainLength, block.timestamp);
    }

    // ── Read ──────────────────────────────────────────────────────

    /** Most recent anchor record for a given N-number. */
    function getLatestAnchor(string calldata nNumber)
        external view
        returns (AnchorRecord memory)
    {
        bytes32 nKey = keccak256(abi.encodePacked(nNumber));
        AnchorRecord[] storage recs = _anchors[nKey];
        require(recs.length > 0, "No anchor for this N-number");
        return recs[recs.length - 1];
    }

    /** Full anchor history for a given N-number. */
    function getAnchors(string calldata nNumber)
        external view
        returns (AnchorRecord[] memory)
    {
        return _anchors[keccak256(abi.encodePacked(nNumber))];
    }

    /** Number of times a given N-number has been anchored. */
    function anchorCount(string calldata nNumber)
        external view
        returns (uint256)
    {
        return _anchors[keccak256(abi.encodePacked(nNumber))].length;
    }

    /** Total distinct aircraft N-numbers anchored in this contract. */
    function totalAnchored() external view returns (uint256) {
        return _keys.length;
    }
}
