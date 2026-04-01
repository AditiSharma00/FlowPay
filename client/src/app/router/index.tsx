import { Navigate, Route, Routes } from 'react-router-dom'

import { BuilderPage } from '../../pages/builder/builder-page'
import { NotFoundPage } from '../../pages/not-found/not-found-page'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/builder" replace />} />
      <Route path="/builder" element={<BuilderPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
