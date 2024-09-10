import { useState } from "react";
import Navbar from "../components/Navbar";
import Login from "./Login";
import ImageSlider from "../components/ImageSlider";
import Image1 from '../images/slider/slider-1.png';
import Image2 from '../images/slider/slider-2.jpg';
import Image3 from '../images/slider/slider-3.jpg';
import MonitorTableImage from '../images/monitor-tablet-and-smartohone.svg';
import CustomerSupportImage from '../images/customer-support.svg';
import PhotoImage from '../images/foto.svg';
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Registar from "./Registar";
import { ProdutosMock } from "../utils/MockProdutos";

export default function Home({onLoginSuccess}) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegistarModal, setShowRegistarModal] = useState(false);

    const images = [
        Image1,
        Image2,
        Image3
    ];

    const onRegistarClick = () => {
        setShowLoginModal(false);
        setShowRegistarModal(true);
    }

    const onLoginClick = () => {
        setShowLoginModal(true);
        setShowRegistarModal(false);
    }
    
    return (
        <div>
            {
                showLoginModal && (
                    <Login
                        handleLoginClose={() => setShowLoginModal(false)}
                        handleRegistarClick={() => onRegistarClick()}
                        onLoginSuccess={onLoginSuccess}
                    />
                )
            }
            {
                showRegistarModal && (
                    <Registar
                        handleRegistarClose={() => setShowRegistarModal(false)}
                        handleRegistarClick={() => onRegistarClick()}
                        handleLoginClick={() => onLoginClick()}
                    />
                )
            }
            <Navbar onLoginClick={() => setShowLoginModal(true)} onRegistarClick={() => setShowRegistarModal(true)} />
            <ImageSlider images={images} />
            <div className="container-wrapper">
                <div className="services-container">
                    <div className="service">
                        <img src={MonitorTableImage} alt="" />
                        <span>Superficies Digitais</span>
                    </div>
                    <div className="service">
                        <img src={CustomerSupportImage} alt="" />
                        <span>Ferramentas</span>
                    </div>
                    <div className="service">
                        <img src={PhotoImage} alt="" />
                        <span>Fotografia</span>
                    </div>
                </div>
                <div className="products" style={{justifyContent: 'space-between'}}>
                    {
                        ProdutosMock.map((product) => {
                            return (
                                <ProductCard product={product} key={`product-${product.idProduto}`} onBtnClick={() => setShowLoginModal(true)} />
                            )
                        })
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}