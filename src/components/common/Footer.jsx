import logo from "@/images/logo-color.png";
import facebookIcon from "@/images/facebook.svg";
import instagramIcon from "@/images/instagram.svg";
import lineIcon from "@/images/line.svg";

import { Link } from "react-router";

const socialLinks = [
  { name: "Facebook", icon: facebookIcon, url: "https://www.facebook.com/kitchentraveler" },
  { name: "Instagram", icon: instagramIcon, url: "https://www.instagram.com/kitchen_traveler/" },
  { name: "LINE", icon: lineIcon, url: "https://lin.ee/5n9XqQG" },
];

export const Footer = () => {
  return (
    <footer className="bg-primary-20 pt-20.5 relative before:content-[''] before:absolute before:-top-5.5 before:left-0 before:w-full before:h-5.5 before:bg-[url('@/images/dc_primary_up.png')] before:bg-repeat-x before:bg-contain">
      <div className="container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-10 lg:gap-12 pb-10">

          {/* Brand Column */}
          <div className="flex flex-col items-center lg:items-start">
            <Link to="/" className="block leading-0 w-49 lg:w-56 mb-4">
              <img src={logo} alt="小廚旅人 Logo" />
            </Link>
            <p className="text-primary-60/80 text-sm leading-relaxed mb-1">小廚旅人股份有限公司</p>
            <p className="text-primary-60/80 text-sm leading-relaxed mb-1">100 台北市中正區重慶南路一段 122 號</p>
            <p className="text-primary-60/80 text-sm leading-relaxed mb-4">統一編號：77776666</p>
            {/* Social Icons */}
            <ul className="list-none flex items-center gap-5">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-9 h-9 p-1.5 rounded-full bg-primary-60/15 hover:bg-primary-60/30 transition-colors"
                    aria-label={social.name}
                  >
                    <img src={social.icon} alt={social.name} className="w-full h-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-center lg:text-left">
            <h3 className="text-primary-50 font-bold text-base mb-4 tracking-wide">快速連結</h3>
            <ul className="list-none flex flex-col gap-2.5">
              <li><Link className="text-primary-60/80 hover:text-primary-50 transition-colors text-sm" to="/about">關於我們</Link></li>
              <li><Link className="text-primary-60/80 hover:text-primary-50 transition-colors text-sm" to="/products">商品列表</Link></li>
              <li><Link className="text-primary-60/80 hover:text-primary-50 transition-colors text-sm" to="/articles">品牌專欄</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="text-center lg:text-left">
            <h3 className="text-primary-50 font-bold text-base mb-4 tracking-wide">顧客服務</h3>
            <ul className="list-none flex flex-col gap-2.5">
              <li className="flex items-center justify-center lg:justify-start gap-2 text-primary-60/80 text-sm">
                <span className="material-symbols-outlined text-base">mail</span>
                service@kitchentraveler.com
              </li>
              <li className="flex items-center justify-center lg:justify-start gap-2 text-primary-60/80 text-sm">
                <span className="material-symbols-outlined text-base">call</span>
                (02) 2345-6789
              </li>
              <li className="flex items-center justify-center lg:justify-start gap-2 text-primary-60/80 text-sm">
                <span className="material-symbols-outlined text-base">schedule</span>
                週一至週五 09:00 - 18:00
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-60/20" />

        {/* Copyright */}
        <div className="font-medium text-xs text-primary-60/60 text-center py-5">
          © Copyright 2025 Kitchen Traveler. All Rights Reserved
        </div>
      </div>
    </footer>
  );
};
