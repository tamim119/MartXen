import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.lp-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 0 24px;
    margin: 80px auto;
    max-width: 1280px;
    animation: lp-fadeUp 0.65s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes lp-fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
}

.lp-grid {
    margin-top: 32px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}
.lp-item {
    animation: lp-fadeUp 0.45s cubic-bezier(0.4,0,0.2,1) both;
}
.lp-item:nth-child(1) { animation-delay: 0.08s; }
.lp-item:nth-child(2) { animation-delay: 0.14s; }
.lp-item:nth-child(3) { animation-delay: 0.20s; }
.lp-item:nth-child(4) { animation-delay: 0.26s; }
.lp-item:nth-child(5) { animation-delay: 0.32s; }
.lp-item:nth-child(6) { animation-delay: 0.38s; }
.lp-item:nth-child(7) { animation-delay: 0.44s; }
.lp-item:nth-child(8)  { animation-delay: 0.50s; }
.lp-item:nth-child(9)  { animation-delay: 0.56s; }
.lp-item:nth-child(10) { animation-delay: 0.62s; }
.lp-item:nth-child(11) { animation-delay: 0.68s; }
.lp-item:nth-child(12) { animation-delay: 0.74s; }

@media (max-width: 1024px) {
    .lp-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; }
}
@media (max-width: 768px) {
    .lp-root { padding: 0 18px; margin: 56px auto; }
    .lp-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 24px; }
}
@media (max-width: 480px) {
    .lp-root { padding: 0 12px; margin: 40px auto; }
    .lp-grid { gap: 10px; }
}
`;

const LatestProducts = () => {
    const displayQuantity = 12;
    const products = useSelector(state => state.product.items);

    const latestProducts = [...products]
        .sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return dateB - dateA;
        })
        .slice(0, displayQuantity);

    return (
        <>
            <style>{CSS}</style>
            <div className='lp-root'>
                <Title
                    title='Latest Products'
                    description={`Showing ${latestProducts.length} of ${products.length} products`}
                    href='/shop'
                />
                <div className='lp-grid'>
                    {latestProducts.map((product, index) => (
                        <div key={product.id} className='lp-item' style={{ animationDelay: `${0.08 + index * 0.06}s` }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default LatestProducts;