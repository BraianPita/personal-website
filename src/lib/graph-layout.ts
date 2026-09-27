import { skills, type SkillNode, type SkillBranch } from '@/lib/skills'

export interface PositionedNode {
  node: SkillNode
  branch: SkillBranch
  x: number
  y: number
}

export interface GraphEdge {
  from: string
  to: string
}

export interface GraphLayout {
  nodes: PositionedNode[]
  edges: GraphEdge[]
  width: number
  height: number
}

/**
 * Branch-lane layered layout with an "independent row":
 * - Each branch occupies a horizontal lane; nodes flow left-to-right by
 *   dependency depth. Colors stay grouped per lane for readability.
 * - Independent nodes (no dependencies AND no dependents — e.g. Python,
 *   Rust, Assembly) sit in a single compact row at the TOP of their lane,
 *   keeping them visually separate from the connected skill trees.
 * - Connected nodes are placed by depth, vertically centered relative to
 *   their connected subgraph, so roots like TypeScript sit close to their
 *   dependents instead of floating far above them.
 * - Cross-branch dependency edges (e.g. edge <- docker) render as long
 *   curves between lanes, showing where branches converge.
 */
export function computeGraphLayout(): GraphLayout {
  const nodeMap = new Map<string, { node: SkillNode; branch: SkillBranch }>()
  for (const branch of skills.branches) {
    for (const node of branch.nodes) {
      nodeMap.set(node.id, { node, branch })
    }
  }

  // Longest-path depth per node (memoized)
  const depthCache = new Map<string, number>()
  function depth(id: string, seen = new Set<string>()): number {
    if (depthCache.has(id)) return depthCache.get(id)!
    if (seen.has(id)) return 0 // cycle guard
    seen.add(id)
    const entry = nodeMap.get(id)
    if (!entry || entry.node.dependencies.length === 0) {
      depthCache.set(id, 0)
      return 0
    }
    const d = 1 + Math.max(...entry.node.dependencies.map((dep) => depth(dep, seen)))
    depthCache.set(id, d)
    return d
  }
  for (const id of nodeMap.keys()) depth(id)

  // Nodes with any dependency or dependent (within the whole graph)
  const hasDependents = new Set<string>()
  for (const { node } of nodeMap.values()) {
    for (const dep of node.dependencies) hasDependents.add(dep)
  }
  const isConnected = (id: string) =>
    nodeMap.get(id)!.node.dependencies.length > 0 || hasDependents.has(id)

  // Layout constants
  const NODE_W = 190
  const NODE_H = 64
  const GAP_X = 90
  const GAP_Y = 26
  const LANE_GAP = 48
  const PAD = 80

  const nodes: PositionedNode[] = []
  const edges: GraphEdge[] = []
  let laneY = PAD

  for (const branch of skills.branches) {
    const independents = branch.nodes.filter((n) => !isConnected(n.id))
    const connected = branch.nodes.filter((n) => isConnected(n.id))

    // --- Independent row: single compact row at the top of the lane ---
    let laneContentHeight = 0
    if (independents.length > 0) {
      independents.forEach((node, i) => {
        nodes.push({
          node,
          branch,
          x: PAD + i * (NODE_W + GAP_X),
          y: laneY,
        })
      })
      laneContentHeight = NODE_H
    }

    // --- Connected subgraph: group by depth, centered on the subgraph ---
    if (connected.length > 0) {
      const byDepth = new Map<number, SkillNode[]>()
      for (const node of connected) {
        const d = depthCache.get(node.id) ?? 0
        if (!byDepth.has(d)) byDepth.set(d, [])
        byDepth.get(d)!.push(node)
      }
      const depths = [...byDepth.keys()].sort((a, b) => a - b)

      const maxRows = Math.max(...depths.map((d) => byDepth.get(d)!.length))
      const subgraphHeight = maxRows * (NODE_H + GAP_Y) - GAP_Y
      const subgraphTop = laneY + laneContentHeight + (laneContentHeight > 0 ? GAP_Y : 0)

      for (const d of depths) {
        const columnNodes = byDepth.get(d)!
        const columnHeight = columnNodes.length * (NODE_H + GAP_Y) - GAP_Y
        const startY = subgraphTop + (subgraphHeight - columnHeight) / 2
        columnNodes.forEach((node, i) => {
          nodes.push({
            node,
            branch,
            x: PAD + d * (NODE_W + GAP_X),
            y: startY + i * (NODE_H + GAP_Y),
          })
        })
      }

      laneContentHeight += (laneContentHeight > 0 ? GAP_Y : 0) + subgraphHeight
    }

    laneY += laneContentHeight + LANE_GAP
  }

  // Edges from dependencies
  for (const { node } of nodeMap.values()) {
    for (const dep of node.dependencies) {
      edges.push({ from: dep, to: node.id })
    }
  }

  const maxDepth = Math.max(...[...depthCache.values()])
  const width = PAD + (maxDepth + 1) * (NODE_W + GAP_X) + PAD
  const height = laneY - LANE_GAP + PAD

  return { nodes, edges, width, height }
}
