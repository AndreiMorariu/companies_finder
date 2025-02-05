import { useState, useEffect, useCallback, useMemo } from "react"
import type { Company, PaginatedResponse } from "@/types/company"
import { getCompanies } from "@/services/companies.service"

export function useCompanies(initialLimit = 10) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [allCompanies, setAllCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginatedResponse<Company>["pagination"] | null>(null)
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(initialLimit)
  const [filters, setFilters] = useState<Record<string, string | string[]>>({})

  const fetchAllCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getCompanies({ limit: "40000" });
      setAllCompanies(response.data)
    } catch (err) {
      setError("Failed to fetch all companies");
      console.error("Error fetching companies:", err);
    } finally {
      setIsLoading(false);
    }
  }, [])

  useEffect(() => {
    fetchAllCompanies()
  }, [fetchAllCompanies])

  const filteredCompanies = useMemo(() => {
    setIsLoading(true)
    const filtered = allCompanies.filter((company) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return true

        const companyValue = company[key as keyof Company]

        if (typeof companyValue === "number" && typeof value === "string") {
          const numericValue = Number.parseFloat(value)
          if (!isNaN(numericValue)) {
            if (key === "numar_mediu_de_salariati") {
              return companyValue > numericValue
            }
            return companyValue === numericValue
          }
        }

        if (Array.isArray(value)) {
          return value.some((v) => {
            const words = v.toLowerCase().split(/\s+/)
            return words.every((word) => String(companyValue).toLowerCase().includes(word))
          })
        }

        const words = String(value).toLowerCase().split(/\s+/)
        return words.every((word) => String(companyValue).toLowerCase().includes(word))
      })
    })
    setIsLoading(false)
    return filtered
  }, [allCompanies, filters])

  const paginatedCompanies = useMemo(() => {
    const start = offset
    const end = offset + limit
    return filteredCompanies.slice(start, end)
  }, [filteredCompanies, offset, limit])

  useEffect(() => {
    setCompanies(paginatedCompanies)
    setPagination({
      currentPage: Math.floor(offset / limit) + 1,
      itemsPerPage: limit,
      totalItems: filteredCompanies.length,
      totalPages: Math.ceil(filteredCompanies.length / limit),
    })
  }, [paginatedCompanies, offset, limit, filteredCompanies])

  const nextPage = useCallback(() => {
    if (offset + limit < filteredCompanies.length) {
      setOffset((prevOffset) => prevOffset + limit)
    }
  }, [filteredCompanies.length, limit, offset])

  const previousPage = useCallback(() => {
    setOffset((prevOffset) => Math.max(0, prevOffset - limit))
  }, [limit])

  const goToPage = useCallback(
    (page: number) => {
      const newOffset = (page - 1) * limit
      if (newOffset >= 0 && newOffset < filteredCompanies.length) {
        setOffset(newOffset)
      }
    },
    [filteredCompanies.length, limit],
  )

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setOffset(0)
  }, [])

  const changeFilters = useCallback((newFilters: Record<string, string | string[]>) => {
    setIsLoading(true)
    setFilters(newFilters)
    setOffset(0)
  }, [])

  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(filteredCompanies.length / limit)

  return {
    companies,
    allCompanies: filteredCompanies,
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
    refetchAllCompanies: fetchAllCompanies,
  }
}


