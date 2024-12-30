export interface Company {
	cui: string;
	caen: string;
	active_imobilizate: number | null;
	active_circulante: number | null;
	stocuri: number | null;
	creante: number | null;
	casa_si_conturi_la_banci: number | null;
	cheltuieli_in_avans: number | null;
	datorii: number | null;
	venituri_in_avans: number | null;
	provizioane: number | null;
	capitaluri: number | null;
	capital_subcris_varsat: number | null;
	patrimoniul_regiei: number | null;
	cifra_de_afaceri_neta: number | null;
	venituri_totale: number | null;
	cheltuieli_totale: number | null;
	profit_brut: number | null;
	pierdere_bruta: number | null;
	profit_net: number | null;
	pierdere_neta: number | null;
	numar_mediu_de_salariati: number | null;
	denumire: string;
	telefon: string;
	judet: string;
}

export interface PaginatedResponse<T> {
	status: string;
	data: T[];
	pagination: {
		currentPage: number;
		itemsPerPage: number;
		totalItems: number;
		totalPages: number;
	};
}
