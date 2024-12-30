import { useState } from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "./mode-toggle";
import { Company } from "@/types/company";
import { useCompanies } from "@/hooks/use-companies";
import { FilterSidebar } from "@/components/filter-sidebar";
import { CompanyStatistics } from "@/components/company-statistics";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<Company>[] = [
	{ accessorKey: "cui", header: "CUI", enableSorting: true },
	{ accessorKey: "caen", header: "CAEN", enableSorting: true },
	{ accessorKey: "denumire", header: "Denumire", enableSorting: true },
	{ accessorKey: "judet", header: "Județ", enableSorting: true },
	{
		accessorKey: "numar_mediu_de_salariati",
		header: "Număr Mediu de Salariați",
		enableSorting: true,
	},
	{
		accessorKey: "active_imobilizate",
		header: "Active Imobilizate",
		enableSorting: true,
	},
	{
		accessorKey: "active_circulante",
		header: "Active Circulante",
		enableSorting: true,
	},
	{ accessorKey: "stocuri", header: "Stocuri", enableSorting: true },
	{ accessorKey: "creante", header: "Creanțe", enableSorting: true },
	{
		accessorKey: "casa_si_conturi_la_banci",
		header: "Casa și Conturi la Bănci",
		enableSorting: true,
	},
	{
		accessorKey: "cheltuieli_in_avans",
		header: "Cheltuieli în Avans",
		enableSorting: true,
	},
	{ accessorKey: "datorii", header: "Datorii", enableSorting: true },
	{
		accessorKey: "venituri_in_avans",
		header: "Venituri în Avans",
		enableSorting: true,
	},
	{ accessorKey: "provizioane", header: "Provizioane", enableSorting: true },
	{ accessorKey: "capitaluri", header: "Capitaluri", enableSorting: true },
	{
		accessorKey: "capital_subcris_varsat",
		header: "Capital Subscris Vărsat",
		enableSorting: true,
	},
	{
		accessorKey: "patrimoniul_regiei",
		header: "Patrimoniul Regiei",
		enableSorting: true,
	},
	{
		accessorKey: "cifra_de_afaceri_neta",
		header: "Cifra de Afaceri Netă",
		enableSorting: true,
	},
	{
		accessorKey: "venituri_totale",
		header: "Venituri Totale",
		enableSorting: true,
	},
	{
		accessorKey: "cheltuieli_totale",
		header: "Cheltuieli Totale",
		enableSorting: true,
	},
	{ accessorKey: "profit_brut", header: "Profit Brut", enableSorting: true },
	{
		accessorKey: "pierdere_bruta",
		header: "Pierdere Brută",
		enableSorting: true,
	},
	{ accessorKey: "profit_net", header: "Profit Net", enableSorting: true },
	{
		accessorKey: "pierdere_neta",
		header: "Pierdere Netă",
		enableSorting: true,
	},

	{ accessorKey: "telefon", header: "Telefon", enableSorting: true },
].map((column) => ({
	...column,
	header: ({ column }) => {
		return (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				{column.id}
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		);
	},
}));

export function CompaniesDataTable() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		active_imobilizate: false,
		active_circulante: false,
		stocuri: false,
		creante: false,
		casa_si_conturi_la_banci: false,
		cheltuieli_in_avans: false,
		datorii: false,
		venituri_in_avans: false,
		provizioane: false,
		capitaluri: false,
		capital_subcris_varsat: false,
		patrimoniul_regiei: false,
		telefon: false,
	});
	const [rowSelection, setRowSelection] = useState({});
	const [pageSize, setPageSize] = useState(10);
	const [filters, setFilters] = useState<Record<string, string | string[]>>({});

	const {
		companies,
		allCompanies,
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
	} = useCompanies(pageSize);

	const table = useReactTable({
		data: companies,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination: {
				pageIndex: currentPage - 1,
				pageSize,
			},
		},
		manualPagination: true,
		pageCount: totalPages,
	});

	const handlePageChange = (page: number) => {
		goToPage(page);
	};

	const handleLimitChange = (newLimit: number) => {
		setPageSize(newLimit);
		changeLimit(newLimit);
	};

	const handleSearch = (newFilters: Record<string, string | string[]>) => {
		setFilters(newFilters);
		changeFilters(newFilters);
	};

	if (error) return <div>Eroare: {error}</div>;

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex-grow">
				<div className="flex items-center justify-between py-4">
					<div className="flex items-center space-x-2">
						<Select
							value={pageSize.toString()}
							onValueChange={(value) => handleLimitChange(Number(value))}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Selectează numărul de rânduri" />
							</SelectTrigger>
							<SelectContent>
								{[10, 20, 30, 40, 50].map((size) => (
									<SelectItem key={size} value={size.toString()}>
										Afișează {size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">Coloane</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<ModeToggle />
				</div>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{isLoading ? (
								Array.from({ length: pageSize }).map((_, index) => (
									<TableRow key={index}>
										{table.getVisibleFlatColumns().map((column) => (
											<TableCell key={column.id}>
												<Skeleton className="h-4 w-full" />
											</TableCell>
										))}
									</TableRow>
								))
							) : table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										Nu există rezultate.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-between space-x-2 py-4">
					<div className="flex-1 text-sm text-muted-foreground">
						{`Afișare ${
							pagination?.currentPage
								? (pagination.currentPage - 1) * pagination.itemsPerPage + 1
								: 0
						} - ${Math.min(
							pagination?.currentPage
								? pagination.currentPage * pagination.itemsPerPage
								: 0,
							pagination?.totalItems || 0
						)} din ${pagination?.totalItems || 0} companii`}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={previousPage}
							disabled={currentPage <= 1}
						>
							Anterior
						</Button>
						<Input
							className="w-16"
							type="number"
							min={1}
							max={totalPages}
							value={currentPage}
							onChange={(e) => {
								const page = e.target.value ? Number(e.target.value) : 1;
								handlePageChange(page);
							}}
						/>
						<span>din {totalPages}</span>
						<Button
							variant="outline"
							size="sm"
							onClick={nextPage}
							disabled={currentPage >= totalPages}
						>
							Următor
						</Button>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-4 gap-4 items-start">
				<FilterSidebar onSearch={handleSearch} initialFilters={filters} />
				<CompanyStatistics companies={companies} allCompanies={allCompanies} />
			</div>
		</div>
	);
}
