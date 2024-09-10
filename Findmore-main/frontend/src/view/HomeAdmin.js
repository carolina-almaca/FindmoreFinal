import "../styles/navbar.css";
import "../styles/homeAdmin.css";
import Footer from "../components/Footer";
import AdminNavbar from "../components/AdminNavbar";
import AdminDashboard from "../components/admin/AdminDashboard";

export default function HomeAdmin({ onLogout }) {
	return (
		<main>
			<AdminNavbar onLogout={onLogout} />
			<div className='container-wrapper'>
				<AdminDashboard />
			</div>
			<Footer />
		</main>
	);
}
