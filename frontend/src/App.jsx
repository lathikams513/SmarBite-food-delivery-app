import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import CartPage from './pages/CartPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import GroupOrderPage from './pages/GroupOrderPage.jsx';
import { smartApi } from './services/api';

const ACTIVE_GROUP_KEY = 'smartbite-active-group-code';

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeGroupCode, setActiveGroupCode] = useState('');
  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('smartbite-user');
    const storedCart = localStorage.getItem('smartbite-cart');
    const storedActiveGroup = localStorage.getItem(ACTIVE_GROUP_KEY);
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedActiveGroup) setActiveGroupCode(storedActiveGroup);
  }, []);

  useEffect(() => {
    localStorage.setItem('smartbite-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (activeGroupCode) {
      localStorage.setItem(ACTIVE_GROUP_KEY, activeGroupCode);
      refreshGroup(activeGroupCode);
    } else {
      localStorage.removeItem(ACTIVE_GROUP_KEY);
      setActiveGroup(null);
    }
  }, [activeGroupCode]);

  const refreshGroup = async (groupCode = activeGroupCode) => {
    if (!groupCode) return null;
    try {
      const response = await smartApi.getGroup(groupCode);
      const group = response.data.data;
      setActiveGroup(group);
      return group;
    } catch (error) {
      setActiveGroup(null);
      return null;
    }
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('smartbite-user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setActiveGroupCode('');
    setActiveGroup(null);
    localStorage.removeItem('smartbite-user');
    localStorage.removeItem('smartbite-cart');
    localStorage.removeItem(ACTIVE_GROUP_KEY);
  };

  const activateGroup = async (groupCode) => {
    setActiveGroupCode(groupCode);
    return refreshGroup(groupCode);
  };

  const handleAddToCart = async (item) => {
    if (activeGroup && Number(activeGroup.restaurantId) === Number(item.restaurantId) && activeGroup.status === 'OPEN') {
      await smartApi.addGroupItem({ groupCode: activeGroup.groupCode, menuId: item.id, quantity: 1 });
      await refreshGroup();
      return;
    }

    setCart((currentCart) => {
      if (currentCart.length > 0 && currentCart[0].restaurantId !== item.restaurantId) {
        return [{ ...item, quantity: 1 }];
      }
      const existingItem = currentCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return currentCart.map((cartItem) => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem);
      }
      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, delta) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => item.id === itemId ? { ...item, quantity: item.quantity + delta } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId));
  };

  const updateGroupItemQuantity = async (itemId, delta) => {
    if (!activeGroup) return;
    const currentItem = (activeGroup.items || []).find((item) => Number(item.menuId || item.id) === Number(itemId) || Number(item.id) === Number(itemId));
    if (!currentItem) return;
    const menuId = currentItem.menuId || currentItem.id;
    await smartApi.addGroupItem({ groupCode: activeGroup.groupCode, menuId, quantity: delta });
    await refreshGroup();
  };

  const removeGroupItem = async (itemId) => {
    if (!activeGroup) return;
    const currentItem = (activeGroup.items || []).find((item) => Number(item.menuId || item.id) === Number(itemId) || Number(item.id) === Number(itemId));
    if (!currentItem) return;
    const menuId = currentItem.menuId || currentItem.id;
    await smartApi.addGroupItem({ groupCode: activeGroup.groupCode, menuId, quantity: -currentItem.quantity });
    await refreshGroup();
  };

  const updateGroupSplit = async (userId, amount) => {
    if (!activeGroup) return;
    await smartApi.updateGroupSplit({ groupCode: activeGroup.groupCode, userId, amount: Number(amount) });
    await refreshGroup();
  };

  const completeGroupOrder = async () => {
    if (!activeGroup) return;
    await refreshGroup();
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar user={user} cartCount={activeGroup?.items?.length || cart.length} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/menu/:restaurantId" element={<MenuPage onAddToCart={handleAddToCart} activeGroup={activeGroup} />} />
        <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} updateGroupItemQuantity={updateGroupItemQuantity} removeGroupItem={removeGroupItem} user={user} activeGroup={activeGroup} />} />
        <Route path="/order" element={<ProtectedRoute user={user}><OrderPage user={user} cart={cart} clearCart={() => setCart([])} activeGroup={activeGroup} completeGroupOrder={completeGroupOrder} /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute user={user}><OrdersPage user={user} /></ProtectedRoute>} />
        <Route path="/group-order" element={<ProtectedRoute user={user}><GroupOrderPage user={user} activeGroup={activeGroup} onActivateGroup={activateGroup} onUpdateGroupSplit={updateGroupSplit} /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
