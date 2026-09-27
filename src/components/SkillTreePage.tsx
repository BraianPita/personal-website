import { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Lock,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from 'cn'
import { getIcon } from '@/lib/skill-icons'
import { computeGraphLayout, type PositionedNode } from '@/lib/graph-layout'
import { achievements } from '@/lib/achievements'
import {
  skills,
  buildNodeIndex,
  getNodeState,
  getTotalSkillPoints,
  getClassEmblem,
  getBranchColor,
  type NodeState,
  type ProficiencyLevel,
} from '@/lib/skills'

const MIN_ZOOM = 0.4
const MAX_ZOOM = 2
const ZOOM_STEP = 0.15

const stateStyles: Record<NodeState, string> = {
  desired: 'border-dashed border-muted-foreground/40 bg-background/90',
  locked: 'border-border bg-muted/60 opacity-50',
  available: 'border-dashed border-muted-foreground/50 bg-background/90',
  unlocked: '',
  mastered: '',
}

const stateLabels: Record<NodeState, string> = {
  desired: 'Desired',
  locked: 'In progress',
  available: 'Available',
  unlocked: 'Unlocked',
  mastered: 'Mastered',
}

function GraphNode({
  positioned,
  state,
  selected,
  onSelect,
}: {
  positioned: PositionedNode
  state: NodeState
  selected: boolean
  onSelect: (p: PositionedNode) => void
}) {
  const { node, branch, x, y } = positioned
  const color = getBranchColor(branch.color)
  const isMastered = state === 'mastered'
  const isDesired = state === 'desired'
  const isColored = state === 'unlocked' || isMastered
  const Icon = getIcon(node.icon)

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(x / 2500, 0.5), type: 'spring', stiffness: 240, damping: 22 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(positioned)
      }}
      className={cn(
        'absolute flex cursor-pointer flex-col items-start gap-1 rounded-xl border px-3 py-2 text-left backdrop-blur-sm transition-shadow',
        stateStyles[state],
        isColored && color.border,
        isColored && color.bg,
        isMastered && color.glow,
        selected && 'ring-2 ring-amber-400 ring-offset-2 ring-offset-background',
      )}
      style={{ left: x, top: y, width: 190, height: 64 }}
    >
      <div className="flex w-full items-center gap-2">
        {isDesired ? (
          <Target className="size-3.5 shrink-0 text-muted-foreground/70" />
        ) : state === 'locked' ? (
          <Lock className="size-3.5 shrink-0 text-muted-foreground" />
        ) : (
          Icon && (
            <Icon
              className={cn(
                'size-4 shrink-0',
                isColored ? color.text : 'text-muted-foreground',
              )}
            />
          )
        )}
        <p
          className={cn(
            'min-w-0 flex-1 truncate text-xs font-medium',
            isDesired && 'italic text-muted-foreground/70',
            isColored ? color.text : 'text-muted-foreground',
          )}
        >
          {node.name}
        </p>
      </div>
      <div className="flex w-full items-center gap-1 pl-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={cn(
              'size-1.5 rounded-full',
              i < node.level ? color.dot : 'bg-muted-foreground/25',
            )}
          />
        ))}
        <span className="ml-auto text-[9px] uppercase tracking-wide text-muted-foreground/70">
          {stateLabels[state]}
        </span>
      </div>
    </motion.button>
  )
}

function SkillSheet({
  positioned,
  onClose,
}: {
  positioned: PositionedNode | null
  onClose: () => void
}) {
  const nodeIndex = useMemo(() => buildNodeIndex(), [])
  const open = positioned !== null
  const node = positioned?.node
  const branch = positioned?.branch
  const state = node ? getNodeState(node, nodeIndex) : null
  const color = branch ? getBranchColor(branch.color) : getBranchColor('sky')
  const Icon = node ? getIcon(node.icon) : undefined
  const proficiency = node
    ? skills.proficiencyScale.find((p: ProficiencyLevel) => p.level === node.level)
    : undefined
  const relatedAchievements = node
    ? achievements.filter((a) => a.skills.includes(node.id))
    : []

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        {node && branch && state && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                {Icon && (
                  <div
                    className={cn(
                      'flex size-12 items-center justify-center rounded-xl border',
                      color.border,
                      color.bg,
                    )}
                  >
                    <Icon className={cn('size-6', color.text)} />
                  </div>
                )}
                <div className="min-w-0">
                  <SheetTitle className="text-left">{node.name}</SheetTitle>
                  <SheetDescription className="text-left">{branch.name}</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex flex-col gap-6 px-4 pb-8">
              {/* Level */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Proficiency
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={cn(
                          'size-3 rounded-full',
                          i < node.level ? color.dot : 'bg-muted-foreground/25',
                        )}
                      />
                    ))}
                  </div>
                  <Badge variant="outline">
                    {node.level}/5 · {proficiency?.name ?? stateLabels[state]}
                  </Badge>
                </div>
                {proficiency && (
                  <p className="mt-2 text-sm text-muted-foreground">{proficiency.description}</p>
                )}
              </div>

              <Separator />

              {/* Experience / context */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Experience
                </p>
                <p className="text-sm">{node.tooltip}</p>
              </div>

              <Separator />

              {/* Dependencies */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Dependencies
                </p>
                {node.dependencies.length === 0 ? (
                  <p className="text-sm text-muted-foreground">None — root skill</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {node.dependencies.map((depId) => {
                      const dep = nodeIndex.get(depId)
                      const DepIcon = getIcon(dep?.node.icon)
                      return (
                        <Badge key={depId} variant="secondary" className="gap-1.5">
                          {DepIcon && <DepIcon className="size-3" />}
                          {dep?.node.name ?? depId}
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Related achievements */}
              {relatedAchievements.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Achievements
                    </p>
                    <div className="flex flex-col gap-2">
                      {relatedAchievements.map((achievement) => {
                        const AchIcon = getIcon(achievement.icon)
                        return (
                          <div
                            key={achievement.id}
                            className="flex items-start gap-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-2.5"
                          >
                            {AchIcon ? (
                              <AchIcon className="mt-0.5 size-4 shrink-0 text-amber-400" />
                            ) : (
                              <Trophy className="mt-0.5 size-4 shrink-0 text-amber-400" />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-amber-400">
                                {achievement.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function AchievementsSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const nodeIndex = useMemo(() => buildNodeIndex(), [])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-amber-400" />
            Achievements
          </SheetTitle>
          <SheetDescription>Signature work unlocked by converging skills</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-4 pb-8">
          {achievements.map((achievement) => {
            const AchIcon = getIcon(achievement.icon)
            return (
              <div
                key={achievement.id}
                className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3"
              >
                {AchIcon ? (
                  <AchIcon className="mt-0.5 size-5 shrink-0 text-amber-400" />
                ) : (
                  <Trophy className="mt-0.5 size-5 shrink-0 text-amber-400" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-amber-400">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {achievement.skills.map((skillId) => (
                      <Badge key={skillId} variant="secondary" className="text-[10px]">
                        {nodeIndex.get(skillId)?.node.name ?? skillId}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function SkillTreePage() {
  const layout = useMemo(() => computeGraphLayout(), [])
  const nodeIndex = useMemo(() => buildNodeIndex(), [])
  const skillPoints = useMemo(() => getTotalSkillPoints(), [])
  const emblem = useMemo(() => getClassEmblem(), [])
  const emblemColor = getBranchColor(emblem.branch.color)
  const EmblemIcon = getIcon(emblem.branch.icon)

  const [selected, setSelected] = useState<PositionedNode | null>(null)
  const [showAchievements, setShowAchievements] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [view, setView] = useState({ pan: { x: 0, y: 0 }, zoom: 0.8 })
  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef(view)
  viewRef.current = view

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setDragging(true)
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        panX: viewRef.current.pan.x,
        panY: viewRef.current.pan.y,
      }
    },
    [],
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const start = dragStart.current
      if (!dragging || !start) return
      const { x, y, panX, panY } = start
      setView((v) => ({
        ...v,
        pan: {
          x: panX + (e.clientX - x),
          y: panY + (e.clientY - y),
        },
      }))
    },
    [dragging],
  )

  const onMouseUp = useCallback(() => {
    setDragging(false)
    dragStart.current = null
  }, [])

  /**
   * Zoom keeping the world point under the cursor fixed.
   * Screen = pan + world * zoom  =>  pan' = cursor - (cursor - pan) * (zoom' / zoom)
   */
  const zoomAt = useCallback((clientX: number, clientY: number, nextZoomRaw: number) => {
    setView((v) => {
      const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoomRaw))
      if (zoom === v.zoom) return v
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return v
      const cx = clientX - rect.left
      const cy = clientY - rect.top
      return {
        zoom,
        pan: {
          x: cx - ((cx - v.pan.x) * zoom) / v.zoom,
          y: cy - ((cy - v.pan.y) * zoom) / v.zoom,
        },
      }
    })
  }, [])

  // Non-passive wheel listener so preventDefault works without console warnings
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      zoomAt(e.clientX, e.clientY, viewRef.current.zoom - e.deltaY * 0.001)
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [zoomAt])

  const zoomIn = useCallback(() => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    zoomAt(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      viewRef.current.zoom + ZOOM_STEP,
    )
  }, [zoomAt])

  const zoomOut = useCallback(() => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    zoomAt(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      viewRef.current.zoom - ZOOM_STEP,
    )
  }, [zoomAt])

  const resetView = useCallback(() => {
    setView({ pan: { x: 0, y: 0 }, zoom: 0.8 })
  }, [])

  const nodeById = useMemo(() => {
    const m = new Map<string, PositionedNode>()
    for (const p of layout.nodes) m.set(p.node.id, p)
    return m
  }, [layout])

  return (
    <div className="relative h-svh w-full overflow-hidden bg-background">
      {/* Fixed header */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft />
              Home
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-sm font-semibold">{skills.meta.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <Sparkles className="size-3 text-amber-400" />
            {skills.meta.skillPointsLabel}: {skillPoints}
          </Badge>
          <Badge variant="outline" className={cn('hidden gap-1.5 sm:flex', emblemColor.text)}>
            {EmblemIcon && <EmblemIcon className="size-3" />}
            {emblem.branch.name}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setShowAchievements(true)}>
            <Trophy />
            Achievements
          </Button>
        </div>
      </header>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1 rounded-lg border bg-background/80 p-1 backdrop-blur-md">
        <Button variant="ghost" size="icon" onClick={zoomIn} aria-label="Zoom in">
          <Plus />
        </Button>
        <Button variant="ghost" size="icon" onClick={zoomOut} aria-label="Zoom out">
          <Minus />
        </Button>
        <Button variant="ghost" size="icon" onClick={resetView} aria-label="Reset view">
          <RotateCcw />
        </Button>
        <span className="text-center text-[10px] text-muted-foreground">
          {Math.round(view.zoom * 100)}%
        </span>
      </div>

      {/* Pannable + zoomable canvas */}
      <div
        ref={canvasRef}
        className={cn('absolute inset-0 pt-16', dragging ? 'cursor-grabbing' : 'cursor-grab')}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          className="relative origin-top-left"
          style={{
            width: layout.width,
            height: layout.height,
            transform: `translate(${view.pan.x}px, ${view.pan.y}px) scale(${view.zoom})`,
          }}
        >
          {/* Edges */}
          <svg
            className="pointer-events-none absolute inset-0"
            width={layout.width}
            height={layout.height}
          >
            {layout.edges.map((edge, i) => {
              const from = nodeById.get(edge.from)
              const to = nodeById.get(edge.to)
              if (!from || !to) return null
              const x1 = from.x + 190
              const y1 = from.y + 32
              const x2 = to.x
              const y2 = to.y + 32
              const midX = (x1 + x2) / 2
              const active = (nodeIndex.get(edge.from)?.node.level ?? 0) >= 3
              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  strokeWidth={active ? 2 : 1.5}
                  className={cn(
                    'transition-colors',
                    active ? 'stroke-amber-400/70' : 'stroke-muted-foreground/25',
                  )}
                  strokeDasharray={active ? undefined : '4 4'}
                />
              )
            })}
          </svg>

          {/* Nodes */}
          {layout.nodes.map((p) => (
            <GraphNode
              key={p.node.id}
              positioned={p}
              state={getNodeState(p.node, nodeIndex)}
              selected={selected?.node.id === p.node.id}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {/* Skill detail drawer */}
      <SkillSheet positioned={selected} onClose={() => setSelected(null)} />

      {/* Achievements sheet */}
      <AchievementsSheet open={showAchievements} onOpenChange={setShowAchievements} />

      {/* Hint */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
        <p className="rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
          Drag to pan · Scroll to zoom · Click a skill for details
        </p>
      </div>
    </div>
  )
}
