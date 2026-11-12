import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { skillGroups, toolsData, levelNotes } from '../data/skillsData'
import { SPRING_CRIT, SPRING_SNAP, VIEWPORT_ONCE, revealUp, revealCard } from '../utils/motion'

const levelStyle = {
  Foundational: 'border-kelp/50 bg-kelp/10 text-kelp',
  Practicing: 'border-aqua/50 bg-aqua/10 text-aqua',
  Planned: 'border-mist/35 bg-white/5 text-mist border-dashed',
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState('networking')

  const currentGroup = skillGroups.find((g) => g.id === activeTab) || skillGroups[0]
  const tabs = skillGroups.map((g, i) => ({ id: g.id, num: `0${i + 1}`, label: g.short }))

  return (
    <section id="skills" className="relative mx-auto max-w-7xl px-5 pt-6 pb-20 sm:px-8 sm:pt-8 sm:pb-24">
      <motion.div
        className="mb-8 flex flex-col justify-between gap-6 border-b border-aqua/15 pb-6 sm:mb-9 sm:pb-7 lg:flex-row lg:items-end"
        initial={revealUp.initial}
        whileInView={revealUp.animate}
        viewport={VIEWPORT_ONCE}
        transition={SPRING_CRIT}
      >
        <div className="max-w-2xl">
          <p className="eyebrow">02 // Capability Matrix</p>
          <h2 className="section-title on-water mt-4">
            Technical <em className="italic text-aqua">capabilities</em>
          </h2>
        </div>
        <p className="lede on-water max-w-md text-base">
          Core competencies across networking, Linux administration, and packet-level security analysis.
        </p>
      </motion.div>

      <motion.div
        className="specimen-panel reticle overflow-hidden"
        initial={revealCard.initial}
        whileInView={revealCard.animate}
        viewport={VIEWPORT_ONCE}
        transition={{ ...SPRING_CRIT, delay: 0.05 }}
      >
        {/* Navigation Tabs & Proficiency Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-aqua/15 px-5 py-4 sm:px-7">
          <div role="tablist" aria-label="Skill categories" className="flex flex-wrap border border-aqua/20 bg-deep/60">
            {tabs.map((tab, i) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-[color,transform] duration-150 active:scale-[0.97] ${
                    i > 0 ? 'border-l border-aqua/15' : ''
                  } ${
                    active ? 'font-semibold text-deep' : 'text-mist hover:bg-aqua/10 hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="skills-tab-pill"
                      transition={{ type: 'spring', bounce: 0, duration: 0.34 }}
                      className="absolute inset-0 bg-aqua"
                      aria-hidden="true"
                    />
                  )}
                  <span className={`relative z-10 font-mono text-[0.6875rem] ${active ? 'text-deep/75' : 'text-aqua/75'}`}>
                    {tab.num}
                  </span>
                  <span className="relative z-10">{tab.label}</span>
                </button>
              )
            })}
          </div>

          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[0.6875rem] text-mist" aria-label="Proficiency key">
            {Object.entries(levelNotes).map(([level, note]) => (
              <li key={level} className="flex items-center gap-1.5">
                <span className={`inline-block h-2.5 w-2.5 border ${levelStyle[level]}`} aria-hidden="true" />
                <span>
                  <strong className="font-medium text-foam">{level}:</strong> {note}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hairline Matrix */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            role="tabpanel"
            initial={{ opacity: 0, transform: 'translateY(8px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0, transform: 'translateY(-6px)' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="p-5 sm:p-8"
          >
            <div className="flex flex-col justify-between gap-4 border-b border-aqua/15 pb-6 sm:flex-row sm:items-end">
              <div>
                <h3 className="text-3xl text-white sm:text-4xl">{currentGroup.label}</h3>
                <p className="mt-1.5 max-w-xl text-mist">{currentGroup.description}</p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {currentGroup.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <ul className="mt-7 grid grid-cols-1 gap-px border border-aqua/15 bg-aqua/15 sm:grid-cols-2 lg:grid-cols-3">
              {currentGroup.skills.map((skill, idx) => (
                <motion.li
                  key={skill.name}
                  initial={revealCard.initial}
                  whileInView={revealCard.animate}
                  viewport={VIEWPORT_ONCE}
                  transition={{ ...SPRING_SNAP, delay: idx * 0.04 }}
                  className="specimen-hover flex flex-col justify-between bg-[#021721]/95 p-5 sm:p-6"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 border-b border-aqua/10 pb-3">
                      <span className="font-mono text-[0.6875rem] text-aqua/80">
                        SPEC // {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`shrink-0 rounded-[2px] border px-2 py-0.5 font-mono text-[0.6875rem] font-medium ${levelStyle[skill.level]}`}
                      >
                        {skill.level}
                      </span>
                    </div>

                    <h4 className="mt-4 font-sans text-base leading-snug font-semibold tracking-normal text-white">
                      {skill.name}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{skill.context}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        {/* Tooling & Environment */}
        <div className="border-t border-aqua/15 px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-mono text-xs font-semibold tracking-widest text-white uppercase">
              Tooling &amp; Environment
            </h3>
            <p className="font-mono text-xs text-mist/85">
              Dashed border indicates queued exploration
            </p>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {toolsData.map((tool, idx) => (
              <motion.li
                key={tool.label}
                initial={revealUp.initial}
                whileInView={revealUp.animate}
                viewport={VIEWPORT_ONCE}
                transition={{ ...SPRING_SNAP, delay: Math.min(idx * 0.025, 0.25) }}
                className={`rounded-[2px] border px-3 py-1.5 font-mono text-xs ${
                  tool.used
                    ? 'border-aqua/45 bg-aqua/10 font-medium text-foam'
                    : 'border-dashed border-mist/30 text-mist'
                }`}
              >
                {tool.label}
                <span className="sr-only">{tool.used ? ' (active)' : ' (planned)'}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  )
}
