import { useState, useEffect } from 'react';
import './dashboard.css';
import { saleReportApi, type RevenueData } from '../../api/salesReportAPI';
import type { reportSumary } from "../../types/report.ts";
import RevenueChart from '../../components/charts/RevenueChart';
import dayjs from 'dayjs';
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

  const [fromDate, setFromDate] = useState('14/10/2025');
  const [toDate, setToDate] = useState('14/10/2025');

  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(false);


  const fetchRevenueData = async (from: string, to: string) => {
    setIsLoadingRevenue(true);
    try {
      const formattedFrom = dayjs(from, 'DD/MM/YYYY').format('YYYY-MM-DD');
      const formattedTo = dayjs(to, 'DD/MM/YYYY').format('YYYY-MM-DD');

      const diffDays = dayjs(formattedTo).diff(dayjs(formattedFrom), 'day');

      let response;
      if (diffDays <= 28) {
        response = await saleReportApi.getDailyRevenue({
          fromDate: formattedFrom,
          toDate: formattedTo
        });
        console.log('→ Fetching DAILY report');
      } else {
        response = await saleReportApi.getMonthlyRevenue({
          fromDate: formattedFrom,
          toDate: formattedTo
        });
        console.log('→ Fetching MONTHLY report');
      }

      setRevenueData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
    } finally {
      setIsLoadingRevenue(false);
    }
  };


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

    fetchRevenueData(fromDate, toDate);
  }, []);

  const handleDateChange = (newFromDate: string, newToDate: string) => {
    setFromDate(newFromDate);
    setToDate(newToDate);
    fetchRevenueData(newFromDate, newToDate);
  };

  const [recentActivities] = useState<RecentActivity[]>([
    { id: 1, type: 'order', message: 'Đơn hàng mới từ Nguyễn Thị Lan', time: '5 phút trước', icon: '🛒' },
    { id: 2, type: 'user', message: 'Người dùng mới đăng ký: tranhung123', time: '12 phút trước', icon: '👤' },
    { id: 3, type: 'product', message: 'Sản phẩm "Son YSL Rouge" sắp hết hàng', time: '25 phút trước', icon: '⚠️' },
    { id: 4, type: 'order', message: 'Đơn hàng #DH123 đã được thanh toán', time: '1 giờ trước', icon: '💰' }
  ]);

  const formatMillion = (value: number) => {
    return `${value.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} triệu`;
  };

  const statsCards = [
    { title: 'Tổng người dùng', value: stats.totalUsers.toLocaleString(), icon: '👥', color: 'primary', change: '+12%', changeType: 'increase' },
    { title: 'Tổng sản phẩm', value: stats.totalProducts.toLocaleString(), icon: '💄', color: 'success', change: '+8%', changeType: 'increase' },
    { title: 'Tổng đơn hàng', value: stats.totalOrders.toLocaleString(), icon: '📦', color: 'info', change: '+15%', changeType: 'increase' },
    { title: 'Doanh thu', value: formatMillion(stats.totalRevenue), icon: '💰', color: 'warning', change: '+23%', changeType: 'increase' },
  ];

  return (
      <div className="dashboard">
        <div className="dashboard-main-content">
          {/* Left Section */}
          <div className="dashboard-left-section">
            <div className="dashboard-welcome">
              <div className="welcome-content">
                <h1 className="welcome-title">Chào mừng trở lại! 👋</h1>
                <p className="welcome-subtitle">Đây là tổng quan về hoạt động kinh doanh của bạn hôm nay.</p>
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

            {/* Revenue Chart */}
            <div className="revenue-section">
              <h3 className="revenue-title">Doanh thu</h3>

              {/* Date Range Picker */}
              <div className="date-range-picker">
                <div className="date-input-group">
                  <div className="date-input-wrapper">
                    <span className="date-label-inline">From</span>
                    <input
                        type="text"
                        className="date-input"
                        value={fromDate}
                        onChange={(e) => handleDateChange(e.target.value, toDate)}
                        placeholder="dd/MM/yyyy"
                    />
                    <span className="calendar-icon">📅</span>
                  </div>
                </div>

                <div className="date-input-group">
                  <div className="date-input-wrapper">
                    <span className="date-label-inline">To</span>
                    <input
                        type="text"
                        className="date-input"
                        value={toDate}
                        onChange={(e) => handleDateChange(fromDate, e.target.value)}
                        placeholder="dd/MM/yyyy"
                    />
                    <span className="calendar-icon">📅</span>
                  </div>
                </div>
              </div>

              <div className="revenue-chart">
                {isLoadingRevenue ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Đang tải dữ liệu doanh thu...</p>
                    </div>
                ) : (
                    <RevenueChart data={revenueData} />
                )}
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="dashboard-middle-section">
            {statsCards.map((card, index) => (
                <div key={index} className={`metric-card metric-card-${card.color}`}>
                  <div className="metric-icon">{card.icon}</div>
                  <div className="metric-content">
                    <div className="metric-value">{card.value}</div>
                    <div className="metric-title">{card.title}</div>
                    <div className="metric-change">
                      <span className={`change-indicator ${card.changeType}`}>↗ {card.change}</span>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="dashboard-right-section">
            <div className="activities-section">
              <h3 className="activities-title">Hoạt động gần đây</h3>
              <p className="activities-subtitle">Các sự kiện nổi bật trong hệ thống</p>

              <div className="activities-list">
                {recentActivities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">{activity.icon}</div>
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
      </div>
  );
};
