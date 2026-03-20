import bannerDesktop from "@/images/bacground_product_L.png";
import bannerMobile from "@/images/bacground_product_S.png";

import { fetchProducts } from "@/store/fetchProductsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const Products = () => {

  const dispatch = useDispatch();
  const products = useSelector(state => state.fetchProducts.products);
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts())
        .unwrap()
        .catch(err => (console.log("reject", err)))
    }
  }, [dispatch, products.length]);
  return (
    <>
      <div className="sectionHero mb-2 lg:mb-10" style={{ '--bg-desktop': `url(${bannerDesktop})`, '--bg-mobile': `url(${bannerMobile})` }}>
        <div className="container">
          <h1 className="sectionTitle">商品分類</h1>
        </div>
      </div>
      <div className="container">
        <nav className="mb-4 lg:mb-10">這是nav</nav>
        <div>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <h2 className="title size-fit whitespace-nowrap mb-2 lg:mb-0"><span className="p-0">亞洲風味</span></h2>
            <div className="bg-primary-60 lg:bg-transparent p-4 flex-1 mb-4">
              <h3 className="text-secondary-50 mb-2 lg:mb-3 text-base/normal lg:text-xl/tight font-bold">把​亞洲​​熱氣、​香料​與家​常味，​裝進​一​包料​理</h3>
              <p>從泰式的酸辣、韓式的酥脆，到日式的溫暖家常，我們把複雜的調味與備料都幫你準備好，你只需要開火、翻炒、加水或加肉，就能在 20～30 分鐘內完成一道真正有風味的料理。不論你是想念旅行，或只是想快速吃到美味，亞洲風味都能讓你的廚房變得更有味道。​</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Products;