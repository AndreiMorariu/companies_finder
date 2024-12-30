import { Suspense } from "react";
import { CompaniesDataTable } from "@/components/companies-data-table";
import { DashboardShell } from "@/components/dashboard-shell";

export default function Dashboard() {
	return (
		<DashboardShell>
			<Suspense fallback={<div>Loading...</div>}>
				<CompaniesDataTable />
			</Suspense>
		</DashboardShell>
	);
}
