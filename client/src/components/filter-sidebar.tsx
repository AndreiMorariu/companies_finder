import { useState, useEffect, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterSidebarProps {
	onSearch: (filters: Record<string, string | string[]>) => void;
	initialFilters: Record<string, string | string[]>;
}

const caenOptions = ["6201", "6202", "6311", "6312", "6209", "6203"];
const judete = [
	"Timis",
	"Iasi",
	"Bucuresti",
	"Brasov",
	"Cluj",
	"Alba",
	"Bacau",
	"Valcea",
	"Dolj",
	"Suceava",
	"Mures",
	"Sibiu",
	"Ilfov",
	"Bihor",
	"Neamt",
	"Tulcea",
	"Maramures",
	"Dambovita",
	"Salaj",
	"Olt",
	"Constanta",
	"Arad",
	"Arges",
	"Braila",
	"Vaslui",
	"Hunedoara",
	"Bistrita-nasaud",
	"Satu Mare",
	"Mehedinti",
	"Buzau",
	"Galati",
	"Botosani",
	"Gorj",
	"Covasna",
	"Prahova",
	"Teleorman",
	"Harghita",
	"Giurgiu",
	"Caras-Severin",
	"Calarasi",
	"Vrancea",
	"Ialomita",
];

export function FilterSidebar({
	onSearch,
	initialFilters,
}: FilterSidebarProps) {
	const [filters, setFilters] =
		useState<Record<string, string | string[]>>(initialFilters);
	const [resetFiltersState] =
		useState<Record<string, string | string[]>>(initialFilters);

	useEffect(() => {
		setFilters(initialFilters);
	}, [initialFilters]);

	const handleInputChange = (key: string, value: string) => {
		if (
			key === "numar_mediu_de_salariati" ||
			key === "cifra_de_afaceri_neta" ||
			key === "profit_net"
		) {
			setFilters((prev) => ({
				...prev,
				[key]: value !== "" ? value : "",
			}));
		} else {
			setFilters((prev) => ({ ...prev, [key]: value }));
		}
	};

	const handleMultipleSelect = (
		key: string,
		value: string,
		isChecked: boolean
	) => {
		setFilters((prev) => {
			const currentValues = Array.isArray(prev[key])
				? (prev[key] as string[])
				: [];
			if (isChecked) {
				return { ...prev, [key]: [...currentValues, value] };
			} else {
				return { ...prev, [key]: currentValues.filter((v) => v !== value) };
			}
		});
	};

	const handleSearch = (e: FormEvent) => {
		e.preventDefault();
		onSearch(filters);
	};

	const resetFilters = () => {
		// Reset filters to the original state
		setFilters(resetFiltersState);
		onSearch(resetFiltersState);
	};

	return (
		<div className="bg-background border rounded-lg p-4">
			<form onSubmit={handleSearch}>
				<h2 className="text-lg font-semibold mb-4 p-1">Filtre</h2>
				<ScrollArea className="h-[300px] pr-4">
					<div className="space-y-4 p-1">
						<div>
							<Label htmlFor="cui" className="block pb-2">
								CUI
							</Label>
							<Input
								id="cui"
								value={filters.cui || ""}
								onChange={(e) => handleInputChange("cui", e.target.value)}
								placeholder="Filtrează după CUI"
							/>
						</div>
						<div>
							<Label className="block pb-2">CAEN</Label>
							<div className="space-y-2">
								{caenOptions.map((caen) => (
									<div key={caen} className="flex items-center">
										<Checkbox
											id={`caen-${caen}`}
											checked={
												Array.isArray(filters.caen) &&
												filters.caen.includes(caen)
											}
											onCheckedChange={(checked) =>
												handleMultipleSelect("caen", caen, checked as boolean)
											}
										/>
										<label
											htmlFor={`caen-${caen}`}
											className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											{caen}
										</label>
									</div>
								))}
							</div>
						</div>
						<div>
							<Label className="block pb-2">Județ</Label>
							<div className="space-y-2">
								{judete.map((judet) => (
									<div key={judet} className="flex items-center">
										<Checkbox
											id={`judet-${judet}`}
											checked={
												Array.isArray(filters.judet) &&
												filters.judet.includes(judet)
											}
											onCheckedChange={(checked) =>
												handleMultipleSelect("judet", judet, checked as boolean)
											}
										/>
										<label
											htmlFor={`judet-${judet}`}
											className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											{judet}
										</label>
									</div>
								))}
							</div>
						</div>
						<div>
							<Label htmlFor="denumire" className="block pb-2">
								Denumire
							</Label>
							<Input
								id="denumire"
								value={filters.denumire || ""}
								onChange={(e) => handleInputChange("denumire", e.target.value)}
								placeholder="Filtrează după denumire"
							/>
						</div>
						<div>
							<Label htmlFor="numar_mediu_de_salariati" className="block pb-2">
								Număr mediu de salariați (peste)
							</Label>
							<Input
								id="numar_mediu_de_salariati"
								type="number"
								value={filters.numar_mediu_de_salariati || ""}
								onChange={(e) =>
									handleInputChange("numar_mediu_de_salariati", e.target.value)
								}
								placeholder="Filtrează după număr de salariați"
							/>
						</div>
						<div>
							<Label htmlFor="cifra_de_afaceri_neta" className="block pb-2">
								Cifra de afaceri netă (RON)
							</Label>
							<Input
								id="cifra_de_afaceri_neta"
								type="number"
								value={filters.cifra_de_afaceri_neta || ""}
								onChange={(e) =>
									handleInputChange("cifra_de_afaceri_neta", e.target.value)
								}
								placeholder="Filtrează după cifra de afaceri"
							/>
						</div>
						<div>
							<Label htmlFor="profit_net" className="block pb-2">
								Profit net (RON)
							</Label>
							<Input
								id="profit_net"
								type="number"
								value={filters.profit_net || ""}
								onChange={(e) =>
									handleInputChange("profit_net", e.target.value)
								}
								placeholder="Filtrează după profit net"
							/>
						</div>
					</div>
				</ScrollArea>
				<div className="flex gap-2 mt-4">
					<Button className="flex-1" type="submit">
						Caută
					</Button>
					<Button
						className="flex-1"
						type="button"
						variant="outline"
						onClick={resetFilters}
					>
						Resetează
					</Button>
				</div>
			</form>
		</div>
	);
}
