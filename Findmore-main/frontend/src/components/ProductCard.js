import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function ProductCard(props) {
	const { product, onBtnClick, showPrice, hideBtn } = props;

	return (
		<Card
			className={`product-card${
				product.categoria ? ` product-card-${product.categoria}` : ""
			}`}
		>
			<Card.Img variant='top' src={product.imagem} />
			<Card.Body>
				<Card.Title className="product-card-title">{product.nomeP}</Card.Title>
				<Card.Subtitle className="product-card-subtitle">{product.miniDescricao}</Card.Subtitle>
				<Card.Text className="product-card-text">{product.descricao}</Card.Text>
			</Card.Body>
      {
        !hideBtn && (
          <Card.Footer>
          <Button variant='primary' size='lg' onClick={onBtnClick}>
            {showPrice
              ? `${
                  product.preco > 0
                    ? `${product.preco.toFixed(2)}€`
                    : "Grátis"
                }`
              : "Saber mais"}
          </Button>
        </Card.Footer>
        )
      }
		</Card>
	);
}

export default ProductCard;
