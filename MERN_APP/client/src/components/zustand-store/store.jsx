import {create} from 'zustand';

const useProductStore = create((set) => ({
    loggedIn:false,
    fetchingLoading:false,
    fetchingError: null,
    products: [],
    cart: [],
    deleted: [],
    fetchAllProducts: async () => {
        try {
          set({fetchingLoading: true});
        fetch("https://ecommerce-api-steel-rho.vercel.app/products").then(resp => resp.json()).then(response => {
          set({fetchingLoading: false, products: response.products})
       
        }).catch(err => console.log(err))
        set({fetchingLoading: false});
         
        } catch (error) {
          set({fetchingError: "Error fetching products... Please try again!" });
        }
      },
      deleteProduct: async (id) => {
        console.log(id)
        fetch("https://ecommerce-api-steel-rho.vercel.app/product/"+id, {
          method: "DELETE",
        }).then(del => del.json()).then(p => {
          set({ deleted: p });
        }).catch(err => console.log(err))
      },  
}));
export default useProductStore;