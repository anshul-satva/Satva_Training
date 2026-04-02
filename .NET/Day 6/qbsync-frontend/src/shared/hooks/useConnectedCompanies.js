import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import api from '../api/client'

const STORAGE_KEY = 'selectedRealmId'
const CACHE_TTL_MS = 5 * 60 * 1000
let companiesCache = {
  companies: [],
  fetchedAt: 0
}
let inFlightPromise = null

export default function useConnectedCompanies() {
  const [companies, setCompanies] = useState([])
  const [selectedRealmId, setSelectedRealmId] = useState(() => localStorage.getItem(STORAGE_KEY) || '')
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const hasLoadedRef = useRef(false)

  const updateSelectedRealmId = useCallback((realmId) => {
    setSelectedRealmId(realmId)
    if (realmId) {
      localStorage.setItem(STORAGE_KEY, realmId)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const fetchCompanies = useCallback(async () => {
    const now = Date.now()
    if (companiesCache.companies.length > 0 && now - companiesCache.fetchedAt < CACHE_TTL_MS) {
      setCompanies(companiesCache.companies)
      setLoadingCompanies(false)
      hasLoadedRef.current = true
      return
    }

    if (inFlightPromise) {
      setLoadingCompanies(true)
      try {
        const nextCompanies = await inFlightPromise
        setCompanies(nextCompanies)
      } finally {
        setLoadingCompanies(false)
        hasLoadedRef.current = true
      }
      return
    }

    setLoadingCompanies(true)
    inFlightPromise = (async () => {
      const res = await api.get('/quickbooks/companies')
      const nextCompanies = res.data.data || []
      companiesCache = { companies: nextCompanies, fetchedAt: Date.now() }
      return nextCompanies
    })()

    try {
      const nextCompanies = await inFlightPromise
      setCompanies(nextCompanies)

      const currentSelected = localStorage.getItem(STORAGE_KEY) || ''
      const currentExists = nextCompanies.some((company) => company.realmId === currentSelected)
      const nextRealmId = currentExists
        ? currentSelected
        : (nextCompanies[0]?.realmId || '')

      updateSelectedRealmId(nextRealmId)
    } finally {
      inFlightPromise = null
      setLoadingCompanies(false)
      hasLoadedRef.current = true
    }
  }, [updateSelectedRealmId])

  useEffect(() => {
    if (!hasLoadedRef.current) {
      fetchCompanies()
    }
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
