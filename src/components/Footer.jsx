import { ArrowUpRight } from 'lucide-react'
import FishMark from './FishMark'
import { site } from '../data/site'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-aqua/15 bg-[#02131b]/85 px-5 pt-8 pb-12 sm:px-8 sm:pb-14">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <FishMark size={36} />
          <div>
            <p className="font-mono text-xs tracking-widest text-foam uppercase">FizhTank</p>
            <p className="mt-0.5 text-sm text-mist">
              © {new Date().getFullYear()} Hafidz Sirajuddin · {site.location}
            </p>
          </div>
        </div>

        <p className="max-w-sm text-sm text-mist sm:text-right">{site.tagline}</p>

        <a
          href="https://github.com/Fizhkan/FizhTank"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-[2px] border border-aqua/25 px-3 py-1.5 font-mono text-xs tracking-wider text-aqua transition-[border-color,color,transform] duration-200 hover:border-aqua/60 hover:text-foam active:scale-[0.97]"
        >
          <span>REPO GITHUB</span>
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
