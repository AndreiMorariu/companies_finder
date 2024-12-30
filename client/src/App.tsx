import Dashboard from "./pages/dashboard";
import { ThemeProvider } from "./components/theme-provider";

function App() {
	return (
		<ThemeProvider defaultTheme="system">
			<Dashboard></Dashboard>
		</ThemeProvider>
	);
}

export default App;
