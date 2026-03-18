import logo from '@/images/logo.png';
import "@/assets/styles/Header.css";

import { NavLink, Link } from 'react-router';
import { useRef, useState, useEffect, useCallback } from 'react';
import navRoutes from '@/routes/navRoutes';

export const Header = () => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const toggleSubMenu = (index) => {
    setActiveSubMenu((prev) => (prev === index ? null : index));
  };

  // 點擊外部關閉 subNavMenu
  const handleClickOutside = useCallback((e) => {
    const inDesktopNav = navRef.current && navRef.current.contains(e.target);
    const inMobileMenu = mobileMenuRef.current && mobileMenuRef.current.contains(e.target);
    if (!inDesktopNav && !inMobileMenu) {
      setActiveSubMenu(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setActiveSubMenu(null);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveSubMenu(null);
  };

  const message = "週年慶！滿千送百，精美小禮加碼送～";

  const ICON = [
    { iconClass: "shopping_cart", link: "/cart", showOnMobile: true },
    { iconClass: "person", link: "/login", showOnMobile: false },
  ]

  return (
    <>
      <header className="container">
        {/* Backdrop Overlay */}
        <div className={`backdrop-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu}></div>

        {/* Mobile Menu */}
        <div ref={mobileMenuRef} className={`mobileMenu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobileMenu-header">
            <Link to="/" onClick={closeMobileMenu}>
              <img src={logo} alt="logo" className="w-41" />
            </Link>
            <button type="button" className="mobileMenu-close" onClick={closeMobileMenu}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form className="relative mx-5 my-4">
            <input type="text" placeholder="當季商品熱賣中" className="inputText ps-10.5 w-full" />
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 transform -translate-y-1/2 block w-6 aspect-square text-lg text-secondary-50">search</span>
          </form>

          <nav className="mobileMenu-nav">
            <ul className="mobileNav">
              {navRoutes.map((route, index) => (
                <li key={route.path} className={`mobileNavItem ${route.children?.length ? 'hasSubMenu' : ''}`}>
                  <div className="mobileNavItem-row">
                    <NavLink className="mobileNavLink" to={route.path} onClick={closeMobileMenu}>
                      {route.title}
                    </NavLink>
                    {route.children?.length > 0 && (
                      <button type="button" className="mobileNavItem-toggle" onClick={() => toggleSubMenu(index)}>
                        <span className={`material-symbols-outlined transition-transform duration-300 ${activeSubMenu === index ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                      </button>
                    )}
                  </div>
                  {route.children?.length > 0 && (
                    <div className={`mobileSubNav ${activeSubMenu === index ? 'open' : ''}`}>
                      <ul>
                        {route.children.map((child) => (
                          <li key={child.path} className="mobileSubNavItem">
                            <NavLink className="mobileSubNavLink" to={child.path} onClick={closeMobileMenu}>
                              {child.title}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mobileMenu-footer">
            <Link className="mobileMenu-footerLink" to="/login" onClick={closeMobileMenu}>
              <span className="material-symbols-outlined">person</span>
              <span>登入 / 註冊</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center py-3 lg:py-5 justify-between transition-all duration-300 ease-in-out">
          <button type="button" className="grid lg:hidden place-items-center w-10 h-10 hover:cursor-pointer hover:text-primary-10 transition-colors duration-300" onClick={toggleMobileMenu}><span className="material-symbols-outlined">menu</span></button>

          <NavLink to="/" className='lg:me-20'><img src={logo} alt="logo" className="w-41" /></NavLink>

          <div className='hidden lg:flex items-center justify-between flex-1 mx-auto'>
            <nav ref={navRef}>
              <ul className='mainNav flex items-center gap-8'>
                <li className='mainNavItem whitespace-nowrap'>
                  <NavLink className={"mainNavLink"} to="/about">關於我們</NavLink>
                </li>
                <li className='mainNavItem whitespace-nowrap hasSubMenu'>
                  <NavLink className={"mainNavLink"} to="/products">商品列表</NavLink>
                  <button type="button" className="w-5 h-5 hover:cursor-pointer" onClick={() => toggleSubMenu(0)}>
                    <span className={`material-symbols-outlined transition-transform duration-300 ${activeSubMenu === 0 ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                  </button>
                  <div className={`subNavMenu ${activeSubMenu === 0 ? 'open' : ''}`}>
                    <ul>
                      <li className='subNavItem'><NavLink className={"subNavLink"} to="/products/鍋具">鍋具</NavLink></li>
                      <li className='subNavItem'><NavLink className={"subNavLink"} to="/products/刀具">刀具</NavLink></li>
                      <li className='subNavItem'><NavLink className={"subNavLink"} to="/products/餐具">餐具</NavLink></li>
                    </ul>
                  </div>
                </li>
                <li className='mainNavItem whitespace-nowrap hasSubMenu'>
                  <NavLink className={"mainNavLink"} to="/articles">品牌專欄</NavLink>
                  <button type="button" className="w-5 h-5 hover:cursor-pointer" onClick={() => toggleSubMenu(1)}>
                    <span className={`material-symbols-outlined transition-transform duration-300 ${activeSubMenu === 1 ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                  </button>
                  <div className={`subNavMenu ${activeSubMenu === 1 ? 'open' : ''}`}>
                    <ul>
                      <li className='subNavItem'><NavLink className={"subNavLink"} to="/">最新消息最新消息</NavLink></li>
                      <li className='subNavItem'><NavLink className={"subNavLink"} to="/">活動公告</NavLink></li>
                      <li className='subNavItem'><NavLink className={"subNavLink"} to="/">品牌故事</NavLink></li>
                    </ul>
                  </div>
                </li>
              </ul>
            </nav>
            <form className="relative mainNavSearch ms-10">
              <input id="headerSearch" type="text" placeholder="當季商品熱賣中" className="inputText ps-10.5 w-full" />
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 transform -translate-y-1/2 block w-6 aspect-square text-lg text-secondary-50">search</span>
            </form>
          </div>

          <ul className="list-none flex items-center gap-4 lg:ms-10">
            {
              ICON.map((item) => (
                <li key={item.iconClass} className={`${item.showOnMobile ? 'block' : 'hidden'} lg:block`}>
                  <Link className="flex justify-center items-center w-11 aspect-square text-secondary-50 hover:text-primary-20 duration-300 ease-in-out" to={item.link}>
                    <span className="block w-6 material-symbols-outlined">{item.iconClass}</span></Link>
                </li>
              ))
            }
          </ul>
        </div>
      </header>
      {/* Promo Message */}
      <div className="bg-primary-20 text-white text-center py-2 px-4">{message}</div>
    </>
  );
};

