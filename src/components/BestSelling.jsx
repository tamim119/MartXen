import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.bs-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 0 24px;
    margin: 80px auto;
    max-width: 1280px;
    animation: bs-fadeUp 0.65s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes bs-fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
}
.bs-grid {
    margin-top: 32px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}
.bs-item {
    animation: bs-fadeUp 0.45s cubic-bezier(0.4,0,0.2,1) both;
}
@media (max-width: 1024px) {
    .bs-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
}
@media (max-width: 768px) {
    .bs-root { padding: 0 18px; margin: 56px auto; }
    .bs-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 24px; }
}
@media (max-width: 480px) {
    .bs-root { padding: 0 12px; margin: 40px auto; }
    .bs-grid { gap: 10px; }
}
`;

const BestSelling = () => {
    const products = useSelector(state => state.product.items);

    // ✅ শুধু bestSelling: true products
    const bestSellingProducts = products.filter(p => p.bestSelling === true);

    // ✅ কোনো best selling product না থাকলে section টাই দেখাবে না
    if (bestSellingProducts.length === 0) return null;

    return (
        <>
            <style>{CSS}</style>
            <div className='bs-root'>
                <Title
                    title='Best Selling'
                    description={`Showing ${bestSellingProducts.length} products`}
                    href='/shop'
                />
                <div className='bs-grid'>
                    {bestSellingProducts.map((product, index) => (
                        <div
                            key={product.id || index}
                            className='bs-item'
                            style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BestSelling;