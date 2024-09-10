import '../../styles/adminPages.css';
import AdminDashboardComprasRecentes from './AdminDashboardComprasRecentes';
import AdminDashboardEstatisticasGerais from './AdminDashboardEstatisticasGerais';
import AdminGraficos from './AdminGraficos';

export default function AdminDashboard() {
    return (
        <div className="admin-pages-container">
            <AdminDashboardEstatisticasGerais />
            <AdminGraficos />
            <AdminDashboardComprasRecentes />
        </div>
    )
}