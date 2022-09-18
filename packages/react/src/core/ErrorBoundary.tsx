import { IErrorBoundaryProps } from '@/types'
import { Component, ErrorInfo } from 'react'

export class ErrorBoundary extends Component<IErrorBoundaryProps> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError && this.props.onError(error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null
    }
    return this.props.children || null
  }
}
