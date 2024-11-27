export const fetchCartProducts = async (storedCart) => {
    const productRequests = Object.keys(storedCart).map(async (productId) => {
      const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
      const product = await response.json();
      return { ...product, quantity: storedCart[productId] };
    });
  
    try {
      const products = await Promise.all(productRequests);
      return products;
    } catch (error) {
      console.error('Error fetching cart products:', error);
      throw error; 
    }
  };
  