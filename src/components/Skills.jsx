import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { skillGroups, toolsData, levelNotes } from '../data/skillsData'

const levelStyle = {
  Dasar: 'border-kelp/50 bg-kelp/10 text-kelp',
  Belajar: 'border-aqua/50 bg-aqua/10 text-aqua',
  'Rencana Lab': 'border-mist/35 bg-white/5 text-mist border-dashed',
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState('networking')

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 })
  const [bodyRef, bodyVisible] = useScrollReveal({ threshold: 0.06 })

  const currentGroup = skillGroups.find((g) => g.id === activeTab) || skillGroups[0]

  const tabs = skillGroups.map((g, i) => ({ id: g.id, num: `0${i + 1}`, label: g.short }))

  const reveal = (visible, offset = 20) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${offset}px)`,
    transition: 'opacity 550ms cubic-bezier(0.23, 1, 0.32, 1), transform 550ms cubic-bezier(0.23, 1, 0.32, 1)',
  })

  return (
    <section id="skills" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div
        ref={headerRef}
        className="mb-12 flex flex-col justify-between gap-6 border-b border-aqua/15 pb-8 lg:flex-row lg:items-end"
        style={reveal(headerVisible)}
      >
        <div className="max-w-2xl">
          <p className="eyebrow">02 // Matriks Skill — Batipelagik</p>
          <h2 className="section-title on-water mt-4">
            Apa yang <em className="italic text-aqua">sedang</em> saya pelajari
          </h2>
        </div>
        <p className="lede on-water max-w-md text-base">
          Tanpa persentase. Setiap skill diberi level apa adanya, dilatih lewat simulasi lab dan praktik langsung di
          workstation Linux.
        </p>
      </div>

      <div ref={bodyRef} className="specimen-panel reticle overflow-hidden" style={reveal(bodyVisible, 24)}>
        {/* Bar Navigasi Tab & Legenda Level */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-aqua/15 px-5 py-4 sm:px-7">
          <div role="tablist" aria-label="Kategori skill" className="flex flex-wrap border border-aqua/20 bg-deep/60">
            {tabs.map((tab, i) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors duration-150 active:scale-[0.98] ${
                    i > 0 ? 'border-l border-aqua/15' : ''
                  } ${
                    active ? 'bg-aqua font-semibold text-deep' : 'text-mist hover:bg-aqua/10 hover:text-white'
                  }`}
                >
                  <span className={`font-mono text-[0.6875rem] ${active ? 'text-deep/75' : 'text-aqua/75'}`}>
                    {tab.num}
                  </span>
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[0.6875rem] text-mist" aria-label="Arti level">
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

        {/* Matriks Hairline (Menggantikan Grid Kartu Bulat Seragam) */}
        <div key={activeTab} role="tabpanel" className="panel-enter p-5 sm:p-8">
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
              <li key={skill.name} className="specimen-hover flex flex-col justify-between bg-[#021721]/95 p-5 sm:p-6">
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
              </li>
            ))}
          </ul>
        </div>

        {/* Daftar Tool */}
        <div className="border-t border-aqua/15 px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-mono text-xs font-semibold tracking-widest text-white uppercase">
              Inventaris Perangkat &amp; Tool
            </h3>
            <p className="font-mono text-xs text-mist/85">
              Garis putus-putus = masuk rencana eksplorasi berikutnya
            </p>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {toolsData.map((tool) => (
              <li
                key={tool.label}
                className={`rounded-[2px] border px-3 py-1.5 font-mono text-xs ${
                  tool.used
                    ? 'border-aqua/45 bg-aqua/10 font-medium text-foam'
                    : 'border-dashed border-mist/30 text-mist'
                }`}
              >
                {tool.label}
                <span className="sr-only">{tool.used ? ' (sudah dipakai)' : ' (rencana)'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
