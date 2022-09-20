import React, { PropsWithChildren } from 'react'
import type { MutableRefObject, ReactElement, ReactNode } from 'react'
import type { LayoutFunc } from './Route'

interface Props extends PropsWithChildren {
  fallback?: ReactNode
  pathname: string
  errorRef: MutableRefObject<ErrorBoundary | null>
  layout: LayoutFunc | null
}

interface State {
  hasError: boolean
  pathname: string
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.props.errorRef.current = this
  }

  state = {
    hasError: false,
    pathname: this.props.pathname,
  }

  static getDerivedStateFromError() {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true }
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.pathname !== state.pathname) {
      return {
        pathname: props.pathname,
        hasError: false,
      }
    }
    return null
  }

  mounted = false

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  clearError() {
    if (this.mounted) {
      this.setState({
        hasError: false,
      })
    }
  }

  render() {
    const { hasError } = this.state
    const { fallback, children, layout } = this.props
    if (hasError) {
      const ui = (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {fallback ? fallback : <h1>Ops...Something went wrong</h1>}
        </div>
      )
      return typeof layout === 'function' ? layout(ui) : ui
    }

    return typeof layout === 'function' ? layout(children as ReactElement) : children
  }
}
