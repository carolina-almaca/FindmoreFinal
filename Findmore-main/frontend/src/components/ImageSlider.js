import { Carousel } from 'react-bootstrap';
import '../styles/imageSlider.css';

const ImageSlider = ({ images }) => {
  return (
    <Carousel>
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100 slider-img"
            src={image}
            alt={`Slide ${index}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ImageSlider;