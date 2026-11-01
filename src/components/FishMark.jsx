// Logo FizhTank: ikan clownfish kecil dengan dua gelembung, di dalam ubin air.
export default function FishMark({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Logo FizhTank"
      className={className}
    >
      <rect width="64" height="64" rx="15" fill="#05303e" />
      <rect x="1" y="1" width="62" height="62" rx="14" fill="none" stroke="#6fe3d3" strokeOpacity="0.28" />
      <path d="M43 33 57 23v20z" fill="#ff8a4c" />
      <path d="M13 33c6-12 25-12 32 0-7 12-26 12-32 0z" fill="#ff8a4c" />
      <path d="M30 23.5q4 9.5 0 19" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <circle cx="20.5" cy="31" r="2.2" fill="#05303e" />
      <circle cx="19" cy="17" r="3" fill="none" stroke="#6fe3d3" strokeWidth="1.6" />
      <circle cx="26.5" cy="11" r="1.8" fill="none" stroke="#6fe3d3" strokeWidth="1.4" />
    </svg>
  )
}
