import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary captured error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#010712] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl apple-glass text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle size={28} />
            </div>
            <h2 className="text-xl font-bold font-display text-white">
              Telemetry Signal Interrupted
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Terjadi anomali pada antarmuka sistem akuarium. Silakan muat ulang halaman untuk membangun kembali koneksi stream.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-full text-sm font-bold transition-all cursor-pointer shadow-lg shadow-cyan-400/25 active:scale-95"
            >
              <RefreshCw size={15} />
              <span>Muat Ulang Halaman</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
