# MonsterLand
A collection of innovative games and tools developed with our ClawCode tool — providing inspiration and creative reference for interested partners to explore and grow together.

<img width="1776" height="874" alt="Screenshot - 2026-04-12 14 19 22" src="https://github.com/user-attachments/assets/5cd7ba7f-b83a-4d3a-a42b-eb60d4c5c74e" />

# Overview

This document compares **racing / car games**, **monster / combat games**, and **Tetris-style block puzzlers** across creative direction and engineering considerations—useful for scoping, staffing, and technical risk assessment.

| | Working title / genre | Creative pillar | Core loop | Key engineering systems | Typical tech stack | Performance focus | Testability | Natural extensions |
|---|---------------------|----------------|----------|---------------------------|--------------------|------------------|-------------|---------------------|
| **<a href="./car">Car**</a> | Racing, obstacle runner, or endless-runner variants | Speed and reflex: forward motion with high stakes for lane choice and near-miss tension | Accelerate / drift / pick-ups → avoid hazards → escalating difficulty | Physics or pseudo-physics (rigidbody / ground probes), camera follow + FOV, procedural track or tile streaming, object pooling (props / traffic) | Unity/Godot + physics; or WebGL/Canvas with simplified motion integration | Many instances on screen, LOD/culling, particles and post-processing budget | Feel-heavy; benefit from deterministic seeds, replay tooling, telemetry | Nitro, parts tuning, weather/day-night, networked racing |
| **<a href="./monster">Monster</a>** | Monster shooter, tower defense, horde survival, roguelike enemy waves | Progression and strategy: loadouts, resource economy, enemy typing, encounter pacing | Explore or hold a point → fight waves → loot / upgrades → boss or wave payout | State machines (AI / player), collision layers, damage + buff/debuff, pathfinding (TD/RPG), saves + data-driven tuning (tables / assets) | Same engines; heavier UI + content pipelines (JSON / ScriptableObjects) | AI count, projectile / AoE queries, VFX caps, peak on-screen units | Table-driven tuning + AI snapshots; scenario tests for encounters | Builds/crafting, elemental synergies, level editor, seasonal content |
| **<a href="./tetris">Tetris</a>** | Tetris / falling-block stacker | Spatial planning and rhythm: stacking pressure with line clears as relief | Spawn piece → rotate / translate → lock → clear full rows → rising tempo | Grid model (2D buffer), rotation with wall kicks (e.g., SRS), line clear + gravity collapse, ghost piece, bag randomizer (e.g., 7-bag) | Any engine; strong fit for Canvas/Web; logic/render split aids unit testing | Frequent grid updates but small data; watch GC spikes (e.g., C#) and input latency | **Highly rule-driven**; excellent for unit tests (rotation, lock, clears, scoring) | Versus garbage lines, marathon/sprint modes, themes/skins |
| **<a href="./angry_bird">Angry Bird</a>** | Physics-based slingshot puzzle, destruction game | Physics and precision: trajectory aiming with satisfying chain-reaction destruction | Aim slingshot → launch bird → destroy structures / pigs → score + star rating → next level | Physics engine (Matter.js), collision + damage system, trajectory prediction, multi-material blocks, level data tables, scoring + star thresholds | Phaser 3 + Matter.js, Vite, JavaScript ES6+, HTML5/Canvas | Many rigidbodies and constraints on screen, physics step budget, particle and debris VFX caps | Level-data driven tuning; scenario tests for collision, damage, scoring; deterministic seeds possible | Special bird abilities, more levels, level editor, versus mode, seasonal themes |

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
