import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary menangkap error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-deep p-6 text-foam">
          <div className="glass w-full max-w-md space-y-4 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-coral/40 bg-coral/10 text-coral">
              <AlertTriangle size={26} aria-hidden="true" />
            </div>
            <h2 className="text-2xl text-white">Tank-nya sedang bermasalah</h2>
            <p className="text-[0.9375rem] leading-relaxed text-mist">
              Ada error saat menampilkan halaman ini. Muat ulang untuk mengisi ulang airnya.
            </p>
            <button type="button" onClick={this.handleReload} className="btn btn-primary">
              <RefreshCw size={16} aria-hidden="true" />
              <span>Muat ulang halaman</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
