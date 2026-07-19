import { useEffect, useState } from 'react'
import { mobileService } from '../services/mobileService'
import type { PerfilProfissional } from '../types/mobile'

export function usePerfilProfissional(usuarioId: number | null | undefined) {
  const [perfil, setPerfil] = useState<PerfilProfissional | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!usuarioId) return
    const ctrl = new AbortController()
    setLoading(true)

    mobileService
      .getMeuPerfil(ctrl.signal)
      .then((d) => {
        if (ctrl.signal.aborted) return
        setPerfil(d)
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false)
      })

    return () => ctrl.abort()
  }, [usuarioId])

  return { perfil, loading }
}
