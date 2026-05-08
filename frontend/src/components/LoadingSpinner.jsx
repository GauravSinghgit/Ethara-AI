export default function LoadingSpinner({ size = 'md', className = '' }) {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
  return (
    <div className={`${s} border-2 border-glow/30 border-t-glow rounded-full animate-spin ${className}`} />
  )
}
