import type { Company, PaginatedResponse } from "@/types/company"

const API_BASE_URL = "http://localhost:8080/api"

export async function getCompanies(params: URLSearchParams): Promise<PaginatedResponse<Company>> {
  const response = await fetch(`${API_BASE_URL}/companies?${params}`)
  if (!response.ok) {
    throw new Error("Failed to fetch companies")
  }
  const data = await response.json()
  return {
    status: data.status,
    data: data.data.companies,
    pagination: data.pagination,
  }
}

export async function getCompanyByCui(cui: string): Promise<Company> {
  const response = await fetch(`${API_BASE_URL}/companies/${cui}`)
  if (!response.ok) {
    throw new Error("Failed to fetch company")
  }
  const data = await response.json()
  return data.data
}

export async function getCompaniesStatistics(params: URLSearchParams): Promise<{
  companii: number
  cifra_de_afaceri_neta_totala: number
  profit_net_total: number
  numar_mediu_de_salariati_total: number
}> {
  const response = await fetch(`${API_BASE_URL}/statistics?${params}`)
  if (!response.ok) {
    throw new Error("Failed to fetch statistics")
  }
  const data = await response.json()
  return data.data.statistics
}

