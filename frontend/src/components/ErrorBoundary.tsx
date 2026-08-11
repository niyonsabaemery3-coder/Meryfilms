import { Component, ReactNode } from 'react'
import { Clapperboard } from 'lucide-react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

// Catches render-time errors anywhere below it so a single broken page
// (a bad admin form, a malformed movie record) shows a recoverable screen
// instead of a fully blank/white app — the kind of crash a viewer would
// otherwise blame on the whole site being down.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error('MeryFilms crashed:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center px-4 text-center bg-void">
          <div>
            <Clapperboard className="mx-auto mb-4 text-amber" size={32} />
            <p className="text-parchment font-body mb-4">Hari ikibazo cyagaragaye. Gerageza kongera gufungura paji.</p>
            <button
              onClick={() => window.location.assign('/')}
              className="text-amber hover:text-amber-soft text-sm font-mono underline"
            >
              Subira ku ntangiriro
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
