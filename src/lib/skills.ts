import skillsData from '@/data/skills.json'

export interface ProficiencyLevel {
  level: number
  name: string
  description: string
}

export interface SkillNode {
  id: string
  name: string
  level: number
  dependencies: string[]
  tooltip: string
  icon?: string
}

export interface SkillBranch {
  id: string
  name: string
  icon: string
  color: string
  nodes: SkillNode[]
}

export interface SkillsData {
  meta: {
    title: string
    subtitle: string
    skillPointsLabel: string
  }
  proficiencyScale: ProficiencyLevel[]
  branches: SkillBranch[]
}

export const skills = skillsData as SkillsData

export type NodeState = 'desired' | 'locked' | 'available' | 'unlocked' | 'mastered'

/** Map of nodeId -> node for quick lookup across all branches. */
export function buildNodeIndex(): Map<string, { node: SkillNode; branch: SkillBranch }> {
  const index = new Map<string, { node: SkillNode; branch: SkillBranch }>()
  for (const branch of skills.branches) {
    for (const node of branch.nodes) {
      index.set(node.id, { node, branch })
    }
  }
  return index
}

/**
 * Node states on the 0–5 proficiency scale:
 * - desired (0): on the roadmap, not started
 * - locked: level > 0 but a dependency hasn't reached level 3 yet (in-progress)
 * - available: level > 0, dependencies not all ≥ 3 but node has hands-on level
 * - unlocked: level > 0 and all dependencies ≥ 3
 * - mastered: level 5
 */
export function getNodeState(
  node: SkillNode,
  index: Map<string, { node: SkillNode; branch: SkillBranch }>,
): NodeState {
  if (node.level === 0) return 'desired'
  if (node.level >= 5) return 'mastered'
  const parentsReady = node.dependencies.every((depId) => {
    const dep = index.get(depId)
    return dep && dep.node.level >= 3
  })
  return parentsReady ? 'unlocked' : 'available'
}

/** Total skill points = sum of all node levels. */
export function getTotalSkillPoints(): number {
  return skills.branches.reduce(
    (sum, branch) => sum + branch.nodes.reduce((s, n) => s + n.level, 0),
    0,
  )
}

/** The branch with the highest total level determines the "class". */
export function getClassEmblem(): { branch: SkillBranch; total: number } {
  let best = skills.branches[0]
  let bestTotal = 0
  for (const branch of skills.branches) {
    const total = branch.nodes.reduce((s, n) => s + n.level, 0)
    if (total > bestTotal) {
      best = branch
      bestTotal = total
    }
  }
  return { branch: best, total: bestTotal }
}

/** Tailwind color classes per branch color key. */
export const branchColors: Record<
  string,
  { text: string; border: string; bg: string; glow: string; dot: string }
> = {
  sky: {
    text: 'text-sky-400',
    border: 'border-sky-500/40',
    bg: 'bg-sky-500/10',
    glow: 'shadow-[0_0_12px_rgba(14,165,233,0.5)]',
    dot: 'bg-sky-400',
  },
  emerald: {
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    dot: 'bg-emerald-400',
  },
  amber: {
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    dot: 'bg-amber-400',
  },
  violet: {
    text: 'text-violet-400',
    border: 'border-violet-500/40',
    bg: 'bg-violet-500/10',
    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.5)]',
    dot: 'bg-violet-400',
  },
  rose: {
    text: 'text-rose-400',
    border: 'border-rose-500/40',
    bg: 'bg-rose-500/10',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.5)]',
    dot: 'bg-rose-400',
  },
  cyan: {
    text: 'text-cyan-400',
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-500/10',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.5)]',
    dot: 'bg-cyan-400',
  },
}

export function getBranchColor(color: string) {
  return branchColors[color] ?? branchColors.sky
}
