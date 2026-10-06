/**
 * IPv4 VLSM Subnet Calculator Engine
 * Calculates network ID, broadcast IP, netmask, wildcard mask, usable host range, and host count.
 * Supports CIDR prefixes /1 through /32 with RFC 3021 /31 point-to-point support.
 */
export function calculateSubnet(cidrInput) {
  const trimmed = cidrInput.trim()
  const parts = trimmed.split('/')
  if (parts.length !== 2) {
    return { error: 'Format salah! Gunakan: subnet <IP>/<CIDR>\nContoh: subnet 192.168.1.0/26' }
  }

  const ipStr = parts[0].trim()
  const maskBits = parseInt(parts[1].trim(), 10)

  if (isNaN(maskBits) || maskBits < 1 || maskBits > 32) {
    return { error: 'Prefix CIDR tidak valid! Masukkan angka antara /1 dan /32.' }
  }

  const octets = ipStr.split('.').map((o) => parseInt(o, 10))
  if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
    return { error: 'Alamat IPv4 tidak valid! Gunakan format dotted-decimal (misal: 192.168.1.0).' }
  }

  const ipInt = (((octets[0] << 24) >>> 0) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0
  const maskInt = maskBits === 0 ? 0 : ((0xffffffff << (32 - maskBits)) >>> 0)
  const wildcardInt = (~maskInt) >>> 0

  const networkInt = (ipInt & maskInt) >>> 0
  const broadcastInt = (networkInt | wildcardInt) >>> 0

  const intToIp = (val) => [
    (val >>> 24) & 0xff,
    (val >>> 16) & 0xff,
    (val >>> 8) & 0xff,
    val & 0xff,
  ].join('.')

  let usableCount = 0
  let hostRange = ''

  if (maskBits === 32) {
    usableCount = 1
    hostRange = `${intToIp(networkInt)} (Single Host)`
  } else if (maskBits === 31) {
    usableCount = 2
    hostRange = `${intToIp(networkInt)} — ${intToIp(broadcastInt)} (RFC 3021 Point-to-Point)`
  } else {
    usableCount = Math.pow(2, 32 - maskBits) - 2
    const firstHost = (networkInt + 1) >>> 0
    const lastHost = (broadcastInt - 1) >>> 0
    hostRange = `${intToIp(firstHost)} — ${intToIp(lastHost)}`
  }

  return {
    ip: ipStr,
    cidr: `/${maskBits}`,
    netmask: intToIp(maskInt),
    wildcard: intToIp(wildcardInt),
    network: intToIp(networkInt),
    broadcast: intToIp(broadcastInt),
    usableRange: hostRange,
    totalUsable: usableCount.toLocaleString(),
  }
}
