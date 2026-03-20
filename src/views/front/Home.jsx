import { useState, useEffect, useCallback, memo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

// Redux
import { fetchAllProducts } from "@/store/fetchProductsSlice";

// React-toastify
import { toast } from "react-toastify";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Swiper 設定常量（避免每次渲染建立新物件參考）
const SWIPER_MODULES = [Navigation, Pagination, Autoplay, EffectFade, Keyboard, A11y];
const SWIPER_PAGINATION = { clickable: true, dynamicBullets: true };
const SWIPER_AUTOPLAY = { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true };

// Styles
import "@/assets/styles/Home.css";
import "@/assets/styles/SwiperCustom.css";

// Image Resources
import banner1 from "@/images/home_hero1.jpg";
import banner2 from "@/images/home_hero2.jpg";
import banner3 from "@/images/home_hero3.jpg";
import banner1mobile from "@/images/home_hero1_m.jpg";
import banner2mobile from "@/images/home_hero2_m.jpg";
import banner3mobile from "@/images/home_hero3_m.jpg";
import stepImg1 from "@/images/home_step1.png";
import stepImg2 from "@/images/home_step2.png";
import stepImg3 from "@/images/home_step3.png";
import stepMainImage from "@/images/home_step_main.png";
import stepImgFood1 from "@/images/home_step_food1.png";
import stepImgFood2 from "@/images/home_step_food2.png";
import stepImgFood3 from "@/images/home_step_food3.png";
import stepImgFood4 from "@/images/home_step_food4.png";
import commentImgDesktop from "@/images/background_home_L.png";
import commentImgMobile from "@/images/background_home_S.png";
import homeExpert1 from "@/images/homeExpert1.png";
import homeExpert2 from "@/images/homeExpert2.png";
import homeExpert3 from "@/images/homeExpert3.png";
import homeExpert4 from "@/images/homeExpert4.png";
import homeBlogImg1 from "@/images/blog1.png";
import homeBlogImg2 from "@/images/blog2.png";
import homeBlogImg3 from "@/images/blog3.png";
import homeBlogImg4 from "@/images/blog4.png";

// Other Resources
const banners = [
  { desktop: banner1, mobile: banner1mobile, text: "把世界的味道\n帶進你家廚房", callToAction: "立即選購" },
  { desktop: banner2, mobile: banner2mobile, text: "把世界的味道\n帶進你家廚房2", callToAction: "立即選購" },
  { desktop: banner3, mobile: banner3mobile, text: "把世界的味道\n帶進你家廚房3", callToAction: "立即選購" },
]

const stepData = [
  { title: "倒入鍋中", text: "拆袋即煮，不需備料", image: stepImg1 },
  { title: "簡單加熱", text: "中小火拌勻，約 3-5 分鐘", image: stepImg2 },
  { title: "美味上桌", text: "即刻享受熱騰騰的家常味", image: stepImg3 },
]

const stepFoodData = [
  { title: "燉菜", text: "多種蔬菜與肉類的完美結合，營養滿分又暖心", image: stepImgFood1 },
  { title: "炒麵", text: "香氣四溢的炒麵，讓你在家也能輕鬆享受夜市美味", image: stepImgFood2 },
  { title: "湯品", text: "濃郁的湯頭與豐富的配料，給你一碗暖心的好味道", image: stepImgFood3 },
  { title: "咖哩", text: "香濃咖哩醬汁搭配多樣配菜，讓你在家也能享受異國風味", image: stepImgFood4 },
]

const commentDatas = [
  { title: "把異國味帶回家廚房的\n旅烹研究者", desc: "料理旅誌作者、小廚旅人成員\n林紹恩", image: homeExpert1, content: "想做出像路邊攤那樣「一入口先亮起來」的泰式炒粉？ \n 本文帶你理解泰國料理最重要的三個味覺比例，學會這個黃金平衡，即使在家也能炒出有鍋氣的道地滋味。" },
  { title: "堅持不用人工添加的\n天然味道守門人", desc: "食品營養分析師\n郭仲良", image: homeExpert2, content: "仲良負責審查所有醬料與料理基底的食材來源。\n他最常說的一句話是:「這味道很好，但我想知道它怎麼更好。」\n他的龜毛讓配方更乾淨也讓品牌的食材標示永遠透明又可靠。" }, { title: "味道靈魂的\n香料整理師", desc: "泰國香料調和開發者\nJaro", image: homeExpert3, content: "在清邁長大的 Jaro,對香茅與南薑有著與生俱來的精準敏銳度。\n他發現大家做泰菜常卡在「 香氣不足」， 於是致力把那份靈魂找回來。小廚旅人所有的東南亞料理包， 都由他親自調香， 只為還原道地滋味。" },
  { title: "不會做飯\n但最懂吃的那個人 ", desc: "風味鑑賞顧問\nEason Chiang ", image: homeExpert4, content: "Eason 不是廚師，甚至不太會做菜。 但只要是對食物，他就有著近乎苛刻的敏銳味覺。\n對於要提供給消費者的商品更是非常嚴格, 他是團隊的口味守門人， 每個新產品一定要他點頭才能上市！每個新產品一定要他點頭才能上市！每個新產品一定要他點頭才能上市！" }
]

const tempBlogs = [
  { date: "2024-05-01", title: "泰式​炒粉​怎​麼煮​才​道​地？​掌握酸、​甜、​辣​的​「黃​金​三​平衡」​", image: homeBlogImg1, content: "想​做出​像​路​邊攤​那​樣​「一入​口​先​亮​起來」​的​泰式​炒粉？ \n ​本​文帶​你​理解泰​國料理​最​重要​的​三個​味覺​比例，​學會​這個​黃金​平衡，​即使​在​家​也​能​炒出​有​鍋氣​的​道地​滋味。​", link: "#" },
  { date: "2024-05-01", title: "懶人​也​能​做​的​韓式​炸雞：​醬汁​才​是​靈魂！​​", image: homeBlogImg2, content: "想​做出​像​路​邊攤​那​樣​「一入​口​先​亮​起來」​的​泰式​炒粉？ \n ​本​文帶​你​理解泰​國料理​最​重要​的​三個​味覺​比例，​學會​這個​黃金​平衡，​即使​在​家​也​能​炒出​有​鍋氣​的​道地​滋味。​", link: "#" },
  { date: "2024-05-01", title: "料​理​包​也​能​升級？​小廚​旅人​教​你​三​種​「快速變化​吃法」​​", image: homeBlogImg3, content: "想​做出​像​路​邊攤​那​樣​「一入​口​先​亮​起來」​的​泰式​炒粉？ \n ​本​文帶​你​理解泰​國料理​最​重要​的​三個​味覺​比例，​學會​這個​黃金​平衡，​即使​在​家​也​能​炒出​有​鍋氣​的​道地​滋味。​", link: "#" },
  { date: "2024-05-01", title: "越南料​理​新​手必​看：​香茅、​魚露​與檸檬草怎​麼用？​​", image: homeBlogImg4, content: "想​做出​像​路​邊攤​那​樣​「一入​口​先​亮​起來」​的​泰式​炒粉？ \n ​本​文帶​你​理解泰​國料理​最​重要​的​三個​味覺​比例，​學會​這個​黃金​平衡，​即使​在​家​也​能​炒出​有​鍋氣​的​道地​滋味。​", link: "#" },
]

// Other Components

const HeroSwiper = memo(({ banners }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <Swiper
      className="hero-swiper"
      modules={SWIPER_MODULES}
      grabCursor={true}
      pagination={SWIPER_PAGINATION}
      autoplay={SWIPER_AUTOPLAY}
      navigation={{
        prevEl: prevRef.current,
        nextEl: nextRef.current,
      }}
      onBeforeInit={(swiper) => {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
      }}
      keyboard={{ enabled: true, onlyInViewport: true }}
      a11y={{
        prevSlideMessage: '上一張投影片',
        nextSlideMessage: '下一張投影片',
        firstSlideMessage: '這是第一張投影片',
        lastSlideMessage: '這是最後一張投影片',
        paginationBulletMessage: '前往第 {{index}} 張投影片',
      }}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      speed={1200}
      loop={true}
    >
      {banners.map((banner, index) => (
        <SwiperSlide key={index}>
          <div
            className="hero-slide"
            style={{
              '--bg-desktop': `url(${banner.desktop})`,
              '--bg-mobile': `url(${banner.mobile})`,
            }}
          >
            <div className="container flex h-full justify-center md:justify-start md:items-center">
              <div className="hero-content text-center md:text-left">
                <h2 className="hero-title mt-15 md:mt-0 mb-5 lg:mb-12 text-secondary-50 font-bold leading-tight tracking-small">
                  {banner.text.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < banner.text.split('\n').length - 1 && <br />}</span>
                  ))}
                </h2>
                <button type="button" className="btn btn-icon">{banner.callToAction}<span className="material-symbols-outlined">arrow_forward_ios</span></button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
      <button type="button" ref={prevRef} className="swiper-button-prev" aria-label="上一張"></button>
      <button type="button" ref={nextRef} className="swiper-button-next" aria-label="下一張"></button>
    </Swiper>
  );
});
HeroSwiper.displayName = "HeroSwiper";

const ProductCard = memo(({ product, onNavigate }) => {
  return (<>
    <div className="group card flex flex-col gap-3 p-3 bg-white border border-primary-40 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" onClick={() => onNavigate(product.id)}>
      <div className="img">
        <button type="button" className="absolute w-8 h-8 grid place-items-center z-1"><span className="material-symbols-outlined text-secondary-60 transition-all duration-300 group-hover:text-primary-20 group-hover:[font-variation-settings:'FILL'_1]">favorite</span></button>
        <img src={product.imageUrl} alt={product.title} onError={handleImgError} className="product-image transition-transform duration-500 ease-out group-hover:scale-105" />
      </div>
      <div className="info">
        <h3 className="mb-1 text-secondary-50 font-medium leading-tight transition-colors duration-300 group-hover:text-primary-20">
          <span className="text-xl">{product.title.replace(/\s*[A-Za-z].*$/, '')}</span>
          <br />
          <span className="text-sm">{product.title.match(/[A-Za-z].*$/)?.[0]}</span>
        </h3>
        <p className="price text-primary-20 font-bold text-2xl/tight">${product.price}</p>
      </div>
    </div>
  </>)
});
ProductCard.displayName = "ProductCard";

const ProductCardSwiper = memo(({ products, onNavigate }) => {
  const swiperRef = useRef(null);
  return (
    <div className="product-swiper-container mb-7 lg:mb-10">
      <Swiper
        modules={SWIPER_MODULES}
        spaceBetween={12}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        speed={600}
        loop={true}
        slidesPerView="auto"
        breakpoints={{
          992: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="product-swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} onNavigate={onNavigate} />
          </SwiperSlide>
        ))}
      </Swiper>
      <button type="button" className="swiper-button-prev hidden lg:block" aria-label="上一張" onClick={() => swiperRef.current?.slidePrev()}></button>
      <button type="button" className="swiper-button-next hidden lg:block" aria-label="下一張" onClick={() => swiperRef.current?.slideNext()}></button>
    </div>
  )
});
ProductCardSwiper.displayName = "ProductCardSwiper";

const HomeCommentCard = memo(({ comment }) => {
  return (
    <div className="flex flex-1 flex-col px-5 bg-white rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col items-center px-2 text-center pt-7 pb-4 border-b-secondary-30 border-b">
        <div className="max-w-30 rounded-full aspect-square overflow-hidden mb-2"><img src={comment.image} alt={comment.title} onError={handleImgError} className="w-full h-full object-cover" /></div>
        <h3 className="text-secondary-50 font-bold text-xl/tight mb-4">{comment.title.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}</h3>
        <p className="text-primary-30 text-sm/normal">{comment.desc.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}</p>
      </div>
      <div className="pt-4 pb-8">
        <p className="comment-content text-secondary-80 text-base/normal">{comment.content.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}</p>
      </div>
    </div>
  )
});
HomeCommentCard.displayName = "HomeCommentCard";

const HomeCommentSwiper = memo(({ commentDatas }) => {
  return (
    <Swiper
      modules={SWIPER_MODULES}
      spaceBetween={12}
      grabCursor={true}
      keyboard={{ enabled: true, onlyInViewport: true }}
      slidesPerView="auto"
      breakpoints={{
        1200: { slidesPerView: 4, spaceBetween: 24 },
        992: { slidesPerView: 3, spaceBetween: 12 },
      }}>
      {commentDatas && commentDatas.map(data => (
        <SwiperSlide key={data.title}>
          <HomeCommentCard comment={data} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
});
HomeCommentSwiper.displayName = "HomeCommentSwiper";

const handleImgError = (e) => {
  e.target.src = "https://placehold.co/300x200?text=No+Image";
};

const Home = () => {

  const dispatch = useDispatch();
  const products = useSelector(state => state.fetchProducts.products);
  const navigate = useNavigate();
  const handleNavigate = useCallback(id => navigate(`/products/${id}`), [navigate]);


  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, products.length]);

  return (
    <>
      <HeroSwiper banners={banners} />

      {/* Products Section */}
      <section className="bg-primary-60 relative dc-up pt-10 lg:pt-25 pb-15 lg:pb-29 text-center overflow-hidden">
        <div className="max-w-324 lg:max-w-334 mx-auto px-3 lg:px-6">
          <h2 className="title"><span>推薦商品</span></h2>
          <ProductCardSwiper products={products} onNavigate={handleNavigate} />
          <button type="button" className="btn btn-outline btn-icon hover:shadow-primary-30 hover:shadow-md">選購去<span className="material-symbols-outlined">arrow_forward_ios</span></button>
        </div>
      </section>


      {/* Step Section */}
      <section className="bg-white">
        {/* upper */}
        <div className="py-10 lg:py-25">
          <div className="container">
            <div className="max-w-267.5 w-full mx-auto relative flex items-center mb-6 lg:mb-5">
              <div className="relative flex w-full justify-center before:content-none lg:before:content-[''] before:absolute before:inset-0 before:w-2.5 before:h-full before:bg-[url('@/images/dc_line.png')] before:bg-repeat-y before:bg-center">
                <div className="mx-auto max-w-full lg:max-w-121">
                  <h2 className="title lg:mb-10"><span>快速家常料理包</span></h2>
                  <div className="block lg:hidden aspect-square max-w-53.75 mx-auto">
                    <img src={stepMainImage} alt="快速家常料理包" />
                  </div>
                  <h3 className="mb-3 font-bold text-secondary-50 text-xl/tight">三步驟上桌的晚餐救星，忙碌也能吃好</h3>
                  <p className="text-secondary-80 mb-5 lg:mb-12">不​需要​備料、​不必​開火​很​久，​只要​倒入、​加熱、​拌​一​拌，​就​能​端出​一​盤​暖心​的​家常​好味。​​</p>
                  <p className="text-secondary-80">​從​燉菜、​炒麵​到​湯品，每​一道​都​為​了​「快速​但​不將​就」​而​設計，​讓​你​下班後​也​能​好​好​吃飯。​​</p>
                </div>
              </div>
              <div className="hidden lg:block max-w-93.5 ms-auto">
                <img src={stepMainImage} alt="快速家常料理包" />
              </div>
            </div>
            <ul className="list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {
                stepData && stepData.map((data, index) => (
                  <li key={data.title} className="flex lg:flex-col p-2 lg:p-10 bg-primary-50 rounded-3xl lg:justify-center items-center  gap-6 lg:text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="overflow-hidden rounded-full"><img className="h-full w-full max-w-33 lg:max-w-full object-fit-cover" src={data.image} alt={data.title} /></div>
                    <div>
                      <h4 className="text-primary-20 font-bold text-base/tight lg:text-xl/tight">STEP {index + 1} {data.title}</h4>
                      <p className="text-secondary-50 text-base/normal">{data.text}</p>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>

        {/* lower */}
        <div className="py-10 lg:py-25">
          <div className="container">
            <div className="flex flex-col lg:flex-row lg:gap-6">

              <div className="flex-1">
                <h2 className="title block lg:hidden mb-5 lg:mb-4 "><span>異國料理包</span></h2>
                <ul className="list-none w-full lg:w-auto mb-4 lg:mb-0 grid grid-cols-2 gap-4 lg:col-start-1 lg:row-span-2">
                  {
                    stepFoodData && stepFoodData.map(data => (<li className="rounded-3xl overflow-hidden" key={data.title}><img className="w-full h-full object-cover hover:scale-105 transition-all duration-500" src={data.image} alt={data.text} /></li>))
                  }
                </ul>
              </div>

              <div className="lg:max-w-131.5 lg:px-15 flex flex-col justify-center items-start relative before:content-none lg:before:content-[''] before:absolute before:inset-x-full before:w-2.5 before:h-full before:bg-[url('@/images/dc_line.png')] before:bg-repeat-y before:bg-center">
                <h2 className="title hidden lg:inline-block mb-10"><span className="px-0 text-start">異國料理包</span></h2>
                <h3 className="mb-3 text-secondary-50 font-bold text-xl/tight">把​旅途​中​嚐過​的​味道，​重新​帶​回餐​桌​</h3>
                <p className="mb-4 lg:mb-10">​泰式、​韓式、​義式、​越南​風味……所有​辛​香料、​基底​醬​都​替​你​準備好，​你​只要​負責​倒進​鍋裡、​翻炒、​煨煮，​就​能​做​出​超越​外帶​的​異國料理。​​ <br /><br />不​必​出國，​一​份料​理​包​就​能​讓家​裡聞​起​來像​在​旅行。​</p>
                <button type="button" className="btn btn-outline btn-icon hover:shadow-primary-30 hover:shadow-md mx-auto lg:mx-0">看更多商品<span className="material-symbols-outlined">arrow_forward_ios</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Home Expert Section */}
      <section className="homeComment pt-17 pb-10 lg:pb-25 lg:pt-32 relative dc-down overflow-hidden" style={
        { "--bg-desktop": `url(${commentImgDesktop})`, "--bg-mobile": `url(${commentImgMobile})` }
      }>
        <div className="max-w-324 lg:max-w-334 mx-auto px-3 lg:px-5">
          <h2 className="title mb-5 lg:mb-10"><span>小廚旅人，<br className="block lg:hidden" />堅持提供最好的給你</span></h2>
          <HomeCommentSwiper commentDatas={commentDatas} />
        </div>
      </section>

      {/* Home Blog Section */}
      <section className="py-20 lg:pt-25 lg:pb-40">
        <h2 className="title text-center mb-5 lg:mb-10"><span>小廚專欄：把世界帶回你的餐桌</span></h2>
        <div className="container">
          <ul className="list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {
              tempBlogs && tempBlogs.map(blog => (
                <li key={blog.title} className="flex flex-col rounded-3xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative overflow-hidden h-48">
                    <img src={blog.image} alt={blog.title} onError={handleImgError} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a href={blog.link || '#'} className="btn btn-icon text-sm">閱讀更多</a>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 p-5 bg-white flex-1">
                    <p className="text-primary-30 text-sm/normal">{blog.date}</p>
                    <h3 className="text-secondary-50 font-bold text-lg/tight transition-colors duration-300 group-hover:text-primary-20">{blog.title}</h3>
                    <p className="text-secondary-80 text-base/normal mt-auto">{blog.content}</p>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      </section>

      {/* {JSON.stringify(products)} */}
    </>)
}

export default Home;