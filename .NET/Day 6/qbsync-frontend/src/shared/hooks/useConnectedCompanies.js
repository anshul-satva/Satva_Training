import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../api/client'

const STORAGE_KEY = 'selectedRealmId'

export default function useConnectedCompanies() {
  const [companies, setCompanies] = useState([])
  const [selectedRealmId, setSelectedRealmId] = useState(() => localStorage.getItem(STORAGE_KEY) || '')
  const [loadingCompanies, setLoadingCompanies] = useState(true)

  const updateSelectedRealmId = useCallback((realmId) => {
    setSelectedRealmId(realmId)
    if (realmId) {
      localStorage.setItem(STORAGE_KEY, realmId)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const fetchCompanies = useCallback(async () => {
    setLoadingCompanies(true)
    try {
      const res = await api.get('/quickbooks/companies')
      const nextCompanies = res.data.data || []
      setCompanies(nextCompanies)

      const currentExists = nextCompanies.some((company) => company.realmId === selectedRealmId)
      const nextRealmId = currentExists
        ? selectedRealmId
        : (nextCompanies[0]?.realmId || '')

      updateSelectedRealmId(nextRealmId)
    } finally {
      setLoadingCompanies(false)
    }
  }, [selectedRealmId, updateSelectedRealmId])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const selectedCompany = useMemo(
    () => companies.find((company) => company.realmId === selectedRealmId) || null,
    [companies, selectedRealmId]
  )

  return {
    companies,
    selectedCompany,
    selectedRealmId,
    setSelectedRealmId: updateSelectedRealmId,
    loadingCompanies,
    fetchCompanies
  }
}
