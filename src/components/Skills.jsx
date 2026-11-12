import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { skillGroups, toolsData, levelNotes } from '../data/skillsData'
import { playWaterBubble } from '../utils/audio'

// Penjelasan tiap layer, dengan contoh display filter Wireshark yang relevan
const OSI_LAYERS = [
  {
    code: 'L7',
    layer: 'Layer 7 Application',
    protocols: 'HTTP/HTTPS, DNS, SSH, DHCP',
    focus: 'Melihat port 80/443, 53, dan 22, serta credential yang terkirim plaintext.',
    filter: 'http.request.method == "POST"',
  },
  {
    code: 'L4',
    layer: 'Layer 4 Transport',
    protocols: 'TCP, UDP',
    focus: 'TCP 3-way handshake (SYN, SYN-ACK, ACK), ukuran window, dan aliran UDP.',
    filter: 'tcp.flags.syn == 1 && tcp.flags.ack == 0',
  },
  {
    code: 'L3',
    layer: 'Layer 3 Network',
    protocols: 'IPv4, ICMP, OSPF, ARP',
    focus: 'Subnetting CIDR dan VLSM, routing SVI, dan TTL di header IP.',
    filter: 'ip.addr == 192.168.10.0/24',
  },
  {
    code: 'L2',
    layer: 'Layer 2 Data Link',
    protocols: 'Ethernet II, 802.1Q, STP',
    focus: 'VLAN tagging, trunking, tabel MAC address, dan PVST+.',
    filter: 'vlan.id == 10',
  },
]

const levelStyle = {
  Dasar: 'border-kelp/50 bg-kelp/10 text-kelp',
  Belajar: 'border-aqua/50 bg-aqua/10 text-aqua',
  'Rencana Lab': 'border-mist/35 bg-white/5 text-mist border-dashed',
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState('networking')
  const [activeOsi, setActiveOsi] = useState(0)

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 })
  const [bodyRef, bodyVisible] = useScrollReveal({ threshold: 0.06 })

  const currentGroup = skillGroups.find((g) => g.id === activeTab)
  const osi = OSI_LAYERS[activeOsi]

  const tabs = [
    ...skillGroups.map((g, i) => ({ id: g.id, num: `0${i + 1}`, label: g.short })),
    { id: 'osi', num: '04', label: 'Layer OSI' },
  ]

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
                  onClick={() => {
                    playWaterBubble()
                    setActiveTab(tab.id)
                  }}
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
        {currentGroup && activeTab !== 'osi' && (
          <div role="tabpanel" className="p-5 sm:p-8">
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
                <li key={skill.name} className="flex flex-col justify-between bg-[#021721]/95 p-5 sm:p-6">
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
        )}

        {/* Bedah Layer OSI */}
        {activeTab === 'osi' && (
          <div role="tabpanel" className="p-5 sm:p-8">
            <div className="border-b border-aqua/15 pb-6">
              <h3 className="text-3xl text-white sm:text-4xl">Dari aplikasi sampai kabel</h3>
              <p className="mt-1.5 max-w-xl text-mist">
                Empat layer yang paling sering saya amati di lab dan Wireshark. Pilih satu untuk melihat contoh
                filternya.
              </p>
            </div>

            <div className="mt-7 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              <div className="divide-y divide-aqua/15 border border-aqua/15 lg:col-span-5">
                {OSI_LAYERS.map((item, idx) => {
                  const selected = activeOsi === idx
                  return (
                    <button
                      key={item.layer}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        playWaterBubble()
                        setActiveOsi(idx)
                      }}
                      className={`flex w-full items-center gap-4 border-l-2 p-4 text-left transition-colors duration-150 ${
                        selected
                          ? 'border-l-aqua bg-water/80'
                          : 'border-l-transparent bg-deep/50 hover:bg-water/35'
                      }`}
                    >
                      <span className={`font-mono text-xs font-semibold ${selected ? 'text-aqua' : 'text-mist/70'}`}>
                        {item.code}
                      </span>
                      <span>
                        <span className={`block font-semibold ${selected ? 'text-white' : 'text-foam'}`}>
                          {item.layer}
                        </span>
                        <span className="mt-0.5 block font-mono text-xs text-mist">{item.protocols}</span>
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="specimen-inset p-5 sm:p-6 lg:col-span-7" aria-live="polite">
                <span className="font-mono text-[0.6875rem] tracking-widest text-aqua uppercase">
                  Inspeksi // {osi.code}
                </span>
                <h4 className="mt-1 font-display text-3xl text-white">{osi.layer}</h4>
                <p className="mt-1 font-mono text-xs text-sand">{osi.protocols}</p>

                <p className="mt-4 leading-relaxed text-foam">{osi.focus}</p>

                <div className="mt-5 border border-aqua/20 bg-black/40 p-4">
                  <p className="font-mono text-[0.6875rem] tracking-wider text-mist uppercase">
                    Contoh display filter Wireshark
                  </p>
                  <code className="mt-1.5 block font-mono text-[0.8125rem] break-all text-aqua">{osi.filter}</code>
                </div>
              </div>
            </div>
          </div>
        )}

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
