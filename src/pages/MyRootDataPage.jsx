import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Eye, Pencil, Trash2 } from 'lucide-react';
import {
  DataCard,
  VIDEO_COVER_SETS,
  PLAYER_ROOT_IDS,
  PLAYER_SECTION_KEY_BY_CATEGORY,
  getPlayerVideoId,
  getVideoTitle,
  SHARED_THEME_STYLES,
} from './HomePage';

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
          agent: '未来打算',
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
          agent: '阅读心得',
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

const ManageBar = ({ status, onView, onEdit, onDelete }) => (
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

  const openPlayer = ({ action = 'play', rootId, sectionKey, videoId } = {}) => {
    navigate('/player', {
      state: rootId && sectionKey
        ? { action, rootId, sectionKey, videoId }
        : undefined,
    });
  };

  const handleEdit = (status) => {
    if (status === '审核中') {
      setShowReviewingDialog(true);
      return;
    }
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
                    onView={() =>
                      openPlayer({
                        action: 'play',
                        rootId: item.playerRootId,
                        sectionKey: PLAYER_SECTION_KEY_BY_CATEGORY['脑图'],
                        videoId: getPlayerVideoId(item.playerRootId, PLAYER_SECTION_KEY_BY_CATEGORY['脑图']),
                      })
                    }
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
      </div>
    </div>
  );
};

export default MyRootDataPage;
