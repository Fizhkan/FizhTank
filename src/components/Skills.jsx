import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { skillGroups, toolsData, levelNotes } from '../data/skillsData'
import { playWaterBubble } from '../utils/audio'

// Penjelasan tiap layer, dengan contoh display filter Wireshark yang relevan
const OSI_LAYERS = [
  {
    layer: 'Layer 7 Application',
    protocols: 'HTTP/HTTPS, DNS, SSH, DHCP',
    focus: 'Melihat port 80/443, 53, dan 22, serta credential yang terkirim plaintext.',
    filter: 'http.request.method == "POST"',
  },
  {
    layer: 'Layer 4 Transport',
    protocols: 'TCP, UDP',
    focus: 'TCP 3-way handshake (SYN, SYN-ACK, ACK), ukuran window, dan aliran UDP.',
    filter: 'tcp.flags.syn == 1 && tcp.flags.ack == 0',
  },
  {
    layer: 'Layer 3 Network',
    protocols: 'IPv4, ICMP, OSPF, ARP',
    focus: 'Subnetting CIDR dan VLSM, routing SVI, dan TTL di header IP.',
    filter: 'ip.addr == 192.168.10.0/24',
  },
  {
    layer: 'Layer 2 Data Link',
    protocols: 'Ethernet II, 802.1Q, STP',
    focus: 'VLAN tagging, trunking, tabel MAC address, dan PVST+.',
    filter: 'vlan.id == 10',
  },
]

const levelStyle = {
  Dasar: 'border-kelp/50 bg-kelp/10 text-kelp',
  Belajar: 'border-aqua/50 bg-aqua/10 text-aqua',
  'Rencana Lab': 'border-white/30 bg-white/5 text-mist border-dashed',
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState('networking')
  const [activeOsi, setActiveOsi] = useState(0)

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 })
  const [bodyRef, bodyVisible] = useScrollReveal({ threshold: 0.06 })

  const currentGroup = skillGroups.find((g) => g.id === activeTab)
  const osi = OSI_LAYERS[activeOsi]

  const tabs = [...skillGroups.map((g) => ({ id: g.id, label: g.short })), { id: 'osi', label: 'Layer OSI' }]

  const reveal = (visible, offset = 24) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${offset}px)`,
  })

  return (
    <section id="skills" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div ref={headerRef} className="mb-12 max-w-2xl transition-all duration-700" style={reveal(headerVisible)}>
        <p className="eyebrow">Skill</p>
        <h2 className="section-title on-water mt-4">Apa yang sedang saya pelajari</h2>
        <p className="lede on-water mt-4">
          Tanpa persentase. Setiap skill diberi level yang apa adanya, dan semuanya saya latih lewat simulasi lab
          dan praktik langsung di Linux.
        </p>
      </div>

      <div ref={bodyRef} className="glass overflow-hidden transition-all duration-700" style={reveal(bodyVisible, 28)}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
          <div role="tablist" aria-label="Kategori skill" className="flex flex-wrap gap-1 rounded-full bg-black/25 p-1">
            {tabs.map((tab) => {
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
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active ? 'bg-aqua text-deep' : 'text-mist hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-mist" aria-label="Arti level">
            {Object.entries(levelNotes).map(([level, note]) => (
              <li key={level} className="flex items-center gap-1.5">
                <span className={`inline-block h-2.5 w-2.5 rounded-full border ${levelStyle[level]}`} aria-hidden="true" />
                <span>
                  <span className="font-medium text-foam">{level}</span>: {note}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {currentGroup && activeTab !== 'osi' && (
          <div role="tabpanel" className="p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
              <div>
                <h3 className="text-3xl text-white">{currentGroup.label}</h3>
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

            <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {currentGroup.skills.map((skill) => (
                <li key={skill.name} className="glass-inset flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-sans text-base leading-snug font-semibold tracking-normal text-white">
                      {skill.name}
                    </h4>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${levelStyle[skill.level]}`}
                    >
                      {skill.level}
                    </span>
                  </div>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-mist">{skill.context}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'osi' && (
          <div role="tabpanel" className="p-5 sm:p-8">
            <div className="border-b border-white/10 pb-6">
              <h3 className="text-3xl text-white">Dari aplikasi sampai kabel</h3>
              <p className="mt-1.5 max-w-xl text-mist">
                Empat layer yang paling sering saya amati di lab dan Wireshark. Pilih satu untuk melihat contoh
                filternya.
              </p>
            </div>

            <div className="mt-7 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              <div className="space-y-2.5 lg:col-span-5">
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
                      className={`w-full rounded-xl border p-4 text-left transition-colors ${
                        selected
                          ? 'border-aqua/70 bg-aqua/10'
                          : 'border-white/15 bg-white/[0.03] hover:border-white/30'
                      }`}
                    >
                      <span className={`block font-semibold ${selected ? 'text-aqua' : 'text-white'}`}>{item.layer}</span>
                      <span className="mt-0.5 block text-sm text-mist">{item.protocols}</span>
                    </button>
                  )
                })}
              </div>

              <div className="glass-inset p-5 sm:p-6 lg:col-span-7" aria-live="polite">
                <h4 className="font-display text-2xl text-white">{osi.layer}</h4>
                <p className="mt-1 text-sm text-mist">{osi.protocols}</p>

                <p className="mt-4 leading-relaxed text-foam">{osi.focus}</p>

                <div className="mt-5 rounded-lg border border-white/10 bg-black/30 p-3.5">
                  <p className="text-sm text-mist">Contoh display filter Wireshark</p>
                  <code className="mt-1 block font-mono text-[0.8125rem] break-all text-aqua">{osi.filter}</code>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-white/10 px-5 py-6 sm:px-8">
          <h3 className="font-sans text-base font-semibold tracking-normal text-white">Tool</h3>
          <p className="mt-0.5 text-sm text-mist">Yang bergaris putus belum saya pakai, tapi masuk rencana.</p>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {toolsData.map((tool) => (
              <li
                key={tool.label}
                className={`rounded-full border px-3.5 py-1.5 text-sm ${
                  tool.used
                    ? 'border-aqua/50 bg-aqua/10 font-medium text-foam'
                    : 'border-dashed border-white/25 text-mist'
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
