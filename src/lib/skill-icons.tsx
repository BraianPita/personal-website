import type { ComponentProps } from 'react'
import {
  Activity,
  Bot,
  Boxes,
  Cloud,
  CloudCog,
  Cpu,
  Crown,
  Database,
  FileCode2,
  Fingerprint,
  GitBranch,
  Globe,
  Handshake,
  IdCard,
  KeyRound,
  Landmark,
  Layers,
  Lock,
  MonitorSmartphone,
  Network,
  Plug,
  Radio,
  RadioTower,
  Rocket,
  Satellite,
  Server,
  Share2,
  ShieldCheck,
  Smartphone,
  Timer,
  Users,
  Video,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import {
  siGithub,
  siTypescript,
  siJavascript,
  siNodedotjs,
  siReact,
  siNextdotjs,
  siGraphql,
  siPostgresql,
  siFlutter,
  siDart,
  siMqtt,
  siGo,
  siDocker,
  siGooglecloud,
  siTerraform,
  siLinux,
  siDebian,
  siGitlab,
  siGithubactions,
  siRedis,
  siSocketdotio,
  siWebrtc,
  siMongodb,
  siExpo,
  siMaterialdesign,
  siShadcnui,
  siKubernetes,
  siAuth0,
  siJsonwebtokens,
  siScrumalliance,
  siJira,
  siGit,
  siSwagger,
  type SimpleIcon,
} from 'simple-icons'

export type SkillIcon =
  | LucideIcon
  | ((props: ComponentProps<'svg'>) => React.ReactElement)

/** Render a simple-icons glyph as a React component. */
function si(icon: SimpleIcon): (props: ComponentProps<'svg'>) => React.ReactElement {
  return function SimpleIconSvg(props) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d={icon.path} />
      </svg>
    )
  }
}

/**
 * Icon registry keyed by the `icon` field in skills.json.
 * Values are either lucide components or simple-icons wrappers.
 */
export const iconRegistry: Record<string, SkillIcon> = {
  // Branch icons (lucide)
  'branch-fullstack': Globe,
  'branch-iot': RadioTower,
  'branch-realtime': Zap,
  'branch-cloud': Cloud,
  'branch-security': ShieldCheck,
  'branch-leadership': Users,

  // Legendary icons (lucide)
  'legendary-control': Crown,
  'legendary-sdr': Satellite,
  'legendary-migration': Landmark,
  'legendary-fleet': Rocket,

  // Full-stack nodes
  typescript: si(siTypescript),
  javascript: si(siJavascript),
  nodejs: si(siNodedotjs),
  react: si(siReact),
  nextjs: si(siNextdotjs),
  graphql: si(siGraphql),
  rest: FileCode2,
  postgresql: si(siPostgresql),
  sql: Database,
  flutter: si(siFlutter),
  dart: si(siDart),
  'react-native': si(siExpo),
  shadcn: si(siShadcnui),
  mui: si(siMaterialdesign),

  // IoT nodes
  mqtt: si(siMqtt),
  telemetry: Radio,
  'vendor-apis': Plug,
  'command-locking': Lock,
  sdr: RadioTower,
  go: si(siGo),
  edge: Boxes,
  mtls: Fingerprint,

  // Realtime nodes
  websockets: si(siSocketdotio),
  redis: si(siRedis),
  autoscaling: Network,
  'event-driven': Workflow,
  webrtc: si(siWebrtc),
  recording: Video,
  latency: Timer,
  'single-writer': KeyRound,

  // Cloud nodes
  aws: CloudCog,
  docker: si(siDocker),
  gcp: si(siGooglecloud),
  terraform: si(siTerraform),
  linux: si(siLinux),
  debian: si(siDebian),
  cicd: si(siGithubactions),
  gitlab: si(siGitlab),
  observability: Activity,
  mongodb: si(siMongodb),

  // Security nodes
  oauth: si(siAuth0),
  jwt: si(siJsonwebtokens),
  identity: IdCard,
  iam: ShieldCheck,

  // Leadership nodes
  'team-leadership': Users,
  scrum: si(siScrumalliance),
  migrations: GitBranch,
  'release-ownership': Rocket,
  agentic: Bot,
  'cross-functional': Handshake,

  // Misc
  github: si(siGithub),
  share: Share2,
  server: Server,
  layers: Layers,
  cpu: Cpu,
  git: si(siGit),
  swagger: si(siSwagger),
  jira: si(siJira),
  kubernetes: si(siKubernetes),
  smartphone: Smartphone,
  monitor: MonitorSmartphone,
}

export function getIcon(name: string | undefined): SkillIcon | undefined {
  if (!name) return undefined
  return iconRegistry[name]
}
