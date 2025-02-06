import { useMemo } from "react";
import type { Company } from "@/types/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Building2,
	Users,
	UserPlus,
	DollarSign,
	TrendingUp,
	PiggyBank,
} from "lucide-react";
import type React from "react";

interface CompanyStatisticsProps {
	companies: Company[];
	statistics: {
		companii: number;
		cifra_de_afaceri_neta_totala: number;
		profit_net_total: number;
		numar_mediu_de_salariati_total: number;
	} | null;
	isLoading: boolean;
}

function StatCard({
	title,
	value,
	icon: Icon,
	subValue,
	isLoading,
}: {
	title: string;
	value: string;
	icon: React.ElementType;
	subValue?: string;
	isLoading: boolean;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<>
						<Skeleton className="h-6 w-3/4 mb-2" />
						<Skeleton className="h-4 w-1/2" />
					</>
				) : (
					<>
						<div className="text-2xl font-bold">{value}</div>
						{subValue && (
							<p className="text-xs text-muted-foreground">{subValue}</p>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}

export function CompanyStatistics({
	companies,
	statistics,
	isLoading,
}: CompanyStatisticsProps) {
	const currentPageStats = useMemo(() => {
		const totalCompanies = companies.length;
		const totalEmployees = companies.reduce(
			(sum, company) => sum + (company.numar_mediu_de_salariati || 0),
			0
		);
		const totalRevenue = companies.reduce(
			(sum, company) => sum + (company.cifra_de_afaceri_neta || 0),
			0
		);
		const totalProfit = companies.reduce(
			(sum, company) => sum + (company.profit_net || 0),
			0
		);

		return {
			totalCompanies,
			totalEmployees,
			averageEmployees: totalCompanies
				? Math.round(totalEmployees / totalCompanies)
				: 0,
			totalRevenue,
			averageRevenue: totalCompanies
				? Math.round(totalRevenue / totalCompanies)
				: 0,
			totalProfit,
			averageProfit: totalCompanies
				? Math.round(totalProfit / totalCompanies)
				: 0,
		};
	}, [companies]);

	const topPerformers = useMemo(() => {
		if (companies.length === 0) return null;

		const topEmployees = companies.reduce((max, company) =>
			(company.numar_mediu_de_salariati || 0) >
			(max.numar_mediu_de_salariati || 0)
				? company
				: max
		);

		const topRevenue = companies.reduce((max, company) =>
			(company.cifra_de_afaceri_neta || 0) > (max.cifra_de_afaceri_neta || 0)
				? company
				: max
		);

		const topProfit = companies.reduce((max, company) =>
			(company.profit_net || 0) > (max.profit_net || 0) ? company : max
		);

		return { topEmployees, topRevenue, topProfit };
	}, [companies]);

	return (
		<div className="space-y-4 col-span-3">
			<h2 className="text-2xl font-bold tracking-tight">
				Statistici Companii (pagina curentă)
			</h2>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Companii"
					value={currentPageStats.totalCompanies.toString()}
					icon={Building2}
					subValue={`Din ${statistics?.companii || 0} total`}
					isLoading={isLoading}
				/>
				<StatCard
					title="Total Angajați"
					value={currentPageStats.totalEmployees.toLocaleString()}
					icon={Users}
					subValue={`Medie: ${currentPageStats.averageEmployees}`}
					isLoading={isLoading}
				/>
				<StatCard
					title="Cifră de Afaceri Totală"
					value={`${(currentPageStats.totalRevenue / 1000000).toFixed(2)}M RON`}
					icon={DollarSign}
					subValue={`Medie: ${(
						currentPageStats.averageRevenue / 1000000
					).toFixed(2)}M RON`}
					isLoading={isLoading}
				/>
				<StatCard
					title="Profit Total"
					value={`${(currentPageStats.totalProfit / 1000000).toFixed(2)}M RON`}
					icon={TrendingUp}
					subValue={`Medie: ${(
						currentPageStats.averageProfit / 1000000
					).toFixed(2)}M RON`}
					isLoading={isLoading}
				/>
			</div>
			<div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Comparație cu Toate Companiile</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Procent Companii:</span>
							<span className="text-sm font-bold">
								{statistics
									? (
											(currentPageStats.totalCompanies / statistics.companii) *
											100
									  ).toFixed(2)
									: 0}
								%
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Procent Angajați:</span>
							<span className="text-sm font-bold">
								{statistics
									? (
											(currentPageStats.totalEmployees /
												statistics.numar_mediu_de_salariati_total) *
											100
									  ).toFixed(2)
									: 0}
								%
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">
								Procent Cifră de Afaceri:
							</span>
							<span className="text-sm font-bold">
								{statistics
									? (
											(currentPageStats.totalRevenue /
												statistics.cifra_de_afaceri_neta_totala) *
											100
									  ).toFixed(2)
									: 0}
								%
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Procent Profit:</span>
							<span className="text-sm font-bold">
								{statistics
									? (
											(currentPageStats.totalProfit /
												statistics.profit_net_total) *
											100
									  ).toFixed(2)
									: 0}
								%
							</span>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Top Performeri (Pagina Curentă)</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="flex items-center space-x-2">
							<UserPlus className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium">
								Cei mai mulți angajați:
							</span>
							<span className="text-sm font-bold">
								{topPerformers?.topEmployees
									? `${topPerformers.topEmployees.numar_mediu_de_salariati} (${topPerformers.topEmployees.denumire})`
									: "N/A"}
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<DollarSign className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium">
								Cea mai mare cifră de afaceri:
							</span>
							<span className="text-sm font-bold">
								{topPerformers?.topRevenue
									? `${(
											(topPerformers.topRevenue.cifra_de_afaceri_neta ?? 0) /
											1000000
									  ).toFixed(2)}M RON (${topPerformers.topRevenue.denumire})`
									: "N/A"}
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<PiggyBank className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium">Cel mai mare profit:</span>
							<span className="text-sm font-bold">
								{topPerformers?.topProfit
									? `${(
											(topPerformers.topProfit.profit_net ?? 0) / 1000000
									  ).toFixed(2)}M RON (${topPerformers.topProfit.denumire})`
									: "N/A"}
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>
						Comparație cu Toate Companiile (Cu Filtrele Aplicate)
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="flex items-center space-x-2">
						<UserPlus className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Angajati totali:</span>
						<span className="text-sm font-bold">
							{statistics
								? `${statistics.numar_mediu_de_salariati_total}`
								: "N/A"}
						</span>
					</div>
					<div className="flex items-center space-x-2">
						<DollarSign className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">
							Cifra de afaceri totala:
						</span>
						<span className="text-sm font-bold">
							{statistics
								? `${(
										statistics.cifra_de_afaceri_neta_totala / 1000000
								  ).toFixed(2)}M RON (Total)`
								: "N/A"}
						</span>
					</div>
					<div className="flex items-center space-x-2">
						<PiggyBank className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Profit net total:</span>
						<span className="text-sm font-bold">
							{statistics
								? `${(statistics.profit_net_total / 1000000).toFixed(
										2
								  )}M RON (Total)`
								: "N/A"}
						</span>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Informații despre Toate Companiile</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Total Companii:</span>
						<span className="text-sm font-bold">38863</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Total Angajați:</span>
						<span className="text-sm font-bold">153,566</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">
							Medie Angajați per Companie:
						</span>
						<span className="text-sm font-bold">4</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">
							Cifră de Afaceri Totală:
						</span>
						<span className="text-sm font-bold">62144.03M RON</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Medie Cifră de Afaceri:</span>
						<span className="text-sm font-bold">1.60M RON</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Profit Total:</span>
						<span className="text-sm font-bold">10637.17M RON</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Medie Profit:</span>
						<span className="text-sm font-bold">0.27M RON</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
