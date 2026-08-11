import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import { MoviesProvider } from './context/MoviesContext'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import { HomeSkeleton } from './components/Skeletons'

// Route-level code splitting: Watch and, especially, the whole Admin
// section (forms, dashboard, category/narrator management) are only
// downloaded when a visitor actually navigates there. A regular viewer
// browsing/watching movies never pays the bytes for the admin bundle at all.
const Watch = lazy(() => import('./pages/Watch'))
const Admin = lazy(() => import('./pages/Admin'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <MoviesProvider>
            <BrowserRouter>
              <Suspense fallback={<HomeSkeleton />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/watch/:id" element={<Watch />} />
                  <Route path="/admin/*" element={<Admin />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </MoviesProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
