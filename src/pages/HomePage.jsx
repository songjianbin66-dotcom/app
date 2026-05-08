import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Cloud, 
  Plus,
  Search, 
  Heart, 
  MessageSquare, 
  Share2,
  Star,
  Home, 
  Grid, 
  User,
  Zap,
  ArrowLeft,
  X
} from 'lucide-react';

const THEME_COLOR = '#C8161D';
const INITIAL_ROOT_DATA_COUNT = 4;
const ROOT_DATA_LOAD_STEP = 4;
const SHARED_THEME_STYLES = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .theme-text { color: ${THEME_COLOR}; }
  .theme-bg { background-color: ${THEME_COLOR}; }
  .theme-border { border-color: ${THEME_COLOR}; }
`;
const VIDEO_COVER_SETS = [
  [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
  ],
  [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
  ],
  [
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=900&q=80',
  ],
];
const PLAYER_ROOT_IDS = ['root-001', 'root-002', 'root-003'];
const PLAYER_SECTION_KEY_BY_CATEGORY = {
  脑图: 'mindmap',
  原文: 'original',
  讲解: 'lecture',
};

const getPlayerVideoId = (rootId, sectionKey) => {
  if (sectionKey === 'lecture') {
    return `${rootId}-lecture-1`;
  }

  if (sectionKey === 'original') {
    return `${rootId}-original-1`;
  }

  return `${rootId}-mindmap-1`;
};

const parseCountLabel = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  const normalizedValue = String(value).trim().toLowerCase();
  const match = normalizedValue.match(/^(\d+(?:\.\d+)?)([kw])?$/);

  if (!match) {
    const numericValue = Number.parseInt(normalizedValue.replace(/[^\d]/g, ''), 10);
    return Number.isNaN(numericValue) ? 0 : numericValue;
  }

  const [, amount, unit] = match;
  const multiplier = unit === 'w' ? 10000 : unit === 'k' ? 1000 : 1;
  return Math.round(Number.parseFloat(amount) * multiplier);
};

const formatCountLabel = (value) => {
  if (value >= 10000) {
    const scaledValue = value >= 100000 ? (value / 10000).toFixed(0) : (value / 10000).toFixed(1);
    return `${scaledValue.replace(/\.0$/, '')}w`;
  }

  if (value >= 1000) {
    const scaledValue = value >= 10000 ? (value / 1000).toFixed(0) : (value / 1000).toFixed(1);
    return `${scaledValue.replace(/\.0$/, '')}k`;
  }

  return String(value);
};

const App = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('根数据');
  const [bottomTab, setBottomTab] = useState('首页');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPromoVisible, setIsPromoVisible] = useState(true);
  const [visibleRootDataCount, setVisibleRootDataCount] = useState(INITIAL_ROOT_DATA_COUNT);
  const [floatingButtonPos, setFloatingButtonPos] = useState({ x: 0, y: 0 });
  const phoneFrameRef = useRef(null);
  const floatingButtonRef = useRef(null);
  const dragStateRef = useRef({
    isDragging: false,
    pointerOffsetX: 0,
    pointerOffsetY: 0,
  });
  const openPlayer = ({ action = 'play', rootId, sectionKey, videoId } = {}) => {
    navigate('/player', {
      state: rootId && sectionKey
        ? {
            action,
            rootId,
            sectionKey,
            videoId,
          }
        : undefined,
    });
  };

  // 1. 根数据 - 10 条
  const cardData = Array.from({ length: 10 }).map((_, i) => {
    const baseTitle = i % 2 === 0
      ? `数智化赋能：如何构建企业级 AI 智能体应用架构 (${i + 1})`
      : `从 0 到 1 搭建产业数智链：史宪文教授的实战经验分享 (${i + 1})`;
    const playerRootId = PLAYER_ROOT_IDS[i % PLAYER_ROOT_IDS.length];

    return {
      id: i + 1,
      playerRootId,
      tags: i % 2 === 0 ? ['企业策划', '转型升级'] : ['数智链', '实战案例'],
      author: '史宪文',
      authorRole: i % 2 === 0 ? '创始链主' : '指导师',
      authorAvatar: i % 2 === 0
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop'
        : 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop',
      videos: [
        {
          id: `v${i}-mind`,
          category: '脑图',
          playerSectionKey: PLAYER_SECTION_KEY_BY_CATEGORY.脑图,
          playerVideoId: getPlayerVideoId(playerRootId, PLAYER_SECTION_KEY_BY_CATEGORY.脑图),
          title: `${baseTitle} · 脑图拆解`,
          agent: '企业策划智能体',
          duration: '01:20',
          likes: i % 2 === 0 ? '1.2k' : '936',
          favorites: i % 2 === 0 ? '568' : '421',
          comments: i % 2 === 0 ? '234' : '168',
          shares: i % 2 === 0 ? '856' : '612',
          cover: VIDEO_COVER_SETS[i % VIDEO_COVER_SETS.length][0],
        },
        {
          id: `v${i}-source`,
          category: '原文',
          playerSectionKey: PLAYER_SECTION_KEY_BY_CATEGORY.原文,
          playerVideoId: getPlayerVideoId(playerRootId, PLAYER_SECTION_KEY_BY_CATEGORY.原文),
          title: `${baseTitle} · 原文精读`,
          agent: '原文解读智能体',
          duration: '05:15',
          likes: i % 2 === 0 ? '978' : '742',
          favorites: i % 2 === 0 ? '435' : '389',
          comments: i % 2 === 0 ? '186' : '142',
          shares: i % 2 === 0 ? '633' : '508',
          cover: VIDEO_COVER_SETS[i % VIDEO_COVER_SETS.length][1],
        },
        {
          id: `v${i}-explain`,
          category: '讲解',
          playerSectionKey: PLAYER_SECTION_KEY_BY_CATEGORY.讲解,
          playerVideoId: getPlayerVideoId(playerRootId, PLAYER_SECTION_KEY_BY_CATEGORY.讲解),
          title: `${baseTitle} · 案例讲解`,
          agent: '案例讲解智能体',
          duration: '03:45',
          likes: i % 2 === 0 ? '1.5k' : '1.1k',
          favorites: i % 2 === 0 ? '826' : '644',
          comments: i % 2 === 0 ? '312' : '205',
          shares: i % 2 === 0 ? '924' : '688',
          cover: VIDEO_COVER_SETS[i % VIDEO_COVER_SETS.length][2],
        }
      ]
    };
  });

  // 2. 百大创始链主数据
  const leaderData = [
    { id: 1, name: '史宪文', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', rootDataCount: 156, deals: 3205, fans: '12.5w', isFollowing: true },
    { id: 2, name: '陈教授', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', rootDataCount: 89, deals: 1540, fans: '4.8w', isFollowing: true },
    { id: 3, name: '王导师', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', rootDataCount: 64, deals: 890, fans: '2.1w', isFollowing: false },
    ...Array.from({ length: 7 }).map((_, i) => ({
      id: i + 4,
      name: `链主_${i + 4}`,
      avatar: `https://i.pravatar.cc/100?u=leader${i}`,
      rootDataCount: 12,
      deals: 156,
      fans: '0.5w',
      isFollowing: false
    }))
  ];

  // 3. 数智指导师数据
  const instructorData = [
    { 
      id: 1, 
      name: '史宪文', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', 
      rootDataCount: 156, 
      shareCount: 1280, 
      shareDealCount: 450,
      invitedCount: 320,
      passRate: '98%',
      guidedCount: 1500,
      fansCount: '10.5w',
      isFollowing: true
    },
    { 
      id: 2, 
      name: '李专家', 
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop', 
      rootDataCount: 85, 
      shareCount: 650, 
      shareDealCount: 120,
      invitedCount: 156,
      passRate: '92%',
      guidedCount: 860,
      fansCount: '3.2w',
      isFollowing: false
    }
  ];

  useEffect(() => {
    const updateFloatingButtonPosition = () => {
      const container = phoneFrameRef.current;
      const button = floatingButtonRef.current;
      if (!container || !button) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const buttonWidth = button.offsetWidth || 64;
      const buttonHeight = button.offsetHeight || 76;

      setFloatingButtonPos((current) => {
        const hasInitialPosition = current.x !== 0 || current.y !== 0;
        const defaultX = containerWidth - buttonWidth - 16;
        const defaultY = containerHeight - buttonHeight - 88;

        if (!hasInitialPosition) {
          return { x: defaultX, y: defaultY };
        }

        return {
          x: Math.min(Math.max(12, current.x), containerWidth - buttonWidth - 12),
          y: Math.min(Math.max(72, current.y), containerHeight - buttonHeight - 12),
        };
      });
    };

    updateFloatingButtonPosition();
    window.addEventListener('resize', updateFloatingButtonPosition);
    return () => window.removeEventListener('resize', updateFloatingButtonPosition);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!dragStateRef.current.isDragging) return;

      const container = phoneFrameRef.current;
      const button = floatingButtonRef.current;
      if (!container || !button) return;

      const containerRect = container.getBoundingClientRect();
      const buttonWidth = button.offsetWidth;
      const buttonHeight = button.offsetHeight;
      const nextX = event.clientX - containerRect.left - dragStateRef.current.pointerOffsetX;
      const nextY = event.clientY - containerRect.top - dragStateRef.current.pointerOffsetY;

      setFloatingButtonPos({
        x: Math.min(Math.max(12, nextX), containerRect.width - buttonWidth - 12),
        y: Math.min(Math.max(72, nextY), containerRect.height - buttonHeight - 12),
      });
    };

    const handlePointerUp = () => {
      dragStateRef.current.isDragging = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  if (isSearchOpen) {
    return (
      <SearchPage
        onClose={() => setIsSearchOpen(false)}
        rootDataResults={cardData}
        userResults={leaderData}
        onOpenPlayer={openPlayer}
      />
    );
  }

  const isHomeTab = bottomTab === '首页';
  const isSmartTab = bottomTab === '数智';

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen font-sans">
      <style>{SHARED_THEME_STYLES}</style>

      <div ref={phoneFrameRef} className="w-full max-w-[430px] h-screen bg-white flex flex-col shadow-2xl relative overflow-hidden text-[#1F2329]">
        
        {/* 顶部导航 */}
        <header className="flex items-center justify-between px-4 h-[50px] border-b-[0.5px] border-[#E5E6EB] bg-white sticky top-0 z-50 shrink-0">
          <Menu size={18} className="text-[#646A73]" />
          <div className="flex items-center gap-[4px]">
            {/* <Cloud size={14} className="theme-text fill-current" /> */}
            <span className="text-[15px] font-bold tracking-tight">数智链</span>
          </div>
          <div className="w-[18px]" /> 
        </header>

        {/* 主体内容 */}
        {isHomeTab && (
          <main className="flex-1 overflow-y-auto no-scrollbar bg-white">
            <section className="bg-white px-3 py-3 flex justify-between items-center border-b-[0.5px] border-[#F5F6F8]">
              <DashboardItem label="今日分享" value="108" />
              <div className="h-6 w-[0.5px] bg-[#E5E6EB]" />
              <DashboardItem label="新入链主" value="2" />
              <div className="h-6 w-[0.5px] bg-[#E5E6EB]" />
              <DashboardItem label="额度" value="1798" />
              <div className="h-6 w-[0.5px] bg-[#E5E6EB]" />
              <DashboardItem label="累计收入" value="1.6w"  />
            </section>

            <section className="bg-white px-4 py-3 cursor-pointer" onClick={() => setIsSearchOpen(true)}>
              <div className="h-11 bg-[#F5F6F8] rounded-xl flex items-center px-4 gap-[10px] active:bg-[#ECEEF2] transition-colors">
                <Search size={16} className="text-[#8F959E]" />
                <span className="text-[14px] text-[#8F959E]">搜索智能体内容/指导师/链主</span>
              </div>
            </section>

            {isPromoVisible && (
              <section className="px-4 pb-3">
                <div className="relative overflow-hidden rounded-[15px] bg-[#C8161D] px-4 pb-2.5 pt-2.5 text-white shadow-[0_10px_22px_rgba(200,22,29,0.16)]">
                  <button
                    type="button"
                    onClick={() => setIsPromoVisible(false)}
                    className="absolute right-3 top-3 text-white/60 transition-colors hover:text-white"
                    aria-label="关闭链主尊享"
                  >
                    <X size={16} strokeWidth={2.1} />
                  </button>
                  <div className="pr-[150px]">
                    <div className="min-w-0">
                      <div className="mb-1.5 text-[13px] font-bold tracking-[0.01em]">链主尊享</div>
                      <div className="mb-1.5 flex items-end gap-1">
                        <span className="translate-y-[-1px] text-[14px] font-medium text-white/70">￥</span>
                        <span className="text-[26px] font-black leading-none tracking-[-0.03em]">10000</span>
                      </div>
                      <div className="space-y-1.5 text-[10px] font-semibold text-white/72">
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                          <span>根数据开发权</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                          <span>1800链主额度销售权</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                          <span>根数据辅导权</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="absolute bottom-2.5 right-4 inline-flex h-8 items-center justify-center rounded-[16px] bg-white px-4 text-[11px] font-bold theme-text shadow-[0_8px_18px_rgba(255,255,255,0.16)]"
                  >
                    立即成为链主
                  </div>
                </div>
              </section>
            )}

            <nav className="h-11 bg-white flex sticky top-0 z-40">
              <TabItem label="根数据" active={activeTab === '根数据'} onClick={() => setActiveTab('根数据')} />
              <TabItem label="百大创始链主" active={activeTab === '百大创始链主'} onClick={() => setActiveTab('百大创始链主')} />
              <TabItem label="数智指导师" active={activeTab === '数智指导师'} onClick={() => setActiveTab('数智指导师')} />
            </nav>

            <div className="bg-white">
              {activeTab === '根数据' && (
                <div className="divide-y divide-[#F0F1F5]">
                  {cardData.slice(0, visibleRootDataCount).map((item) => (
                    <DataCard
                      key={item.id}
                      data={item}
                      onOpenPlayer={openPlayer}
                    />
                  ))}
                  {visibleRootDataCount < cardData.length && (
                    <div className="bg-white px-4 py-5">
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleRootDataCount((current) =>
                            Math.min(current + ROOT_DATA_LOAD_STEP, cardData.length)
                          )
                        }
                        className="flex w-full items-center justify-center py-2 text-[15px] font-bold theme-text transition-opacity duration-200 active:opacity-70"
                      >
                        点击加载更多
                      </button>
                    </div>
                  )}
                </div>
              )}
              {activeTab === '百大创始链主' && (
                <div className="divide-y divide-[#F5F6F8]">
                  {leaderData.map((leader) => <LeaderItem key={leader.id} leader={leader} />)}
                </div>
              )}
              {activeTab === '数智指导师' && (
                <div className="divide-y divide-[#F5F6F8]">
                  {instructorData.map((inst) => <InstructorItem key={inst.id} instructor={inst} />)}
                </div>
              )}
              <div className="h-24" />
            </div>
          </main>
        )}

        {isSmartTab && (
          <main className="flex-1 overflow-hidden bg-[#F5F6F8]">
            <iframe
              title="数智三进"
              src="/shuzhi-san-jin.html"
              className="h-full w-full border-0 bg-white"
            />
          </main>
        )}

        {!isHomeTab && !isSmartTab && (
          <main className="flex-1 bg-[#F5F6F8] px-6 py-10">
            <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
              <div className="text-[18px] font-bold text-[#1F2329]">我的</div>
              <p className="mt-3 text-[13px] leading-6 text-[#8F959E]">
                这里暂时保留为空白页，首页与数智页签都可正常切换。
              </p>
            </div>
          </main>
        )}

        {/* 底部导航 */}
        <footer className="h-[58px] bg-white border-t-[0.5px] border-[#E5E6EB] flex items-center pb-2 shrink-0 z-50">
          <BottomTabItem 
            label="首页" 
            active={bottomTab === '首页'} 
            icon={<Home size={22} className={bottomTab === '首页' ? 'fill-current' : ''} />} 
            onClick={() => setBottomTab('首页')}
          />
          <BottomTabItem 
            label="数智" 
            active={bottomTab === '数智'} 
            icon={<Grid size={22} />} 
            onClick={() => setBottomTab('数智')}
          />
          <BottomTabItem 
            label="我的" 
            active={bottomTab === '我的'} 
            icon={<User size={22} />} 
            onClick={() => setBottomTab('我的')}
          />
        </footer>

        {isHomeTab && (
          <div
            ref={floatingButtonRef}
            onClick={() => navigate('/root-data')}
            onPointerDown={(event) => {
              const buttonRect = floatingButtonRef.current?.getBoundingClientRect();
              if (!buttonRect) return;
              dragStateRef.current.isDragging = true;
              dragStateRef.current.pointerOffsetX = event.clientX - buttonRect.left;
              dragStateRef.current.pointerOffsetY = event.clientY - buttonRect.top;
            }}
            className="absolute z-[60] flex h-[75px] w-[50px] touch-none flex-col items-center justify-center rounded-[22px] bg-[#C8161D] text-white "
            style={{
              left: `${floatingButtonPos.x}px`,
              top: `${floatingButtonPos.y}px`,
            }}
            role="button"
            tabIndex={0}
            aria-label="创作"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span className="mt-2.5 text-[11px] font-medium leading-none tracking-[0.01em]">创作</span>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 全屏搜索页面 ---
const SearchPage = ({ onClose, rootDataResults = [], userResults = [], onOpenPlayer }) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeSearchTab, setActiveSearchTab] = useState('根数据');
  const handleSearchAction = () => {
    setSearchValue((current) => current.trim());
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };
  const normalizedKeyword = searchValue.trim().toLowerCase();
  const filteredRootDataResults = rootDataResults.filter((item) => {
    if (!normalizedKeyword) return true;

    const searchableText = [
      item.author,
      item.authorRole,
      ...item.tags,
      ...item.videos.flatMap((video) => [video.title, video.agent, video.category]),
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedKeyword);
  });
  const filteredUserResults = userResults.filter((item) => {
    if (!normalizedKeyword) return true;

    return [item.name, item.fans, item.rootDataCount, item.deals]
      .join(' ')
      .toLowerCase()
      .includes(normalizedKeyword);
  });

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen font-sans">
      <style>{SHARED_THEME_STYLES}</style>
      <div className="w-full max-w-[430px] h-screen bg-white flex flex-col shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom duration-300">
        <header className="shrink-0 bg-white">
          <div className="flex items-center px-4 py-3 gap-3">
            <button onClick={onClose} className="p-1 -ml-1 text-[#1F2329]">
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1 h-11 bg-[#F5F6F8] rounded-xl flex items-center px-3 gap-2">
              <Search size={16} className="text-[#8F959E]" />
              <input 
                autoFocus
                className="bg-transparent border-none outline-none text-[15px] flex-1 text-[#1F2329] placeholder:text-[#8F959E]"
                placeholder="搜索感兴趣的内容..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchAction();
                  }
                }}
              />
              {searchValue && (
                <button onClick={() => setSearchValue('')}>
                  <X size={16} className="text-[#8F959E] bg-[#E5E6EB] rounded-full p-0.5" />
                </button>
              )}
            </div>
            <button onClick={handleSearchAction} className="text-[15px] font-medium theme-text">搜索</button>
          </div>

          <nav className="flex h-11 items-center gap-4 bg-white px-4">
            <button
              type="button"
              onClick={() => setActiveSearchTab('根数据')}
              className={`relative flex h-full min-w-[72px] items-center justify-center transition-colors ${
                activeSearchTab === '根数据' ? 'theme-text font-bold' : 'text-[#1F2329]'
              }`}
            >
              <span className={`text-[14px] ${activeSearchTab === '根数据' ? 'font-bold' : 'font-normal'}`}>根数据</span>
              {activeSearchTab === '根数据' && (
                <span className="absolute bottom-[2px] h-[4px] w-[72px] rounded-full theme-bg shadow-[0_1px_4px_rgba(200,22,29,0.3)]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveSearchTab('用户')}
              className={`relative flex h-full min-w-[72px] items-center justify-center transition-colors ${
                activeSearchTab === '用户' ? 'theme-text font-bold' : 'text-[#1F2329]'
              }`}
            >
              <span className={`text-[14px] ${activeSearchTab === '用户' ? 'font-bold' : 'font-normal'}`}>用户</span>
              {activeSearchTab === '用户' && (
                <span className="absolute bottom-[2px] h-[4px] w-[72px] rounded-full theme-bg shadow-[0_1px_4px_rgba(200,22,29,0.3)]" />
              )}
            </button>
          </nav>
        </header>

        <div className="flex-1 overflow-y-auto bg-white no-scrollbar">
          {activeSearchTab === '根数据' && (
            <div className="divide-y divide-[#F5F6F8] bg-white">
              {filteredRootDataResults.length > 0 ? (
                filteredRootDataResults.slice(0, 8).map((item) => (
                  <SearchRootDataCard key={item.id} data={item} onOpenPlayer={onOpenPlayer} />
                ))
              ) : (
                <SearchEmptyState keyword={searchValue} label="根数据" />
              )}
            </div>
          )}

          {activeSearchTab === '用户' && (
            <div className="divide-y divide-[#F5F6F8] bg-white">
              {filteredUserResults.length > 0 ? (
                filteredUserResults.slice(0, 8).map((leader) => (
                  <LeaderItem key={leader.id} leader={leader} />
                ))
              ) : (
                <SearchEmptyState keyword={searchValue} label="用户" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 子组件 ---
const SearchRootDataCard = ({ data, onOpenPlayer }) => {
  const primaryVideo = data.videos[0];

  return (
    <button
      type="button"
      onClick={onOpenPlayer}
      className="block w-full bg-white px-4 py-4 text-left transition-colors active:bg-[#FAFBFE]"
    >
      <div className="flex items-stretch gap-3">
        <div className="relative min-h-[104px] w-[152px] shrink-0 self-stretch overflow-hidden rounded-2xl bg-[#EDEFF5]">
          <img
            src={primaryVideo.cover}
            alt={primaryVideo.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />
          <div className="absolute left-2 top-2 rounded-full bg-white/88 px-2 py-0.5 text-[10px] font-bold theme-text">
            {primaryVideo.category}
          </div>
          <div className="absolute bottom-2 right-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white">
            {primaryVideo.duration}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {data.tags.map((tag) => (
              <span
                key={`${data.id}-${tag}`}
                className="rounded-full bg-[#FCEBEC] px-2 py-0.5 text-[10px] font-semibold theme-text"
              >
                {tag}
              </span>
            ))}
            <span className="rounded-full theme-bg px-2 py-0.5 text-[10px] font-semibold text-white">
              {primaryVideo.agent}
            </span>
          </div>
          <h3 className="line-clamp-2 text-[14px] font-bold leading-[1.45] text-[#1F2329]">
            {primaryVideo.title}
          </h3>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <img
                src={data.authorAvatar}
                alt={data.author}
                className="h-7 w-7 rounded-full object-cover"
                loading="lazy"
              />
              <div className="min-w-0">
                <div className="truncate text-[12px] font-semibold text-[#1F2329]">{data.author}</div>
                <div className="text-[10px] text-[#8F959E]">{data.authorRole}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#8F959E]">
              <span>点赞 {primaryVideo.likes}</span>
              <span>收藏 {primaryVideo.favorites}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

const SearchEmptyState = ({ keyword, label }) => (
  <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FCEBEC]">
      <Search size={20} className="theme-text" />
    </div>
    <div className="text-[15px] font-semibold text-[#1F2329]">暂无相关{label}</div>
    <p className="mt-2 text-[12px] leading-5 text-[#8F959E]">
      {keyword ? `没有找到和“${keyword}”相关的内容，换个关键词试试。` : `先输入关键词，看看匹配到哪些${label}。`}
    </p>
  </div>
);

const DashboardItem = ({ label, value, isTheme }) => (
  <div className="flex flex-col items-center flex-1">
    <span className="text-[10px] text-[#8F959E] mb-[1px]">{label}</span>
    <span className={`text-[13px] font-bold ${isTheme ? 'theme-text' : 'text-[#1F2329]'}`}>{value}</span>
  </div>
);

const TabItem = ({ label, active, onClick }) => (
  <div className="flex-1 flex flex-col items-center justify-center relative cursor-pointer" onClick={onClick}>
    <span className={`text-[14px] transition-colors ${active ? 'theme-text font-bold' : 'text-[#1F2329]'}`}>
      {label}
    </span>
    {active && (
      <div className="absolute bottom-[2px] h-[4px] w-[72px] theme-bg rounded-full shadow-[0_1px_4px_rgba(200,22,29,0.3)]" />
    )}
  </div>
);

const DataCard = ({ data, onOpenPlayer }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoMetrics, setVideoMetrics] = useState(() =>
    Object.fromEntries(
      data.videos.map((video) => [
        video.id,
        {
          likes: parseCountLabel(video.likes),
          favorites: parseCountLabel(video.favorites),
          liked: false,
          favorited: false,
        },
      ])
    )
  );
  const currentVideo = data.videos[activeIndex] ?? data.videos[0];
  const currentVideoMetric = videoMetrics[currentVideo.id] ?? {
    likes: parseCountLabel(currentVideo.likes),
    favorites: parseCountLabel(currentVideo.favorites),
    liked: false,
    favorited: false,
  };
  const openCurrentVideo = (action = 'play') => {
    onOpenPlayer?.({
      action,
      rootId: data.playerRootId,
      sectionKey: currentVideo.playerSectionKey,
      videoId: currentVideo.playerVideoId,
    });
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollLeft = container.scrollLeft;
      const containerCenter = scrollLeft + container.offsetWidth / 2;
      const items = container.querySelectorAll('.snap-item');
      let closestIdx = 0;
      let minDiff = Infinity;
      items.forEach((item, index) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const diff = Math.abs(itemCenter - containerCenter);
        if (diff < minDiff) { minDiff = diff; closestIdx = index; }
      });
      if (closestIdx !== activeIndex) setActiveIndex(closestIdx);
    }
  };

  const handleToggleMetric = (videoId, metricKey) => {
    setVideoMetrics((prev) => {
      const currentMetric = prev[videoId];

      if (!currentMetric) {
        return prev;
      }

      const statusKey = metricKey === 'likes' ? 'liked' : 'favorited';
      const nextActive = !currentMetric[statusKey];
      const delta = nextActive ? 1 : -1;

      return {
        ...prev,
        [videoId]: {
          ...currentMetric,
          [metricKey]: Math.max(0, currentMetric[metricKey] + delta),
          [statusKey]: nextActive,
        },
      };
    });
  };

  return (
    <article className="bg-white py-4">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar gap-3 px-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {data.videos.map((v, idx) => (
          <VideoSlide
            key={v.id}
            video={v}
            isActive={activeIndex === idx}
            onOpenPlayer={() => {
              const selectedVideo = data.videos[idx] ?? currentVideo;

              onOpenPlayer?.({
                action: 'play',
                rootId: data.playerRootId,
                sectionKey: selectedVideo.playerSectionKey,
                videoId: selectedVideo.playerVideoId,
              });
            }}
          />
        ))}
      </div>
      
      <div className="px-4 pt-3">
        <h3 className="text-[15px] font-bold leading-[1.4] line-clamp-2 mb-2 text-[#1F2329]">{currentVideo.title}</h3>
        <div className="mb-2 text-[11px] font-medium tracking-[0.01em] text-gray-400">
          {data.tags.join(' · ')}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full  overflow-hidden bg-[#F5F6F8]">
              <img src={data.authorAvatar} alt={data.author} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium leading-tight text-[#646A73]">{data.author}</span>
              <span className="inline-flex w-fit items-center rounded-[4px] bg-[#FDEBEC] px-2 py-0.5 text-[8px] font-medium leading-none text-[#A4151B]">
                {data.authorRole}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#8F959E]">
            <button
              type="button"
              aria-label="点赞"
              onClick={() => handleToggleMetric(currentVideo.id, 'likes')}
              className={`inline-flex min-w-[52px] items-center gap-1 transition-colors duration-200 ${currentVideoMetric.liked ? 'theme-text' : 'text-[#8F959E]'}`}
            >
              <Heart size={14} fill={currentVideoMetric.liked ? 'currentColor' : 'none'} />
              <span className="w-[30px] text-left text-[12px] tabular-nums">
                {formatCountLabel(currentVideoMetric.likes)}
              </span>
            </button>
            <button
              type="button"
              aria-label="收藏"
              onClick={() => handleToggleMetric(currentVideo.id, 'favorites')}
              className={`inline-flex min-w-[52px] items-center gap-1 transition-colors duration-200 ${currentVideoMetric.favorited ? 'theme-text' : 'text-[#8F959E]'}`}
            >
              <Star size={14} fill={currentVideoMetric.favorited ? 'currentColor' : 'none'} />
              <span className="w-[30px] text-left text-[12px] tabular-nums">
                {formatCountLabel(currentVideoMetric.favorites)}
              </span>
            </button>
            <button
              type="button"
              aria-label="评论"
              onClick={() => openCurrentVideo('comment')}
              className="flex items-center gap-1 transition-colors duration-200 active:text-[#646A73]"
            >
              <MessageSquare size={14} />
              <span className="text-[12px]">{currentVideo.comments}</span>
            </button>
            <button
              type="button"
              aria-label="分享"
              onClick={() => openCurrentVideo('share')}
              className="flex items-center gap-1 transition-colors duration-200 active:text-[#646A73]"
            >
              <Share2 size={14} />
              <span className="text-[12px]">{currentVideo.shares}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const VideoSlide = ({ video, isActive, onOpenPlayer }) => (
  <button
    type="button"
    className="snap-item w-[280px] snap-center relative rounded-xl overflow-hidden bg-[#1A1D21] h-[160px] flex-shrink-0 transition-all duration-300 shadow-md text-left cursor-pointer"
    aria-label={`播放${video.category}视频，来自${video.agent}`}
    onClick={onOpenPlayer}
  >
    <img
      src={video.cover}
      alt={`${video.category}视频封面`}
      className="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-black/55" />
    <div className="absolute left-0 top-0 z-10 rounded-br-lg bg-[#000000]/50 px-3 py-1 text-[10px] font-bold text-white shadow-lg">
      {video.category}
    </div>
    <div className="absolute right-0 top-0 z-10 rounded-bl-lg theme-bg px-3 py-1 text-[10px] font-bold text-white shadow-lg">
      {video.agent}
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-500 ${isActive ? 'bg-white/40 scale-110' : 'bg-white/20'}`}>
        <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[11px] border-l-white border-b-[7px] border-b-transparent ml-1" />
      </div>
    </div>
    <div className="absolute bottom-2.5 right-2.5 bg-black/55 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">{video.duration}</div>
  </button>
);

const LeaderItem = ({ leader }) => (
  <div className="px-4 py-4 flex items-center bg-white active:bg-gray-50 transition-colors">
    <div className="shrink-0 w-[52px] h-[52px] rounded-full overflow-hidden bg-gray-100 shadow-sm border border-[#F0F0F0]">
      <img src={leader.avatar} className="w-full h-full object-cover" alt={leader.name} />
    </div>
    <div className="ml-4 flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[15px] font-bold text-[#1F2329]">{leader.name}</span>
        <div className={`inline-flex h-6 items-center justify-center rounded-full border px-2 text-[12px] leading-none ${leader.isFollowing ? 'bg-[#F5F6F8] text-[#8F959E] border-transparent' : 'bg-white theme-text theme-border'}`}>
          {leader.isFollowing ? '已关注' : '+ 关注'}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatMini label="根数据" val={leader.rootDataCount} />
        <div className="w-[1px] h-2.5 bg-[#E5E6EB]" />
        <StatMini label="成交" val={leader.deals} />
        <div className="w-[1px] h-2.5 bg-[#E5E6EB]" />
        <StatMini label="粉丝" val={leader.fans} />
      </div>
    </div>
  </div>
);

const InstructorItem = ({ instructor }) => (
  <div className="px-4 py-5 bg-white border-b-[0.5px] border-[#F5F6F8] active:bg-gray-50 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="w-[52px] h-[52px] rounded-full overflow-hidden border border-[#F0F0F0] shadow-sm">
          <img src={instructor.avatar} className="w-full h-full object-cover" alt={instructor.name} />
        </div>
        <div className="ml-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-bold text-[#1F2329]">{instructor.name}</span>
            <span className="bg-[#FCEBEC] theme-text text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider">审核通过率 {instructor.passRate}</span>
          </div>
          <p className="text-[10px] text-[#8F959E] mt-0.5 font-medium">数智化认证指导师</p>
        </div>
      </div>
      <div className={`inline-flex h-6 items-center justify-center rounded-full border px-2 text-[12px] font-medium leading-none ${instructor.isFollowing ? 'bg-[#F5F6F8] text-[#8F959E] border-transparent' : 'bg-white theme-text theme-border'}`}>
        {instructor.isFollowing ? '已关注' : '+ 关注'}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-y-3 bg-[#FAFAFA] rounded-xl p-3 mb-4 border border-[#F0F0F0]">
      <StatBox label="根数据数量" val={instructor.rootDataCount} />
      <StatBox label="分享 / 成交" val={`${instructor.shareCount} / ${instructor.shareDealCount}`} />
      <StatBox label="被邀请指导" val={instructor.invitedCount} />
      <StatBox label="指导人数" val={instructor.guidedCount} />
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[#8F959E]">粉丝</span>
        <span className="text-[13px] font-bold text-[#1F2329]">{instructor.fansCount}</span>
      </div>
      <div className="inline-flex h-6 items-center gap-1 rounded-md theme-bg px-2 text-[11px] font-semibold leading-none text-white shadow-sm transition-transform active:scale-95">
        <Zap size={10} className="fill-white" />
        邀请指导
      </div>
    </div>
  </div>
);

const StatMini = ({ label, val }) => (
  <div className="flex items-center">
    <span className="text-[10px] text-[#8F959E] mr-1">{label}</span>
    <span className="text-[12px] font-bold text-[#1F2329]">{val}</span>
  </div>
);

const StatBox = ({ label, val }) => (
  <div className="flex flex-col">
    <span className="text-[9px] text-[#8F959E] mb-0.5">{label}</span>
    <span className="text-[13px] font-bold text-[#1F2329] tracking-tight">{val}</span>
  </div>
);

const BottomTabItem = ({ label, active, icon, onClick }) => (
  <div className="flex-1 flex flex-col items-center justify-center cursor-pointer" onClick={onClick}>
    <div className={`${active ? 'theme-text' : 'text-[#8F959E]'}`}>{icon}</div>
    <span className={`text-[10px] mt-1 font-medium ${active ? 'theme-text' : 'text-[#8F959E]'}`}>{label}</span>
  </div>
);

export default App;
