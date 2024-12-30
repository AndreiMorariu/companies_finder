import { useState, useEffect, useCallback, useMemo } from "react";
import { Company, PaginatedResponse } from "@/types/company";
import { getCompanies } from "@/services/companies.service";

export function useCompanies(initialLimit: number = 10) {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [allCompanies, setAllCompanies] = useState<Company[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState<
		PaginatedResponse<Company>["pagination"] | null
	>(null);
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(initialLimit);
	const [filters, setFilters] = useState<Record<string, string | string[]>>({});

	const fetchAllCompanies = useCallback(async () => {
		try {
			const response = await getCompanies({ limit: "1000000" });
			setAllCompanies(response.data);
		} catch (err) {
			setError("Failed to fetch all companies");
		}
	}, []);

	useEffect(() => {
		fetchAllCompanies();
	}, [fetchAllCompanies]);

	const filteredCompanies = useMemo(() => {
		return allCompanies.filter((company) => {
			return Object.entries(filters).every(([key, value]) => {
				if (!value || (Array.isArray(value) && value.length === 0)) return true;

				const companyValue = company[key as keyof Company];

				if (typeof companyValue === "number" && typeof value === "string") {
					const numericValue = parseFloat(value);
					if (!isNaN(numericValue)) {
						if (key === "numar_mediu_de_salariati") {
							return companyValue > numericValue;
						}
						// Add more numeric comparisons here if needed
						return companyValue === numericValue;
					}
				}

				if (Array.isArray(value)) {
					return value.some((v) =>
						String(companyValue).toLowerCase().includes(v.toLowerCase())
					);
				}

				return String(companyValue)
					.toLowerCase()
					.includes(String(value).toLowerCase());
			});
		});
	}, [allCompanies, filters]);

	const paginatedCompanies = useMemo(() => {
		const start = offset;
		const end = offset + limit;
		return filteredCompanies.slice(start, end);
	}, [filteredCompanies, offset, limit]);

	useEffect(() => {
		setCompanies(paginatedCompanies);
		setPagination({
			currentPage: Math.floor(offset / limit) + 1,
			itemsPerPage: limit,
			totalItems: filteredCompanies.length,
			totalPages: Math.ceil(filteredCompanies.length / limit),
		});
		setIsLoading(false);
	}, [paginatedCompanies, offset, limit, filteredCompanies]);

	const nextPage = useCallback(() => {
		if (offset + limit < filteredCompanies.length) {
			setOffset((prevOffset) => prevOffset + limit);
		}
	}, [filteredCompanies.length, limit, offset]);

	const previousPage = useCallback(() => {
		setOffset((prevOffset) => Math.max(0, prevOffset - limit));
	}, [limit]);

	const goToPage = useCallback(
		(page: number) => {
			const newOffset = (page - 1) * limit;
			if (newOffset >= 0 && newOffset < filteredCompanies.length) {
				setOffset(newOffset);
			}
		},
		[filteredCompanies.length, limit]
	);

	const changeLimit = useCallback((newLimit: number) => {
		setLimit(newLimit);
		setOffset(0);
	}, []);

	const changeFilters = useCallback(
		(newFilters: Record<string, string | string[]>) => {
			setFilters(newFilters);
			setOffset(0);
		},
		[]
	);

	const currentPage = Math.floor(offset / limit) + 1;
	const totalPages = Math.ceil(filteredCompanies.length / limit);

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
	};
}
