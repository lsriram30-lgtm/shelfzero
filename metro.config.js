const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Claude Code's background agents do their work in isolated git worktrees
// under .claude/worktrees/ (inside the project root). Those worktrees have
// their own node_modules and can create/remove transient build output
// (e.g. `expo export` dist dirs) while the dev server is running. Without
// this, Metro's file crawler walks that whole tree too and can crash with
// an ENOENT if a directory it's scanning disappears mid-scan.
config.resolver.blockList = [/\.claude[\\/]worktrees[\\/].*/];

module.exports = config;
