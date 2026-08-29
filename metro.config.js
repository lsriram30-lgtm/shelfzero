const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Claude Code's background agents do their work in isolated git worktrees
// under .claude/worktrees/ (inside the project root). Those worktrees have
// their own node_modules and can create/remove transient build output
// (e.g. `expo export` dist dirs) while the dev server is running. Without
// this, Metro's file crawler walks that whole tree too and can crash with
// an ENOENT if a directory it's scanning disappears mid-scan.
//
// Only apply this when Metro is actually running from the main checkout.
// A worktree's own path also contains ".claude/worktrees/" (it *is* one),
// so a plain substring blockList applied unconditionally blocks a worktree
// from seeing its own files when Metro is run from inside it.
const runningInsideWorktree = /\.claude[\\/]worktrees[\\/]/.test(__dirname);
if (!runningInsideWorktree) {
  config.resolver.blockList = [/\.claude[\\/]worktrees[\\/].*/];
}

module.exports = config;
