import { useMemo } from "react";
import { Company } from "@/types/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Building2,
	Users,
	UserPlus,
	DollarSign,
	TrendingUp,
	PiggyBank,
	ArrowUp,
} from "lucide-react";

interface CompanyStatisticsProps {
	companies: Company[];
	allCompanies: Company[];
}

function calculateStatistics(companies: Company[]) {
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
}

function StatCard({
	title,
	value,
	icon: Icon,
	subValue,
}: {
	title: string;
	value: string;
	icon: React.ElementType;
	subValue?: string;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				{subValue && (
					<p className="text-xs text-muted-foreground">{subValue}</p>
				)}
			</CardContent>
		</Card>
	);
}

export function CompanyStatistics({
	companies,
	allCompanies,
}: CompanyStatisticsProps) {
	const currentPageStats = useMemo(
		() => calculateStatistics(companies),
		[companies]
	);
	const allCompaniesStats = useMemo(
		() => calculateStatistics(allCompanies),
		[allCompanies]
	);

	const topEmployees = useMemo(() => {
		return companies.length > 0
			? companies.reduce(
					(max, company) =>
						(company.numar_mediu_de_salariati || 0) >
						(max.numar_mediu_de_salariati || 0)
							? company
							: max,
					companies[0]
			  )
			: null;
	}, [companies]);

	const topRevenue = useMemo(() => {
		return companies.length > 0
			? companies.reduce(
					(max, company) =>
						(company.cifra_de_afaceri_neta || 0) >
						(max.cifra_de_afaceri_neta || 0)
							? company
							: max,
					companies[0]
			  )
			: null;
	}, [companies]);

	const topProfit = useMemo(() => {
		return companies.length > 0
			? companies.reduce(
					(max, company) =>
						(company.profit_net || 0) > (max.profit_net || 0) ? company : max,
					companies[0]
			  )
			: null;
	}, [companies]);

	if (companies.length === 0) {
		return (
			<div className="space-y-4">
				<h2 className="text-2xl font-bold tracking-tight">
					Statistici Companii
				</h2>
				<p>Nu există date disponibile pentru companiile selectate.</p>
			</div>
		);
	}

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
					subValue={`Din ${allCompaniesStats.totalCompanies} total`}
				/>
				<StatCard
					title="Total Angajați"
					value={currentPageStats.totalEmployees.toLocaleString()}
					icon={Users}
					subValue={`Medie: ${currentPageStats.averageEmployees}`}
				/>
				<StatCard
					title="Cifră de Afaceri Totală"
					value={`${(currentPageStats.totalRevenue / 1000000).toFixed(2)}M RON`}
					icon={DollarSign}
					subValue={`Medie: ${(
						currentPageStats.averageRevenue / 1000000
					).toFixed(2)}M RON`}
				/>
				<StatCard
					title="Profit Total"
					value={`${(currentPageStats.totalProfit / 1000000).toFixed(2)}M RON`}
					icon={TrendingUp}
					subValue={`Medie: ${(
						currentPageStats.averageProfit / 1000000
					).toFixed(2)}M RON`}
				/>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Comparație cu Toate Companiile</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Procent Companii:</span>
							<span className="text-sm font-bold">
								{(
									(currentPageStats.totalCompanies /
										allCompaniesStats.totalCompanies) *
									100
								).toFixed(2)}
								%
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Procent Angajați:</span>
							<span className="text-sm font-bold">
								{(
									(currentPageStats.totalEmployees /
										allCompaniesStats.totalEmployees) *
									100
								).toFixed(2)}
								%
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">
								Procent Cifră de Afaceri:
							</span>
							<span className="text-sm font-bold">
								{(
									(currentPageStats.totalRevenue /
										allCompaniesStats.totalRevenue) *
									100
								).toFixed(2)}
								%
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Procent Profit:</span>
							<span className="text-sm font-bold">
								{(
									(currentPageStats.totalProfit /
										allCompaniesStats.totalProfit) *
									100
								).toFixed(2)}
								%
							</span>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Top Performeri</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="flex items-center space-x-2">
							<UserPlus className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium">
								Cei mai mulți angajați:
							</span>
							<span className="text-sm font-bold">
								{topEmployees
									? `${topEmployees.numar_mediu_de_salariati} (${topEmployees.denumire})`
									: "N/A"}
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<DollarSign className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium">
								Cea mai mare cifră de afaceri:
							</span>
							<span className="text-sm font-bold">
								{topRevenue
									? `${(
											(topRevenue.cifra_de_afaceri_neta ?? 0) / 1000000
									  ).toFixed(2)}M RON (${topRevenue.denumire})`
									: "N/A"}
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<PiggyBank className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium">Cel mai mare profit:</span>
							<span className="text-sm font-bold">
								{topProfit
									? `${((topProfit.profit_net ?? 0) / 1000000).toFixed(
											2
									  )}M RON (${topProfit.denumire})`
									: "N/A"}
							</span>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Creștere față de Anul Trecut</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Angajați:</span>
							<div className="flex items-center">
								<ArrowUp className="h-4 w-4 text-green-500 mr-1" />
								<span className="text-sm font-bold text-green-500">5.2%</span>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Cifră de Afaceri:</span>
							<div className="flex items-center">
								<ArrowUp className="h-4 w-4 text-green-500 mr-1" />
								<span className="text-sm font-bold text-green-500">7.8%</span>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Profit:</span>
							<div className="flex items-center">
								<ArrowUp className="h-4 w-4 text-green-500 mr-1" />
								<span className="text-sm font-bold text-green-500">3.5%</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Informații despre Toate Companiile</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Total Companii:</span>
						<span className="text-sm font-bold">
							{allCompaniesStats.totalCompanies}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Total Angajați:</span>
						<span className="text-sm font-bold">
							{allCompaniesStats.totalEmployees.toLocaleString()}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">
							Medie Angajați per Companie:
						</span>
						<span className="text-sm font-bold">
							{allCompaniesStats.averageEmployees}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">
							Cifră de Afaceri Totală:
						</span>
						<span className="text-sm font-bold">
							{(allCompaniesStats.totalRevenue / 1000000).toFixed(2)}M RON
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Medie Cifră de Afaceri:</span>
						<span className="text-sm font-bold">
							{(allCompaniesStats.averageRevenue / 1000000).toFixed(2)}M RON
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Profit Total:</span>
						<span className="text-sm font-bold">
							{(allCompaniesStats.totalProfit / 1000000).toFixed(2)}M RON
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Medie Profit:</span>
						<span className="text-sm font-bold">
							{(allCompaniesStats.averageProfit / 1000000).toFixed(2)}M RON
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
