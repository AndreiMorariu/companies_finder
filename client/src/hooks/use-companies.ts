import { useState, useEffect, useCallback } from "react"
import type { Company, PaginatedResponse } from "@/types/company"
import { getCompanies, getCompaniesStatistics } from "@/services/companies.service"

interface Statistics {
  companii: number
  cifra_de_afaceri_neta_totala: number
  profit_net_total: number
  numar_mediu_de_salariati_total: number
}

export function useCompanies(initialLimit = 10, initialFilters: Record<string, string | string[]> = {}) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginatedResponse<Company>["pagination"] | null>(null)
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(initialLimit)
  const [filters, setFilters] = useState<Record<string, string | string[]>>(initialFilters)
  const [statistics, setStatistics] = useState<Statistics | null>(null)

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
        ...filters,
      })
      const response = await getCompanies(queryParams)
      setCompanies(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError("Failed to fetch companies")
      console.error("Error fetching companies:", err)
    } finally {
      setIsLoading(false)
    }
  }, [offset, limit, filters])

  const fetchStatistics = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => queryParams.append(key, item))
        } else if (value !== undefined && value !== null) {
          queryParams.append(key, value)
        }
      })
      const stats = await getCompaniesStatistics(queryParams)
      setStatistics(stats)
    } catch (err) {
      console.error("Failed to fetch statistics:", err)
    }
  }, [filters])

  useEffect(() => {
    fetchCompanies()
    fetchStatistics()
  }, [fetchCompanies, fetchStatistics])

  const nextPage = useCallback(() => {
    if (pagination && offset + limit < pagination.totalItems) {
      setOffset((prevOffset) => prevOffset + limit)
    }
  }, [pagination, offset, limit])

  const previousPage = useCallback(() => {
    setOffset((prevOffset) => Math.max(0, prevOffset - limit))
  }, [limit])

  const goToPage = useCallback(
    (page: number) => {
      const newOffset = (page - 1) * limit
      if (pagination && newOffset >= 0 && newOffset < pagination.totalItems) {
        setOffset(newOffset)
      }
    },
    [pagination, limit],
  )

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setOffset(0)
  }, [])

  const changeFilters = useCallback((newFilters: Record<string, string | string[]>) => {
    setFilters(newFilters)
    setOffset(0)
  }, [])

  const currentPage = pagination ? Math.floor(offset / limit) + 1 : 1
  const totalPages = pagination ? Math.ceil(pagination.totalItems / limit) : 1

  return {
    companies,
    isLoading,
    error,
    pagination,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    changeLimit,
    changeFilters,
    statistics,
  }
}



