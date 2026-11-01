// Logo FizhTank: Monogram "F" geometris khas Fizhkan dengan palet akuarium (Laguna, Foam, dan Coral).
export default function FishMark({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="Logo FizhTank"
      className={className}
    >
      <rect width="32" height="32" rx="7" fill="#05303e" />
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="6.25" fill="none" stroke="#6fe3d3" strokeWidth="1.2" strokeOpacity="0.4" />
      <path d="M9 7h14v4.2H13.4v3.3h7.6v4.1h-7.6V25H9z" fill="#eaf7f6" />
      <rect x="17" y="21" width="6" height="4" rx="1" fill="#ff8a4c" />
    </svg>
  )
}
