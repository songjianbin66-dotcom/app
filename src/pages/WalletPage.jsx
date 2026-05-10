import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  History,
  Eye,
  EyeOff,
} from 'lucide-react';

const walletRecords = {
  income: [
    { id: '1', title: '链主收入', amount: '450.00', time: '2024.05.20 14:30', type: 'chain' },
    { id: '2', title: '指导收入', amount: '120.50', time: '2024.05.19 09:12', type: 'mentor' },
    { id: '3', title: '链主收入', amount: '800.00', time: '2024.05.18 22:05', type: 'chain' },
  ],
  expense: [
    { id: 'e1', title: '提现记录', amount: '-500.00', time: '2024.05.15 10:00', status: '成功' },
    { id: 'e2', title: '个税扣款', amount: '-45.00', time: '2024.05.01 08:00', status: '成功' },
  ],
};

const WalletPage = () => {
  const navigate = useNavigate();
  const [walletTab, setWalletTab] = useState('income');
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen font-sans">
      <div className="w-full max-w-[430px] h-screen bg-[#F8F9FA] flex flex-col shadow-2xl relative overflow-hidden text-[#1F2329]">
        {/* 顶部导航 */}
        <div className="bg-white pt-4 px-4 pb-4 flex items-center justify-between border-b border-[#F0F1F2] sticky top-0 z-10 shrink-0">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 active:bg-[#F5F6F7] rounded-full"
              aria-label="返回"
            >
              <ArrowLeft size={22} className="text-[#1F2329]" />
            </button>
            <span className="font-bold text-[17px] ml-1">我的钱包</span>
          </div>
          <div className="flex space-x-4 text-[13px] font-medium text-[#646A73]">
            <span>签约管理</span>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto">
          {/* 余额卡片 */}
          <div className="px-4 mt-4">
            <div className="bg-gradient-to-br from-[#1F2329] to-[#444B59] rounded-[24px] p-6 text-white shadow-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-1.5 opacity-90 text-sm">
                  <span>资产余额</span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    aria-label={showBalance ? '隐藏余额' : '显示余额'}
                  >
                    {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
                <button className="bg-white text-[#1F2329] px-4 py-1 rounded-full text-xs font-bold cursor-pointer active:opacity-70 transition-opacity">
                  提现
                </button>
              </div>
              <div className="mt-4 flex items-baseline font-bold">
                <span className="text-2xl">¥</span>
                <span className="text-4xl ml-1">{showBalance ? '8,560.24' : '******'}</span>
              </div>
            </div>
          </div>

          {/* Tab 切换 */}
          <div className="mt-6 px-4">
            <div className="flex items-center space-x-8 border-b border-[#E5E6EB]">
              {['income', 'expense'].map((t) => (
                <button
                  key={t}
                  onClick={() => setWalletTab(t)}
                  className={`pb-3 text-sm font-bold relative ${walletTab === t ? 'text-[#1F2329]' : 'text-[#8F959E]'}`}
                >
                  {t === 'income' ? '收入' : '支出'}
                  {walletTab === t && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F2329]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 记录列表 */}
          <div className="px-4 mt-4 space-y-3 pb-10">
            {(walletTab === 'income' ? walletRecords.income : walletRecords.expense).map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-[#F0F1F2] flex justify-between items-center active:bg-[#F9FAFB]"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <History size={18} />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold">{item.title}</div>
                    <div className="text-[10px] text-[#8F959E]">{item.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-bold ${
                      walletTab === 'income' ? 'text-[#00B42A]' : 'text-[#1F2329]'
                    }`}
                  >
                    {walletTab === 'income' ? `+${item.amount}` : item.amount}
                  </div>
                  <div className="text-[9px] text-[#8F959E] mt-0.5">{item.status || '已完成'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
