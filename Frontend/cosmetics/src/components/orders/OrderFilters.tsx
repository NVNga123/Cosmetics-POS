import React from 'react';

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange
}) => {
  console.log('OrderFilters rendered with searchTerm:', searchTerm);
  const statusTabs = [
    { key: "all", label: "Tất cả" },
    { key: "incomplete", label: "Chưa hoàn thành" },
    { key: "completed", label: "Đã hoàn thành" },
    { key: "cancelled", label: "Đã hủy" },
    { key: "return", label: "Trả hàng" },
  ];

  return (
    <>
      {/* Status Tabs */}
      <div className="status-tabs">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${selectedStatus === tab.key ? "active" : ""}`}
            onClick={() => onStatusChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="main-content-container">
        {/* Search Bar */}
        <div className="search-filter-bar">
          <div className="search-container">
            <span className="fa fa-search search-icon"></span>
            <input
              type="text"
              placeholder="Tên KH, mã ĐH, mã CQT"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>
    </>
  );
};
