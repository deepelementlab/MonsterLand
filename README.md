# MonsterLand
A collection of innovative games and tools developed with our ClawCode tool — providing inspiration and creative reference for interested partners to explore and grow together.

<img width="1776" height="874" alt="Screenshot - 2026-04-12 14 19 22" src="https://github.com/user-attachments/assets/5cd7ba7f-b83a-4d3a-a42b-eb60d4c5c74e" />

# Overview

This document compares **racing / car games**, **monster / combat games**, and **Tetris-style block puzzlers** across creative direction and engineering considerations—useful for scoping, staffing, and technical risk assessment.

| Dimension | Car (Racing / Driving) | Monster (Combat / Horde / Defense) | Tetris (Falling-Block Puzzle) |
|-----------|------------------------|-------------------------------------|-------------------------------|
| **Working title / genre** | Racing, obstacle runner, or endless-runner variants | Monster shooter, tower defense, horde survival, roguelike enemy waves | Tetris / falling-block stacker |
| **Creative pillar** | Speed and reflex: forward motion with high stakes for lane choice and near-miss tension | Progression and strategy: loadouts, resource economy, enemy typing, encounter pacing | Spatial planning and rhythm: stacking pressure with line clears as relief |
| **Core loop** | Accelerate / drift / pick-ups → avoid hazards → escalating difficulty | Explore or hold a point → fight waves → loot / upgrades → boss or wave payout | Spawn piece → rotate / translate → lock → clear full rows → rising tempo |
| **Key engineering systems** | Physics or pseudo-physics (rigidbody / ground probes), camera follow + FOV, procedural track or tile streaming, object pooling (props / traffic) | State machines (AI / player), collision layers, damage + buff/debuff, pathfinding (TD/RPG), saves + data-driven tuning (tables / assets) | Grid model (2D buffer), rotation with wall kicks (e.g., SRS), line clear + gravity collapse, ghost piece, bag randomizer (e.g., 7-bag) |
| **Typical tech stack** | Unity/Godot + physics; or WebGL/Canvas with simplified motion integration | Same engines; heavier UI + content pipelines (JSON / ScriptableObjects) | Any engine; strong fit for Canvas/Web; logic/render split aids unit testing |
| **Performance focus** | Many instances on screen, LOD/culling, particles and post-processing budget | AI count, projectile / AoE queries, VFX caps, peak on-screen units | Frequent grid updates but small data; watch GC spikes (e.g., C#) and input latency |
| **Testability** | Feel-heavy; benefit from deterministic seeds, replay tooling, telemetry | Table-driven tuning + AI snapshots; scenario tests for encounters | **Highly rule-driven**; excellent for unit tests (rotation, lock, clears, scoring) |
| **Natural extensions** | Nitro, parts tuning, weather/day-night, networked racing | Builds/crafting, elemental synergies, level editor, seasonal content | Versus garbage lines, marathon/sprint modes, themes/skins |

## One-line guidance

- **Car**: prioritize **physics, camera, and content pipeline** for polish and throughput.  
- **Monster**: prioritize **combat framework, data tuning, and AI** for depth and replayability.  
- **Tetris**: prioritize **deterministic grid rules** for correctness and competitive fairness.

## Legal / naming note

**Tetris** is a commercial brand with protected elements; shipping publicly may require **trademark and IP review** (name, specific rule bundles, art). For open-source learning, consider describing the product as a **“falling-block puzzle”** where appropriate.

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE))
- MIT License ([LICENSE-MIT](LICENSE-MIT))

at your option.
