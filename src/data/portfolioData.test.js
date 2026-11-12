import { describe, it, expect } from 'vitest'
import { labsData } from './labsData'
import { skillGroups, toolsData } from './skillsData'
import { site } from './site'

describe('portfolio data integrity', () => {
  it('defines essential site metadata', () => {
    expect(site.title).toContain('FizhTank')
    expect(site.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })

  it('defines valid planned labs with writeup objectives and steps', () => {
    expect(labsData.length).toBeGreaterThan(0)
    labsData.forEach((lab) => {
      expect(lab.id).toBeTypeOf('number')
      expect(lab.title).toBeTruthy()
      expect(lab.writeup.objective).toBeTruthy()
      expect(lab.writeup.plannedSteps.length).toBeGreaterThan(0)
    })
  })

  it('defines networking, security, and linux skill groups and tools', () => {
    expect(skillGroups.map((g) => g.id)).toEqual(['networking', 'linux', 'security'])
    skillGroups.forEach((group) => {
      expect(group.skills.length).toBeGreaterThan(0)
    })
    expect(toolsData.some((t) => t.used)).toBe(true)
  })
})
