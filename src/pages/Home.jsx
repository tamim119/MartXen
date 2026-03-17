import BestSelling from "../components/BestSelling";
import Hero from "../components/Hero";
import LatestProducts from "../components/LatestProducts";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../lib/features/product/productSlice";

export default function Home() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div>
            <Hero />
            <LatestProducts />
            <BestSelling />
        </div>
    );
}