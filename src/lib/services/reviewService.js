import { db } from '../firebase';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  getDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

// Add review to product (Customer korbe)
export const addProductReview = async (productId, reviewData) => {
    try {
        const productRef = doc(db, 'products', productId);
        const productDoc = await getDoc(productRef);
        
        if (!productDoc.exists()) {
            throw new Error('Product not found');
        }
        
        const review = {
            userId: reviewData.userId,
            user: {
                name: reviewData.userName,
                email: reviewData.userEmail,
                image: reviewData.userImage || '/default-avatar.png'
            },
            rating: reviewData.rating,
            review: reviewData.review,
            createdAt: new Date(),
            productId: productId
        };

        await updateDoc(productRef, {
            rating: arrayUnion(review)
        });

        return { success: true };
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};

// Get all reviews for a store (Store Owner Dashboard e dekhabe)
export const getStoreReviews = async (storeId) => {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('storeId', '==', storeId));
        const snapshot = await getDocs(q);
        
        const allReviews = [];
        
        snapshot.forEach(doc => {
            const productData = doc.data();
            const productReviews = productData.rating || [];
            
            productReviews.forEach(review => {
                allReviews.push({
                    ...review,
                    productId: doc.id,
                    product: {
                        name: productData.name,
                        category: productData.category,
                        image: productData.images?.[0] || productData.image
                    }
                });
            });
        });
        
        // Sort by date (newest first)
        allReviews.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return dateB - dateA;
        });
        
        return allReviews;
    } catch (error) {
        console.error("Error getting store reviews:", error);
        return [];
    }
};