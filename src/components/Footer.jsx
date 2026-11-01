import { ArrowUpRight } from 'lucide-react'
import FishMark from './FishMark'
import { site } from '../data/site'

export default function Footer() {
  return (
    <footer className="relative z-10 px-5 pt-8 pb-28 sm:px-8 sm:pb-32">
      <div className="glass mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-6 sm:flex-row sm:items-center sm:px-8">
        <div className="flex items-center gap-4">
          <FishMark size={40} />
          <div>
            <p className="font-display text-lg font-semibold text-white">FizhTank</p>
            <p className="text-sm text-mist">
              © {new Date().getFullYear()} Siraj (Fizhkan) · {site.location}
            </p>
          </div>
        </div>

        <p className="max-w-sm text-sm text-mist sm:text-right">{site.tagline}</p>

        <a
          href="https://github.com/Fizhkan/FizhTank"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-aqua hover:text-white"
        >
          <span>Kode situs ini di GitHub</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
