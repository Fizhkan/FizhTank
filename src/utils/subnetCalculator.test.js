import { describe, it, expect } from 'vitest'
import { calculateSubnet } from './subnetCalculator'

describe('calculateSubnet', () => {
  describe('Valid Subnet Calculations', () => {
    it('calculates standard /24 subnet accurately', () => {
      const result = calculateSubnet('192.168.1.0/24')
      expect(result.error).toBeUndefined()
      expect(result.ip).toBe('192.168.1.0')
      expect(result.cidr).toBe('/24')
      expect(result.netmask).toBe('255.255.255.0')
      expect(result.wildcard).toBe('0.0.0.255')
      expect(result.network).toBe('192.168.1.0')
      expect(result.broadcast).toBe('192.168.1.255')
      expect(result.usableRange).toBe('192.168.1.1 — 192.168.1.254')
      expect(result.totalUsable).toBe('254')
    })

    it('correctly derives network and broadcast from a host IP in /26', () => {
      const result = calculateSubnet('192.168.1.75/26')
      expect(result.error).toBeUndefined()
      expect(result.network).toBe('192.168.1.64')
      expect(result.broadcast).toBe('192.168.1.127')
      expect(result.usableRange).toBe('192.168.1.65 — 192.168.1.126')
      expect(result.netmask).toBe('255.255.255.192')
      expect(result.wildcard).toBe('0.0.0.63')
      expect(result.totalUsable).toBe('62')
    })

    it('calculates large /16 enterprise subnet', () => {
      const result = calculateSubnet('10.20.0.0/16')
      expect(result.error).toBeUndefined()
      expect(result.netmask).toBe('255.255.0.0')
      expect(result.wildcard).toBe('0.0.255.255')
      expect(result.network).toBe('10.20.0.0')
      expect(result.broadcast).toBe('10.20.255.255')
      expect(result.usableRange).toBe('10.20.0.1 — 10.20.255.254')
      expect(result.totalUsable).toBe('65,534')
    })

    it('supports RFC 3021 /31 point-to-point subnets', () => {
      const result = calculateSubnet('10.0.0.0/31')
      expect(result.error).toBeUndefined()
      expect(result.totalUsable).toBe('2')
      expect(result.usableRange).toContain('RFC 3021 Point-to-Point')
      expect(result.usableRange).toBe('10.0.0.0 — 10.0.0.1 (RFC 3021 Point-to-Point)')
    })

    it('supports /32 single host loopback address', () => {
      const result = calculateSubnet('10.255.255.1/32')
      expect(result.error).toBeUndefined()
      expect(result.totalUsable).toBe('1')
      expect(result.usableRange).toBe('10.255.255.1 (Single Host)')
    })

    it('handles boundary /1 prefix', () => {
      const result = calculateSubnet('128.0.0.0/1')
      expect(result.error).toBeUndefined()
      expect(result.netmask).toBe('128.0.0.0')
      expect(result.wildcard).toBe('127.255.255.255')
    })
  })

  describe('Validation & Error Handling', () => {
    it('returns error when format lacks slash or CIDR', () => {
      const result = calculateSubnet('192.168.1.1')
      expect(result.error).toBeDefined()
      expect(result.error).toContain('Format salah')
    })

    it('returns error on empty or falsy input', () => {
      expect(calculateSubnet('').error).toBeDefined()
      expect(calculateSubnet(null).error).toBeDefined()
      expect(calculateSubnet(undefined).error).toBeDefined()
    })

    it('rejects invalid CIDR prefixes (< 1 or > 32)', () => {
      expect(calculateSubnet('192.168.1.0/0').error).toContain('Prefix CIDR tidak valid')
      expect(calculateSubnet('192.168.1.0/33').error).toContain('Prefix CIDR tidak valid')
      expect(calculateSubnet('192.168.1.0/abc').error).toContain('Prefix CIDR tidak valid')
    })

    it('rejects invalid octets (> 255 or negative)', () => {
      expect(calculateSubnet('192.168.1.256/24').error).toContain('Alamat IPv4 tidak valid')
      expect(calculateSubnet('192.168.1.-5/24').error).toContain('Alamat IPv4 tidak valid')
    })

    it('rejects malformed IP addresses', () => {
      expect(calculateSubnet('192.168.1/24').error).toContain('Alamat IPv4 tidak valid')
      expect(calculateSubnet('192.168.1.1.5/24').error).toContain('Alamat IPv4 tidak valid')
      expect(calculateSubnet('abc.def.ghi.jkl/24').error).toContain('Alamat IPv4 tidak valid')
    })
  })
})
