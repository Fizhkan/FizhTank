import { ArrowRight, Mail, Sparkles, Shield, Network, Terminal } from 'lucide-react'

export default function Hero() {
  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 bg-mesh overflow-hidden">
      {/* Background bubbles */}
      <Bubbles />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Top badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-mono">
            <Sparkles size={14} className="text-violet-400" />
            <span>Network &amp; Security Engineer</span>
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
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Network Ecosystems
                </span>
              </h1>

              <p className="text-zinc-400 text-lg leading-relaxed mb-4">
                Focused on perancangan jaringan komputer, keamanan infrastruktur, dan membangun Linux homelab yang tangguh.
              </p>
              <p className="text-zinc-500 font-mono text-sm mb-8">
                <span className="text-violet-400">//</span> Navigating packets, filtering streams, and securing the ecosystem.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#labs"
                  className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] group"
                >
                  Explore Labs
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#contact"
                  className="flex items-center gap-2 px-6 py-3 border border-zinc-600 hover:border-violet-500/50 text-zinc-300 hover:text-violet-300 rounded-xl font-semibold transition-all"
                >
                  <Mail size={16} />
                  Get in Touch
                </a>
              </div>
            </div>

            {/* Right: Terminal Card */}
            <div className="relative">
              <div className="rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="ml-2 text-xs text-zinc-500 font-mono">fizhtank@arch ~ $</span>
                </div>
                {/* Terminal Body */}
                <div className="p-4 font-mono text-sm space-y-2">
                  <TerminalLine prompt="$" cmd="whoami" />
                  <TerminalLine output="fizhtank — network & security engineer" />
                  <TerminalLine prompt="$" cmd="cat skills.txt" />
                  <TerminalLine output="→ Routing & Switching, VLAN, ACL" color="text-violet-400" />
                  <TerminalLine output="→ Wireshark, Nmap, Firewall" color="text-violet-400" />
                  <TerminalLine output="→ Arch Linux, Bash, HomeLab" color="text-violet-400" />
                  <TerminalLine prompt="$" cmd="ping -c1 the-internet.io" />
                  <TerminalLine output="64 bytes from internet: icmp_seq=1 ttl=64 time=1.2ms" color="text-green-400" />
                  <TerminalLine prompt="$" cmd="_" blink />
                </div>
              </div>
              {/* Glow under terminal */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-violet-600/20 blur-xl rounded-full" />
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Network, label: 'Network Labs', val: '10+' },
            { icon: Shield, label: 'Security Projects', val: '5+' },
            { icon: Terminal, label: 'Linux Years', val: '3+' },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="bento-card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-violet-400" />
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

function TerminalLine({ prompt, cmd, output, color = 'text-zinc-400', blink }) {
  return (
    <div className="flex items-center gap-2">
      {prompt && <span className="text-violet-500">{prompt}</span>}
      {cmd && <span className="text-zinc-200">{cmd}</span>}
      {output && <span className={color}>{output}</span>}
      {blink && <span className="blink text-violet-400">▋</span>}
    </div>
  )
}

function Bubbles() {
  const bubbles = [
    { size: 6, left: '10%', delay: '0s', duration: '8s' },
    { size: 4, left: '20%', delay: '2s', duration: '10s' },
    { size: 8, left: '40%', delay: '1s', duration: '7s' },
    { size: 5, left: '60%', delay: '3s', duration: '9s' },
    { size: 3, left: '75%', delay: '0.5s', duration: '11s' },
    { size: 7, left: '88%', delay: '4s', duration: '8s' },
  ]
  return (
    <>
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            bottom: '0',
            animationDelay: b.delay,
            animationDuration: b.duration,
          }}
        />
      ))}
    </>
  )
}
