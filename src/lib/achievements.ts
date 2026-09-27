import achievementsData from '@/data/achievements.json'
import type { SkillNode, SkillBranch } from '@/lib/skills'

export interface Achievement {
  id: string
  name: string
  icon: string
  description: string
  /** Skill node ids this achievement involved. */
  skills: string[]
}

export const achievements = achievementsData.achievements as Achievement[]

/** All achievements that involved the given skill node. */
export function getAchievementsForSkill(skillId: string): Achievement[] {
  return achievements.filter((a) => a.skills.includes(skillId))
}

/** Check whether every skill an achievement requires exists in the node index. */
export function achievementSkillNames(
  achievement: Achievement,
  index: Map<string, { node: SkillNode; branch: SkillBranch }>,
): string[] {
  return achievement.skills.map((id) => index.get(id)?.node.name ?? id)
}
