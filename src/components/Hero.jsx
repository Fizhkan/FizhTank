import { ArrowRight, Mail, Sparkles, Shield, Network, Terminal, Droplets, Waves } from 'lucide-react'

export default function Hero() {
  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6 overflow-hidden">
      {/* Ambient deep-ocean radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(91,33,182,0.14) 0%, transparent 65%), ' +
            'radial-gradient(ellipse 60% 40% at 20% 80%, rgba(6,182,212,0.06) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Top badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-950/40 border border-violet-500/25 text-violet-300 text-sm font-mono backdrop-blur-sm">
            <Waves size={14} className="text-cyan-400 bio-glow" />
            <span>Network &amp; Security Engineer</span>
            <Droplets size={12} className="text-violet-400" />
          </div>
        </div>

        {/* Main Bento Hero Card */}
        <div className="bento-card gradient-border p-8 md:p-12 mb-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Text */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                <span className="text-zinc-100">Designing Secure</span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 40%, #06b6d4 100%)',
                  }}
                >
                  Network Ecosystems
                </span>
              </h1>

              <p className="text-zinc-400 text-lg leading-relaxed mb-3">
                Perancangan jaringan komputer, keamanan infrastruktur, dan Linux homelab yang tangguh.
              </p>
              <p
                className="font-mono text-sm mb-8"
                style={{ color: 'rgba(6,182,212,0.7)' }}
              >
                <span className="text-violet-400">//</span>{' '}
                Navigating packets, filtering streams, and securing the ecosystem.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#labs"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all group text-white"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    boxShadow: '0 0 20px rgba(109,40,217,0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 35px rgba(139,92,246,0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(109,40,217,0.3)'
                  }}
                >
                  <Waves size={16} />
                  Explore Labs
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#contact"
                  className="flex items-center gap-2 px-6 py-3 border rounded-xl font-semibold transition-all text-zinc-300 hover:text-cyan-300"
                  style={{
                    borderColor: 'rgba(6,182,212,0.3)',
                    background: 'rgba(6,182,212,0.04)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.6)'
                    e.currentTarget.style.background = 'rgba(6,182,212,0.08)'
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(6,182,212,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'
                    e.currentTarget.style.background = 'rgba(6,182,212,0.04)'
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  <Mail size={16} />
                  Get in Touch
                </a>
              </div>
            </div>

            {/* Right: Terminal Card with sonar deco */}
            <div className="relative">
              {/* Sonar / depth-ping deco rings */}
              <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full border pointer-events-none"
                style={{
                  borderColor: 'rgba(6,182,212,0.2)',
                  animation: 'depth-ping 3s ease-out infinite',
                }}
              />
              <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full border pointer-events-none"
                style={{
                  borderColor: 'rgba(139,92,246,0.15)',
                  animation: 'depth-ping 3s ease-out infinite 1.5s',
                }}
              />

              {/* Terminal */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(4,6,15,0.9)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  boxShadow: '0 0 40px rgba(109,40,217,0.12), inset 0 1px 0 rgba(167,139,250,0.05)',
                }}
              >
                {/* Terminal Header */}
                <div
                  className="flex items-center gap-2 px-4 py-3 border-b"
                  style={{
                    background: 'rgba(8,12,28,0.8)',
                    borderColor: 'rgba(99,102,241,0.12)',
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-xs text-zinc-500 font-mono">fizhtank@arch:~$</span>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/40 blink" />
                    <span className="text-xs text-cyan-500/50 font-mono">SSH</span>
                  </div>
                </div>

                {/* Terminal Body */}
                <div className="p-5 font-mono text-sm space-y-2.5">
                  <TerminalLine prompt="$" cmd="whoami" />
                  <TerminalLine output="fizhtank — network &amp; security engineer" color="text-zinc-300" />
                  <TerminalLine prompt="$" cmd="cat /etc/ocean.conf" />
                  <TerminalLine output="[ecosystem]" color="text-cyan-500/70" />
                  <TerminalLine output="  depth  = 2600m    # OSI Layer 1-7" color="text-violet-400" />
                  <TerminalLine output="  vlan   = 10,20,30,99" color="text-violet-400" />
                  <TerminalLine output="  shield = iptables + acl + wireshark" color="text-violet-400" />
                  <TerminalLine prompt="$" cmd="ping -c1 the-internet.io" />
                  <TerminalLine output="64 bytes from net: icmp_seq=1 ttl=64 time=1.2ms" color="text-green-400" />
                  <TerminalLine prompt="$" cmd="nmap -sV 192.168.1.0/24" />
                  <TerminalLine output="Scanning ecosystem... 🐟 packets captured." color="text-cyan-400/80" />
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-violet-500">$</span>
                    <span className="blink text-cyan-400 text-base">▋</span>
                  </div>
                </div>
              </div>

              {/* Glow under terminal */}
              <div
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3/4 h-10 rounded-full"
                style={{
                  background: 'rgba(109,40,217,0.2)',
                  filter: 'blur(12px)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Network, label: 'Network Labs', val: '10+', color: 'text-violet-400', bg: 'rgba(109,40,217,0.1)', border: 'rgba(109,40,217,0.2)' },
            { icon: Shield, label: 'Security Projects', val: '5+', color: 'text-cyan-400', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)' },
            { icon: Terminal, label: 'Linux Years', val: '3+', color: 'text-emerald-400', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
          ].map(({ icon: Icon, label, val, color, bg, border }) => (
            <div key={label} className="bento-card p-5 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-100">{val}</p>
                <p className="text-xs text-zinc-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TerminalLine({ prompt, cmd, output, color = 'text-zinc-500' }) {
  return (
    <div className="flex items-center gap-2 leading-relaxed">
      {prompt && <span className="text-violet-500 shrink-0">{prompt}</span>}
      {cmd && <span className="text-zinc-200">{cmd}</span>}
      {output && (
        <span
          className={color}
          dangerouslySetInnerHTML={{ __html: output }}
        />
      )}
    </div>
  )
}
