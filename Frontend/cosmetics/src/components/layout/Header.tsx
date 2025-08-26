// Component Header
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header style={{ padding: '1rem', background: '#f0f0f0' }}>
      <nav>
        <Link to="/pos" style={{ marginRight: '1rem' }}>POS</Link>
        <Link to="/products" style={{ marginRight: '1rem' }}>Products</Link>
        <Link to="/orders" style={{ marginRight: '1rem' }}>Orders</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
};