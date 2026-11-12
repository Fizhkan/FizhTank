// Honest skill levels without arbitrary percentage bars.
export const levelNotes = {
  Foundational: 'Applied in coursework & lab setups',
  Practicing: 'Active hands-on lab focus',
  Planned: 'Queued in upcoming lab roadmap',
}

export const skillGroups = [
  {
    id: 'networking',
    short: 'Networking',
    label: 'Network Engineering',
    description: 'IP addressing, dynamic routing, and Layer 2/3 segmentation.',
    skills: [
      {
        name: 'IPv4 Subnetting & CIDR',
        level: 'Foundational',
        context: 'VLSM allocation and subnetting from /24 to /30 tailored to host requirements.',
      },
      {
        name: 'Routing (OSPF & Static)',
        level: 'Practicing',
        context: 'Single-area OSPF and static route configuration in Cisco IOS simulations.',
      },
      {
        name: 'VLANs & 802.1Q Trunking',
        level: 'Practicing',
        context: 'Segmenting broadcast domains, trunk links, and Layer 3 SVI routing.',
      },
      {
        name: 'DHCP & DNS Services',
        level: 'Foundational',
        context: 'DHCP relay configuration and local DNS resolver deployment.',
      },
      {
        name: 'Cisco IOS CLI & Packet Tracer',
        level: 'Practicing',
        context: 'Topology modeling and diagnostics via IOS show and debug commands.',
      },
    ],
    tags: ['IPv4', 'VLAN 802.1Q', 'OSPF', 'STP', 'Inter-VLAN', 'NAT/PAT'],
  },
  {
    id: 'linux',
    short: 'Linux',
    label: 'Linux & Systems',
    description: 'Daily workstation administration, shell automation, and service control.',
    skills: [
      {
        name: 'Arch Linux & EndeavourOS',
        level: 'Foundational',
        context: 'Primary workstation environment for CLI workflows and lab orchestration.',
      },
      {
        name: 'Bash Scripting',
        level: 'Practicing',
        context: 'Automating routine diagnostics, log parsing, and system tasks.',
      },
      {
        name: 'systemd & Service Management',
        level: 'Foundational',
        context: 'Daemon lifecycle management, unit files, and journalctl inspection.',
      },
      {
        name: 'Package Management (pacman)',
        level: 'Foundational',
        context: 'Dependency maintenance, package auditing, and repository hygiene.',
      },
      {
        name: 'SSH & Remote Hardening',
        level: 'Foundational',
        context: 'Ed25519 key-pair authentication and hardened daemon configuration.',
      },
    ],
    tags: ['Arch Linux', 'Bash', 'systemd', 'pacman', 'SSH', 'cron'],
  },
  {
    id: 'security',
    short: 'Security',
    label: 'Security & Traffic Analysis',
    description: 'Packet inspection, network reconnaissance, and perimeter filtering.',
    skills: [
      {
        name: 'Wireshark & Packet Inspection',
        level: 'Practicing',
        context: 'Capture filtering, TCP stream reassembly, and protocol handshake analysis.',
      },
      {
        name: 'Nmap Reconnaissance',
        level: 'Practicing',
        context: 'Port discovery (-sT, -sS) and service enumeration in isolated lab targets.',
      },
      {
        name: 'Firewalls (UFW & iptables)',
        level: 'Practicing',
        context: 'Stateful rule authoring, port lockdown, and default-deny perimeter design.',
      },
      {
        name: 'Protocol Security (Plaintext vs. TLS)',
        level: 'Practicing',
        context: 'Comparing cleartext HTTP/FTP exposure against TLS 1.3 encryption.',
      },
      {
        name: 'Access Control Lists (ACL)',
        level: 'Planned',
        context: 'Standard and Extended ACL enforcement between enterprise VLANs.',
      },
    ],
    tags: ['Wireshark', 'Nmap', 'iptables', 'UFW', 'ACL', 'TLS'],
  },
]

export const toolsData = [
  { label: 'Cisco Packet Tracer', used: true },
  { label: 'Wireshark', used: true },
  { label: 'Nmap', used: true },
  { label: 'UFW / iptables', used: true },
  { label: 'Arch Linux', used: true },
  { label: 'Pi-hole', used: false },
  { label: 'pfSense', used: false },
  { label: 'VirtualBox', used: false },
  { label: 'Proxmox', used: false },
]
