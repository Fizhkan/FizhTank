// Upcoming engineering labs; benchmarks and commands added after execution.

export const labsData = [
  {
    id: 1,
    title: 'Enterprise Multi-VLAN Segmentation',
    category: 'Network Architecture',
    status: 'planned',
    description:
      'Segmented enterprise topology with four departmental VLANs, Layer 3 SVI inter-VLAN routing, and Extended ACL traffic isolation.',
    tags: ['Cisco Packet Tracer', 'Inter-VLAN', 'ACL', 'STP', 'OSPF'],
    repoUrl: '',
    topologyImage: '',
    topologyAlt:
      'Topology blueprint: core Layer 3 switch connected to access switches for IT, HR, and Finance VLANs.',
    reportUrl: '',
    writeup: {
      objective:
        'Design an enterprise network with four isolated VLANs, configure SVI inter-VLAN routing on a Layer 3 core switch, and enforce departmental access control via Extended ACLs.',
      plannedSteps: [
        'Design VLSM addressing scheme across IT, HR, Finance, and Management subnets.',
        'Build core Layer 3 switch and access-layer switch topology in Cisco Packet Tracer.',
        'Configure 802.1Q trunk links and assign switchports to dedicated access VLANs.',
        'Provision Switched Virtual Interfaces (SVIs) for inter-VLAN routing.',
        'Apply Extended ACL rules isolating HR traffic from Finance subnets.',
        'Validate end-to-end reachability and verify ACL policy enforcement.',
      ],
    },
  },
  {
    id: 2,
    title: 'Packet Inspection: Plaintext vs. TLS',
    category: 'Security Analysis',
    status: 'planned',
    description:
      'Traffic capture analysis with Wireshark contrasting exposed HTTP/FTP credentials against encrypted TLS 1.3 payloads.',
    tags: ['Wireshark', 'TLS 1.3', 'HTTP/FTP', 'Display Filters', 'pcapng'],
    repoUrl: '',
    topologyImage: '',
    topologyAlt:
      'Capture blueprint: Wireshark sniffing client-to-server HTTP and HTTPS traffic.',
    reportUrl: '',
    writeup: {
      objective:
        'Contrast unencrypted protocol exposure against TLS 1.3 encryption through live packet capture and TCP stream inspection.',
      plannedSteps: [
        'Provision an isolated virtual client/server pair serving HTTP, FTP, and HTTPS.',
        'Capture plaintext authentication frames across HTTP POST and FTP sessions.',
        'Reassemble TCP streams to inspect exposed credentials in raw payloads.',
        'Capture HTTPS traffic on port 443 and examine the TLS 1.3 handshake.',
        'Document payload confidentiality differences between plaintext and TLS.',
      ],
    },
  },
  {
    id: 3,
    title: 'Arch Linux Firewall & DNS Gateway',
    category: 'Linux Infrastructure',
    status: 'planned',
    description:
      'Self-hosted Arch Linux gateway enforcing stateful UFW/iptables policies, Pi-hole DNS sinkholing, and port exposure audits.',
    tags: ['Arch Linux', 'UFW', 'iptables', 'Pi-hole', 'Local DNS', 'Hardening'],
    repoUrl: '',
    topologyImage: '',
    topologyAlt:
      'Homelab blueprint: Arch Linux gateway routing between WAN and segmented LAN clients.',
    reportUrl: '',
    writeup: {
      objective:
        'Deploy a hardened Linux homelab gateway implementing default-deny firewall policies, DNS-level filtering, and key-based SSH administration.',
      plannedSteps: [
        'Install and harden base Arch Linux on a dedicated VM or homelab host.',
        'Configure UFW with default-deny incoming and explicit allow-list policies.',
        'Deploy Pi-hole as the local DNS resolver on port 53.',
        'Verify remote SSH administration restricted to Ed25519 key authentication.',
        'Run external Nmap port scans to verify minimal attack surface.',
      ],
    },
  },
]
