import AdminGraficoTotalVendas from "./AdminGraficoTotalVendas";
import AdminProdutosPorCategoria from "./AdminProdutosPorCategoria";
import AdminTopDeVendas from "./AdminTopDeVendas";

export default function AdminGraficos() {
    return (
        <section className="admin-graficos-wrapper">
            <div className="admin-graficos-col-1">
                <AdminGraficoTotalVendas />
            </div>
            <div className="admin-graficos-col-2">
                <AdminTopDeVendas />
                <AdminProdutosPorCategoria />
            </div>
        </section>
    )
}