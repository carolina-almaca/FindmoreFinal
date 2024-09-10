import ProductImage1 from "../images/product-1.png";
import ProductImage2 from "../images/product-2.png";
import ProductImage3 from "../images/product-3.png";

export const ProdutosMock = [
    {
        idProduto: 1,
        idUtilizador: 1,
        imagem: ProductImage1,
        nomeP: "Turbo 100",
        miniDescricao: "Alta eficiencia",
        descricao: "Software que transforma computadores em máquinas de alta velocidade",
        preco: 29.90,
        categoria: 'fotografia',
        licenca: 'Vitalicia',
        quantidade: 0,
    },
    {
        idProduto: 2,
        idUtilizador: 2,
        imagem: ProductImage2,
        nomeP: "Snap Sync",
        miniDescricao: "Backup automatico para tranquilidade total",
        descricao: "Sincronize automaticamente as suas fotos em todos os seus dispositivos para acesso fácil e atualizado.",
        preco: 39.90,
        categoria: 'ferramenta',
        licenca: 'Vitalicia',
        quantidade: 0,
    },
    {
        idProduto: 3,
        idUtilizador: 2,
        imagem: ProductImage3,
        nomeP: "Innovate Kie",
        miniDescricao: "Transforme ideias em realidade",
        descricao: "Plataforma colaborativa para desenvolvimento e compartilhamento de ideias inovadoras e projetos.",
        preco: 0,
        categoria: 'performance',
        licenca: 'Grátis',
        quantidade: 0,
    },
];
