import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Share2,
  Database,
  TrendingUp,
  ShieldCheck,
  Users,
  UserCheck,
  Heart,
  MessageCircle,
  Star,
  ChevronRight,
  Settings,
  HelpCircle,
  Bell,
  Wallet,
  ArrowLeft,
  History,
  Eye,
  EyeOff,
  Network,
  Briefcase,
  Scan,
} from 'lucide-react';

const userData = {
  name: '张小飞',
  bio: '致力于区块链数据价值探索',
  phone: '138****8888',
  location: '北京·朝阳',
};

const stats = [
  { label: '分享次数', value: '1,284', icon: <Share2 size={16} /> },
  { label: '剩余额度', value: '18,500', icon: <Database size={16} /> },
  { label: '根数据数量', value: '42,851', icon: <TrendingUp size={16} /> },
  { label: '累计收入', value: '¥92,401', icon: <Wallet size={16} /> },
];

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

const ProfilePage = () => {
  const navigate = useNavigate();
  const [showIncomeDetail, setShowIncomeDetail] = useState(false);
  const [walletTab, setWalletTab] = useState('income');
  const [showBalance, setShowBalance] = useState(true);

  const MainContent = () => (
    <div className="pb-12">
      {/* 个人信息 */}
      <div className="bg-white px-5 pt-4 pb-6 flex items-center justify-between border-b border-[#F0F1F2]">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#F0F1F2]">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop"
              alt="头像"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold">{userData.name}</h1>
              <span className="bg-[#FCEBEC] text-[#C8161D] text-[10px] px-1.5 py-0.5 rounded-sm font-medium">已实名</span>
            </div>
            <p className="text-xs text-[#8F959E] mt-0.5">{userData.bio}</p>
            <p className="text-[10px] text-[#646A73] mt-1">{userData.location} | {userData.phone}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2.5 bg-[#F5F6F7] rounded-full text-[#646A73] active:scale-90 transition-transform">
            <Scan size={18} />
          </button>
          <button className="p-2.5 bg-[#F5F6F7] rounded-full text-[#646A73] active:scale-90 transition-transform">
            <QrCode size={18} />
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4 mt-4">
        {/* 数据块 */}
        <div className="bg-white rounded-[16px] p-4 shadow-sm border border-[#F0F1F2]">
          <div className="grid grid-cols-2 gap-y-4">
            {stats.map((item, index) => (
              <div key={index} className={`${index % 2 === 0 ? 'border-r border-[#F0F1F2]' : 'pl-4'}`}>
                <div className="flex items-center text-[#8F959E] text-[10px] space-x-1 mb-0.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <div className="text-base font-bold">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 社交栏 */}
        <div className="bg-white rounded-[16px] py-4 shadow-sm flex justify-around border border-[#F0F1F2]">
          {[
            { icon: <UserCheck size={20} />, label: '关注' },
            { icon: <Users size={20} />, label: '粉丝' },
            { icon: <Star size={20} />, label: '收藏' },
            { icon: <MessageCircle size={20} />, label: '私信' },
            { icon: <Heart size={20} />, label: '评论' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1 active:opacity-60 transition-opacity cursor-pointer">
              <div className="text-[#646A73]">{item.icon}</div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* 菜单列表 */}
        <div className="bg-white rounded-[16px] shadow-sm border border-[#F0F1F2] overflow-hidden mb-6">
          {[
            { icon: <Wallet size={18} />, label: '我的钱包', sub: '¥8,560.24', onClick: () => setShowIncomeDetail(true) },
            { icon: <Database size={18} />, label: '根数据管理', sub: '42,851 条', onClick: () => navigate('/my-root-data') },
            { icon: <Network size={18} />, label: '指导关系管理', sub: '' },
            { icon: <ShieldCheck size={18} />, label: '数据存证', sub: '124 项' },
            { icon: <Briefcase size={18} />, label: '团队管理', sub: '' },
            { icon: <Bell size={18} />, label: '消息中心', sub: '2 条未读' },
            { icon: <HelpCircle size={18} />, label: '帮助与反馈', sub: '' },
            { icon: <Settings size={18} />, label: '设置中心', sub: '' },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={item.onClick}
              className="p-4 flex items-center justify-between active:bg-[#F5F6F7] border-b last:border-b-0 border-[#F0F1F2] transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <span className="text-[#646A73]">{item.icon}</span>
                <span className="text-[13px] font-medium">{item.label}</span>
              </div>
              <div className="flex items-center space-x-1">
                {item.sub && <span className="text-[10px] text-[#8F959E]">{item.sub}</span>}
                <ChevronRight size={16} className="text-[#BBbfc4]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const WalletDetailView = () => (
    <div className="bg-[#F8F9FA] h-full flex flex-col">
      <div className="bg-white pt-4 px-4 pb-4 flex items-center justify-between border-b border-[#F0F1F2] sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => setShowIncomeDetail(false)} className="p-2 -ml-2 active:bg-[#F5F6F7] rounded-full">
            <ArrowLeft size={22} className="text-[#1F2329]" />
          </button>
          <span className="font-bold text-[17px] ml-1">我的钱包</span>
        </div>
        <div className="flex space-x-4 text-[13px] font-medium text-[#646A73]">
          <span>签约管理</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 mt-4">
          <div className="bg-gradient-to-br from-[#1F2329] to-[#444B59] rounded-[24px] p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-1.5 opacity-90 text-sm">
                <span>资产余额</span>
                <button onClick={() => setShowBalance(!showBalance)}>
                  {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
              <button className="bg-white text-[#1F2329] px-4 py-1 rounded-full text-xs font-bold">提现</button>
            </div>
            <div className="mt-4 flex items-baseline font-bold">
              <span className="text-2xl">¥</span>
              <span className="text-4xl ml-1">{showBalance ? '8,560.24' : '******'}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 px-4">
          <div className="flex items-center space-x-8 border-b border-[#E5E6EB]">
            {['income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => setWalletTab(t)}
                className={`pb-3 text-sm font-bold relative ${walletTab === t ? 'text-[#1F2329]' : 'text-[#8F959E]'}`}
              >
                {t === 'income' ? '收入' : '支出'}
                {walletTab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F2329]" />}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 mt-4 space-y-3 pb-10">
          {(walletTab === 'income' ? walletRecords.income : walletRecords.expense).map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-[#F0F1F2] flex justify-between items-center active:bg-[#F9FAFB]">
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
                <div className={`text-sm font-bold ${walletTab === 'income' ? 'text-[#00B42A]' : 'text-[#1F2329]'}`}>
                  {walletTab === 'income' ? `+${item.amount}` : item.amount}
                </div>
                <div className="text-[9px] text-[#8F959E] mt-0.5">{item.status || '已完成'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return showIncomeDetail ? <WalletDetailView /> : <MainContent />;
};

export default ProfilePage;
