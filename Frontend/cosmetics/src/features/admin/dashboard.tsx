import { useState, useEffect } from 'react';
import './dashboard.css';
import {saleReportApi} from "../../api/salesReportAPI.ts";
import type {reportSumary} from "../../types/report.ts";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  pendingOrders: number;
}

interface RecentActivity {
  id: number;
  type: 'user' | 'order' | 'product';
  message: string;
  time: string;
  icon: string;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1250,
    totalProducts: 340,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 23,
    pendingOrders: 5
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await saleReportApi.getAllReport();
        const data: reportSumary = res?.data;

        if (data) {
          setStats((prev) => ({
            ...prev,
            totalOrders: data.totalOrders ?? 0,
            totalRevenue: data.totalRevenueDisplay ?? 0,
            totalProducts: data.totalQuantityProduct ?? 0,
          }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu báo cáo:", error);
      }
    };

    fetchReportData();
  }, []);

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: 1,
      type: 'order',
      message: 'Đơn hàng mới từ Nguyễn Thị Lan',
      time: '5 phút trước',
      icon: '🛒'
    },
    {
      id: 2,
      type: 'user',
      message: 'Người dùng mới đăng ký: tranhung123',
      time: '12 phút trước',
      icon: '👤'
    },
    {
      id: 3,
      type: 'product',
      message: 'Sản phẩm "Son YSL Rouge" sắp hết hàng',
      time: '25 phút trước',
      icon: '⚠️'
    },
    {
      id: 4,
      type: 'order',
      message: 'Đơn hàng #DH123 đã được thanh toán',
      time: '1 giờ trước',
      icon: '💰'
    }
  ]);

  const formatMillion = (value: number) => {
    return `${value.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} triệu`;
  };

  const statsCards = [
    {
      title: 'Tổng người dùng',
      value: stats.totalUsers.toLocaleString(),
      icon: '👥',
      color: 'primary',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts.toLocaleString(),
      icon: '💄',
      color: 'success',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Tổng đơn hàng',
      value: stats.totalOrders.toLocaleString(),
      icon: '📦',
      color: 'info',
      change: '+15%',
      changeType: 'increase'
    },
    {
      title: 'Doanh thu',
      value: formatMillion(stats.totalRevenue),
      icon: '💰',
      color: 'warning',
      change: '+23%',
      changeType: 'increase'
    }
  ];

  const quickActions = [
    {
      title: 'Thêm sản phẩm',
      description: 'Thêm sản phẩm mới vào cửa hàng',
      icon: '➕',
      color: 'primary',
      href: '/admin/products/new'
    },
    {
      title: 'Quản lý đơn hàng',
      description: 'Xem và xử lý đơn hàng',
      icon: '📋',
      color: 'success',
      href: '/admin/orders'
    },
    {
      title: 'Thống kê bán hàng',
      description: 'Xem báo cáo và phân tích',
      icon: '📊',
      color: 'info',
      href: '/admin/reports'
    },
    {
      title: 'Cài đặt hệ thống',
      description: 'Cấu hình các tùy chọn',
      icon: '⚙️',
      color: 'secondary',
      href: '/admin/settings'
    }
  ];

  return (
      <div className="dashboard">
        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <div className="welcome-content">
            <h1 className="welcome-title">
              Chào mừng trở lại! 👋
            </h1>
            <p className="welcome-subtitle">
              Đây là tổng quan về hoạt động kinh doanh của bạn hôm nay.
            </p>
          </div>
          <div className="welcome-stats">
            <div className="today-stat">
              <span className="stat-label">Đơn hàng hôm nay</span>
              <span className="stat-value">{stats.todayOrders}</span>
            </div>
            <div className="today-stat">
              <span className="stat-label">Đơn chờ xử lý</span>
              <span className="stat-value pending">{stats.pendingOrders}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {statsCards.map((card, index) => (
              <div key={index} className={`stat-card stat-card-${card.color}`}>
                <div className="stat-card-header">
                  <div className="stat-icon">
                    {card.icon}
                  </div>
                  <div className={`stat-change ${card.changeType}`}>
                    {card.change}
                  </div>
                </div>
                <div className="stat-card-body">
                  <h3 className="stat-value">{card.value}</h3>
                  <p className="stat-title">{card.title}</p>
                </div>
              </div>
          ))}
        </div>

        <div className="dashboard-content">
          {/* Quick Actions */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Thao tác nhanh</h2>
              <p className="section-subtitle">Các hành động thường dùng nhất</p>
            </div>

            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                  <div key={index} className={`quick-action-card action-${action.color}`}>
                    <div className="action-icon">
                      {action.icon}
                    </div>
                    <div className="action-content">
                      <h3 className="action-title">{action.title}</h3>
                      <p className="action-description">{action.description}</p>
                    </div>
                    <button className="action-button btn btn-sm btn-primary">
                      Thực hiện →
                    </button>
                  </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Hoạt động gần đây</h2>
              <p className="section-subtitle">Các sự kiện mới nhất trong hệ thống</p>
            </div>

            <div className="activity-list card">
              {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {activity.icon}
                    </div>
                    <div className="activity-content">
                      <p className="activity-message">{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};