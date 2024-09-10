import '../styles/footer.css';
import PlanetEarthIcon from '../images/planet-earth.svg';
import FacebookIcon from '../images/facebook.svg';
import InstagramIcon from '../images/instagram.svg';
import TwitterIcon from '../images/twitter.svg';

export default function Footer() {
    return (
        <div className="footer">
            <div className='footer-wrapper socials'>
                <img src={FacebookIcon} alt='' />
                <img src={InstagramIcon} alt='' />
                <img src={TwitterIcon} alt='' />
            </div>
            <div className='footer-wrapper'>
                <div>
                    <img src={PlanetEarthIcon} alt='' />
                    Portugal
                </div>
                <div>
                    &#169; TechNewLogic 2024
                </div>
                <div>
                    Politica de Privacidade
                </div>
            </div>
        </div>
    )
}