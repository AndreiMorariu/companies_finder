import { Company, PaginatedResponse } from "@/types/company";

const API_BASE_URL = "http://localhost:8080/api";

export async function getCompanies(
	params: Record<string, string>
): Promise<PaginatedResponse<Company>> {
	const queryString = new URLSearchParams(params).toString().toLowerCase();

	const response = await fetch(`${API_BASE_URL}/companies?${queryString}`);

	if (!response.ok) throw new Error("Failed to fetch companies");

	const data = await response.json();

	return {
		status: data.status,
		data: data.data.companies,
		pagination: data.pagination,
	};
}

export async function getCompanyByCui(cui: string): Promise<Company> {
	const response = await fetch(`${API_BASE_URL}/companies/${cui}`);

	if (!response.ok) throw new Error("Failed to fetch company");

	const data = await response.json();
	return data.data;
}
