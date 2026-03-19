import { Link } from 'react-router';
import '@/assets/styles/NotFound.css';

const floatingFoods = ['🍕', '🍔', '🍩', '🍰', '🧁', '🍳'];

const NotFound = () => {
  return (
    <div className="not-found">
      {/* Floating background food icons */}
      <div className="floating-icons" aria-hidden="true">
        {floatingFoods.map((icon, i) => (
          <span className="floating-icon" key={i}>{icon}</span>
        ))}
      </div>

      <div className="not-found-content">
        {/* Plate illustration with 404 */}
        <div className="not-found-plate">
          <span className="utensil utensil-left" aria-hidden="true">🍴</span>
          <div className="plate-circle">
            <div className="plate-inner">
              <span className="not-found-number">404</span>
            </div>
          </div>
          <span className="utensil utensil-right" aria-hidden="true">🥄</span>
        </div>

        <h1 className="not-found-title">哎呀！這道菜還沒上桌</h1>
        <p className="not-found-desc">
          您要找的頁面可能已被移除、名稱已變更，<br />或是暫時無法使用。讓我們帶您回到首頁吧！
        </p>

        <Link to="/" className="not-found-btn">
          <span className="material-symbols-outlined">arrow_back</span>
          返回首頁
        </Link>
      </div>
    </div>
  );
};

export default NotFound;