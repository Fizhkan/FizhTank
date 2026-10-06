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
        <div className="min-h-screen bg-[#010205] text-zinc-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-2xl border border-red-500/30 bg-zinc-950/80 backdrop-blur-xl text-center space-y-4 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle size={28} />
            </div>
            <h2 className="text-xl font-bold font-display text-zinc-50">
              Telemetry Signal Interrupted
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed font-sans">
              Terjadi anomali pada antarmuka deep ecosystem. Silakan muat ulang halaman untuk membangun kembali koneksi stream.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-violet-600/25"
            >
              <RefreshCw size={15} />
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
