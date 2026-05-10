import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Eye, Heart, MessageSquare, Pencil, PenLine, Star, Trash2 } from 'lucide-react';
import { TiArrowForward } from 'react-icons/ti';
import {
  VIDEO_COVER_SETS,
  PLAYER_ROOT_IDS,
  PLAYER_SECTION_KEY_BY_CATEGORY,
  getPlayerVideoId,
  getVideoTitle,
  SHARED_THEME_STYLES,
} from './HomePage';

const TOP_LEFT_CATEGORY_BADGE_CLASS = 'absolute left-0 top-0 z-10 rounded-br-lg bg-[#000000]/50 px-3 py-1 text-[10px] font-bold text-white shadow-lg';

const parseCountLabel = (value) => {
  if (typeof value === 'number') return value;
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

// 生成伪随机50字符（根据 id 固定内容）
const RANDOM_CHARS_POOL = '根数据创作初审管理链主企业策划转型升级实战案例经验总结未来打算阅读心得脑图讲解原文数智商业模式战略认知增长方法论执行步骤目标计划实现价值团队协作创新突破成长学习思考总结复盘改进优化协同驱动';
const generateRandomChars = (seed) => {
  let s = Math.abs(seed) || 1;
  const chars = Array.from(RANDOM_CHARS_POOL);
  const result = [];
  for (let i = 0; i < 50; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    result.push(chars[s % chars.length]);
  }
  return result.join('');
};

const VideoSlide = ({ video, isActive, onOpenPlayer }) => (
  <button
    type="button"
    className="snap-item w-[200px] h-[260px] snap-center relative rounded-[10px] overflow-hidden bg-[#1A1D21] flex-shrink-0 transition-all duration-300 shadow-md text-left cursor-pointer"
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
    <div className={TOP_LEFT_CATEGORY_BADGE_CLASS}>{video.category}</div>
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

const DataCard = ({ data, onOpenPlayer, hideAuthor = false, manageBar = null }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
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

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const items = container.querySelectorAll('.snap-item');
    const target = items[1];
    if (target) {
      container.scrollLeft = target.offsetLeft - (container.offsetWidth - target.offsetWidth) / 2;
    }
  }, []);

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
      if (!currentMetric) return prev;
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
        className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar gap-3 px-5"
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
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-[0.01em] text-gray-400">
            {data.tags.join(' · ')}
          </span>
          {data.updatedAt && (
            <span className="text-[11px] font-medium tracking-[0.01em] text-gray-400">
              更新时间：{data.updatedAt}
            </span>
          )}
        </div>
        {!hideAuthor && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F5F6F8]">
              <img src={data.authorAvatar} alt={data.author} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium leading-tight text-[#646A73]">{data.author}</span>
              <span className="inline-flex w-fit items-center rounded-[4px] bg-[#FDEBEC] px-2 py-0.5 text-[8px] font-medium leading-none text-[#A4151B]">
                {data.authorRole}
              </span>
            </div>
          </div>
        )}
        <div className="flex items-center w-full text-[#8F959E]">
          <button
            type="button"
            aria-label="点赞"
            onClick={() => handleToggleMetric(currentVideo.id, 'likes')}
            className={`flex flex-1 items-center justify-center gap-1.5 py-1 transition-colors duration-200 ${currentVideoMetric.liked ? 'theme-text' : 'text-[#8F959E]'}`}
          >
            <Heart size={18} fill={currentVideoMetric.liked ? 'currentColor' : 'none'} />
            <span className="text-[14px] tabular-nums">{formatCountLabel(currentVideoMetric.likes)}</span>
          </button>
          <div className="w-[0.5px] h-4 bg-[#E5E6EB] shrink-0" />
          <button
            type="button"
            aria-label="收藏"
            onClick={() => handleToggleMetric(currentVideo.id, 'favorites')}
            className={`flex flex-1 items-center justify-center gap-1.5 py-1 transition-colors duration-200 ${currentVideoMetric.favorited ? 'theme-text' : 'text-[#8F959E]'}`}
          >
            <Star size={18} fill={currentVideoMetric.favorited ? 'currentColor' : 'none'} />
            <span className="text-[14px] tabular-nums">{formatCountLabel(currentVideoMetric.favorites)}</span>
          </button>
          <div className="w-[0.5px] h-4 bg-[#E5E6EB] shrink-0" />
          <button
            type="button"
            aria-label="评论"
            onClick={() => openCurrentVideo('comment')}
            className="flex flex-1 items-center justify-center gap-1.5 py-1 transition-colors duration-200 active:text-[#646A73]"
          >
            <MessageSquare size={18} />
            <span className="text-[14px]">{currentVideo.comments}</span>
          </button>
          <div className="w-[0.5px] h-4 bg-[#E5E6EB] shrink-0" />
          <button
            type="button"
            aria-label="分享"
            onClick={() => openCurrentVideo('share')}
            className="flex flex-1 items-center justify-center gap-1.5 py-1 transition-colors duration-200 active:text-[#646A73]"
          >
            <TiArrowForward size={20} />
            <span className="text-[14px]">{currentVideo.shares}</span>
          </button>
        </div>
        {manageBar && (
          <div className="mt-3 border-t border-[#F0F1F5] pt-3">
            {manageBar}
          </div>
        )}
      </div>
    </article>
  );
};

// 初审 Tab 卡片：上方50字符 + 下方管理操作区
const DraftReviewCard = ({ data, manageBar }) => {
  const randomChars = useMemo(() => generateRandomChars(data.id), [data.id]);
  return (
    <article className="bg-white py-4 px-4">
      <div className="mb-3">
        <p className="text-[15px] leading-[1.85] text-[#1F2329] tracking-[0.02em] break-all">
          {randomChars}
        </p>
        {data.updatedAt && (
          <p className="mt-1.5 text-right text-[11px] font-medium text-gray-400 tracking-[0.01em]">
            更新时间：{data.updatedAt}
          </p>
        )}
      </div>
      <div className="border-t border-[#F0F1F5] pt-3">
        {manageBar}
      </div>
    </article>
  );
};

const INITIAL_COUNT = 4;
const LOAD_STEP = 4;

const buildMyRootData = () =>
  Array.from({ length: 6 }).map((_, i) => {
    const playerRootId = PLAYER_ROOT_IDS[i % PLAYER_ROOT_IDS.length];
    return {
      id: i + 1,
      playerRootId,
      status: i % 2 === 0 ? '审核中' : '审核通过',
      tags: i % 2 === 0 ? ['企业策划', '转型升级'] : ['数智链', '实战案例'],
      updatedAt: i % 2 === 0 ? '2015-06-12' : '2018-03-08',
      author: '张小飞',
      authorRole: '创始链主',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
      videos: [
        {
          id: `my-v${i}-mind`,
          category: '脑图',
          playerSectionKey: PLAYER_SECTION_KEY_BY_CATEGORY['脑图'],
          playerVideoId: getPlayerVideoId(playerRootId, PLAYER_SECTION_KEY_BY_CATEGORY['脑图']),
          title: getVideoTitle(i, '脑图'),
          agent: '经验总结',
          duration: '01:20',
          likes: i % 2 === 0 ? '1.2k' : '936',
          favorites: i % 2 === 0 ? '568' : '421',
          comments: i % 2 === 0 ? '234' : '168',
          shares: i % 2 === 0 ? '856' : '612',
          cover: VIDEO_COVER_SETS[i % VIDEO_COVER_SETS.length][0],
        },
        {
          id: `my-v${i}-explain`,
          category: '讲解',
          playerSectionKey: PLAYER_SECTION_KEY_BY_CATEGORY['讲解'],
          playerVideoId: getPlayerVideoId(playerRootId, PLAYER_SECTION_KEY_BY_CATEGORY['讲解']),
          title: getVideoTitle(i, '讲解'),
          agent: '经验总结',
          duration: '03:45',
          likes: i % 2 === 0 ? '1.5k' : '1.1k',
          favorites: i % 2 === 0 ? '826' : '644',
          comments: i % 2 === 0 ? '312' : '205',
          shares: i % 2 === 0 ? '924' : '688',
          cover: VIDEO_COVER_SETS[i % VIDEO_COVER_SETS.length][1],
        },
        {
          id: `my-v${i}-source`,
          category: '原文',
          playerSectionKey: PLAYER_SECTION_KEY_BY_CATEGORY['原文'],
          playerVideoId: getPlayerVideoId(playerRootId, PLAYER_SECTION_KEY_BY_CATEGORY['原文']),
          title: getVideoTitle(i, '原文'),
          agent: '经验总结',
          duration: '05:15',
          likes: i % 2 === 0 ? '978' : '742',
          favorites: i % 2 === 0 ? '435' : '389',
          comments: i % 2 === 0 ? '186' : '142',
          shares: i % 2 === 0 ? '633' : '508',
          cover: VIDEO_COVER_SETS[i % VIDEO_COVER_SETS.length][2],
        },
      ],
    };
  });

const StatusBadge = ({ status }) => {
  if (status === '审核通过') {
    return (
      <span className="inline-flex items-center gap-1 rounded-[8px] bg-[#F0FFF4]  px-2.5 py-1 text-[11px] font-semibold text-[#389E0D]">
        <CheckCircle2 size={13} strokeWidth={2.2} />
        审核通过
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-[8px] bg-[#FFF7E6]  px-2.5 py-1 text-[11px] font-semibold text-[#D46B08]">
      <Clock size={13} strokeWidth={2.2} />
      审核中
    </span>
  );
};

const ManageBar = ({ status, onView, onEdit, onDelete, onCreate }) => (
  <div className="flex flex-col gap-2">
    {onCreate && status === '审核通过' && (
      <div
        onClick={onCreate}
        className="flex items-center justify-center gap-1.5 w-full rounded-[8px] bg-[#C8161D] py-2 text-[12px] font-semibold text-white active:opacity-80 transition-opacity cursor-pointer"
      >
        <PenLine size={13} strokeWidth={2} />
        创作
      </div>
    )}
    <div className="flex items-center justify-between">
      <StatusBadge status={status} />
      <div className="flex items-center gap-2">
        <div
          onClick={onView}
          className="inline-flex items-center gap-1 rounded-[8px] border border-[#E5E6EB] bg-white px-3 py-1 text-[12px] font-medium text-[#646A73] active:bg-[#F5F6F8] transition-colors cursor-pointer"
        >
          <Eye size={13} strokeWidth={2} />
          查看
        </div>
        <div
          onClick={onEdit}
          className="inline-flex items-center gap-1 rounded-[8px] border border-[#E5E6EB] bg-white px-3 py-1 text-[12px] font-medium text-[#646A73] active:bg-[#F5F6F8] transition-colors cursor-pointer"
        >
          <Pencil size={13} strokeWidth={2} />
          编辑
        </div>
        <div
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-[8px] bg-[#C8161D] px-3 py-1 text-[12px] font-medium text-white active:opacity-80 transition-opacity cursor-pointer"
        >
          <Trash2 size={13} strokeWidth={2} />
          删除
        </div>
      </div>
    </div>
  </div>
);

const DeleteConfirmDialog = ({ onConfirm, onCancel }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
    <div className="w-full rounded-2xl bg-white px-6 py-6 shadow-xl">
      <div className="mb-1 text-[16px] font-bold text-[#1F2329]">确认删除</div>
      <p className="mb-5 text-[13px] leading-[1.6] text-[#8F959E]">
        删除后该根数据将无法恢复，确定要删除吗？
      </p>
      <div className="flex gap-3">
        <div
          onClick={onCancel}
          className="flex flex-1 h-[42px] items-center justify-center rounded-xl border border-[#E5E6EB] text-[14px] font-bold text-[#646A73] cursor-pointer active:bg-[#F5F6F8] transition-colors"
        >
          取消
        </div>
        <div
          onClick={onConfirm}
          className="flex flex-1 h-[42px] items-center justify-center rounded-xl bg-[#C8161D] text-[14px] font-bold text-white cursor-pointer active:opacity-80 transition-opacity"
        >
          确认删除
        </div>
      </div>
    </div>
  </div>
);

const ReviewingDialog = ({ onClose }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
    <div className="w-full rounded-2xl bg-white px-6 py-6 shadow-xl">
      <div className="mb-1 text-[16px] font-bold text-[#1F2329]">暂时无法编辑</div>
      <p className="mb-5 text-[13px] leading-[1.6] text-[#8F959E]">
        该根数据正在审核中，审核通过后即可进行编辑操作，请耐心等待。
      </p>
      <div
        onClick={onClose}
        className="flex h-[42px] w-full items-center justify-center rounded-xl bg-[#C8161D] text-[14px] font-bold text-white cursor-pointer active:opacity-80 transition-opacity"
      >
        知道了
      </div>
    </div>
  </div>
);

const MyRootDataPage = () => {
  const navigate = useNavigate();
  const [myData, setMyData] = useState(buildMyRootData);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [showReviewingDialog, setShowReviewingDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [activePageTab, setActivePageTab] = useState('creation');

  const openPlayer = ({ action = 'play', rootId, sectionKey, videoId } = {}) => {
    navigate('/player', {
      state: rootId && sectionKey
        ? { action, rootId, sectionKey, videoId }
        : undefined,
    });
  };

  const handleView = (content = '') => {
    navigate('/root-data-draft', { state: { mode: 'view', content } });
  };

  const handleEdit = (status, content = '') => {
    if (status === '审核中') {
      setShowReviewingDialog(true);
      return;
    }
    navigate('/root-data-draft', { state: { mode: 'edit', content } });
  };

  const handleCreate = () => {
    navigate('/root-data');
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    setMyData((prev) => prev.filter((d) => d.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen font-sans">
      <style>{SHARED_THEME_STYLES}</style>
      <div className="w-full max-w-[430px] h-screen bg-white flex flex-col shadow-2xl relative overflow-hidden text-[#1F2329]">
        {deleteTargetId !== null && (
          <DeleteConfirmDialog
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTargetId(null)}
          />
        )}
        {showReviewingDialog && <ReviewingDialog onClose={() => setShowReviewingDialog(false)} />}

        {/* 顶部导航栏 */}
        <header className="bg-white px-4 py-3 flex items-center border-b border-[#F0F1F2] shrink-0 sticky top-0 z-50">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 active:bg-[#F5F6F7] rounded-full"
            aria-label="返回"
          >
            <ArrowLeft size={22} className="text-[#1F2329]" />
          </button>
          <span className="font-bold text-[17px] ml-1">根数据管理</span>
        </header>

        {/* Tab 切换栏 */}
        <div className="flex shrink-0 bg-white">
          {[
            { key: 'creation', label: '创作' },
            { key: 'review', label: '初审' },
          ].map((tab) => {
            const isActive = activePageTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActivePageTab(tab.key)}
                className={`flex-1 py-3 text-[15px] transition-colors duration-200 relative ${
                  isActive
                    ? 'font-extrabold text-[#C8161D]'
                    : 'font-medium text-[#8F959E]'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[2.5px] rounded-full bg-[#C8161D]" />
                )}
              </button>
            );
          })}
        </div>

        {/* 创作 Tab */}
        {activePageTab === 'creation' && (
          <main className="flex-1 overflow-y-auto no-scrollbar bg-white">
            <div className="divide-y divide-[#F0F1F5]">
              {myData.slice(0, visibleCount).map((item) => (
                <DataCard
                  key={item.id}
                  data={item}
                  hideAuthor
                  onOpenPlayer={openPlayer}
                  manageBar={
                    <ManageBar
                      status={item.status}
                      onView={handleView}
                      onEdit={() => handleEdit(item.status)}
                      onDelete={() => handleDelete(item.id)}
                    />
                  }
                />
              ))}
            </div>
            {visibleCount < myData.length && (
              <div className="bg-white px-4 py-5">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => Math.min(c + LOAD_STEP, myData.length))}
                  className="flex w-full items-center justify-center py-2 text-[15px] font-bold theme-text transition-opacity duration-200 active:opacity-70"
                >
                  点击加载更多
                </button>
              </div>
            )}
            <div className="h-10" />
          </main>
        )}

        {/* 初审 Tab */}
        {activePageTab === 'review' && (
          <main className="flex-1 overflow-y-auto no-scrollbar bg-white">
            <div className="divide-y divide-[#F0F1F5]">
              {myData.slice(0, visibleCount).map((item) => {
                const reviewContent = generateRandomChars(item.id);
                return (
                  <DraftReviewCard
                    key={item.id}
                    data={item}
                    manageBar={
                      <ManageBar
                        status={item.status}
                        onView={() => handleView(reviewContent)}
                        onEdit={() => handleEdit(item.status, reviewContent)}
                        onDelete={() => handleDelete(item.id)}
                        onCreate={handleCreate}
                      />
                    }
                  />
                );
              })}
            </div>
            {visibleCount < myData.length && (
              <div className="bg-white px-4 py-5">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => Math.min(c + LOAD_STEP, myData.length))}
                  className="flex w-full items-center justify-center py-2 text-[15px] font-bold theme-text transition-opacity duration-200 active:opacity-70"
                >
                  点击加载更多
                </button>
              </div>
            )}
            <div className="h-10" />
          </main>
        )}
      </div>
    </div>
  );
};

export default MyRootDataPage;
