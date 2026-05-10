import React from 'react';
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

const ProfilePage = () => {
  const navigate = useNavigate();

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
            { icon: <Wallet size={18} />, label: '我的钱包', sub: '¥8,560.24', onClick: () => navigate('/wallet') },
            { icon: <Database size={18} />, label: '根数据管理', sub: '42,851 条', onClick: () => navigate('/my-root-data') },
            { icon: <Network size={18} />, label: '指导关系管理', sub: '' },
            // { icon: <ShieldCheck size={18} />, label: '数据存证', sub: '124 项' },
            { icon: <Briefcase size={18} />, label: '团队管理', sub: '' },
            // { icon: <Bell size={18} />, label: '消息中心', sub: '2 条未读' },
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

  return <MainContent />;
};

export default ProfilePage;
