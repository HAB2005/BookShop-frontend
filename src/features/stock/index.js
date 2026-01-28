// Stock feature exports
export { default as StockManagementPage } from './pages/StockManagementPage.jsx';
export { default as StockBadge } from './components/StockBadge.jsx';
export { default as ProductStockBadge } from './components/ProductStockBadge.jsx';
export { default as ProductListStockIntegration } from './components/ProductListStockIntegration.jsx';
export { default as StockUpdateModal } from './components/StockUpdateModal.jsx';
export { default as LowStockAlert } from './components/LowStockAlert.jsx';
export { default as StockStatistics } from './components/StockStatistics.jsx';
export { default as DashboardStockWidget } from './components/DashboardStockWidget.jsx';

// Hooks
export { useStock, useLowStock, useStockStatistics } from './hooks/useStock.js';

// Services
export { default as stockService } from './services/stockService.js';