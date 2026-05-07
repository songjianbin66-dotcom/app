import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Play,
  Share2,
  Star,
  X,
} from 'lucide-react';
import './player.css';

const sectionTabs = [
  { key: 'mindmap', label: '脑图' },
  { key: 'original', label: '原文' },
  { key: 'lecture', label: '讲解' },
];

const okStampStyle = {
  className: 'ok-stamp',
  extra: {},
};

const sampleVideos = [
  'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4',
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
  'https://media.w3.org/2010/05/bunny/trailer.mp4',
];

const makeVideo = (id, title, sourceIndex, duration) => ({
  id,
  title,
  duration,
  source: sampleVideos[sourceIndex % sampleVideos.length],
});

function makeMindmapContent(action, keyPoint, target, goal) {
  return {
    action,
    keyPoint,
    target,
    situation: '数智化转型进入深水区，团队需要把零散经验沉淀成可复用资产',
    advantage: '内容、数据和协作网络',
    principle: '先结构化，再视频化，最后持续复盘',
    method: '根数据拆解法',
    steps: ['明确核心目标', '拆出关键节点', '绑定视频讲解', '通过评论和收藏验证价值'],
    time: '30 天',
    goal,
  };
}

function makeOriginalContent(title, focus) {
  return `
    <p>${title} 的核心，是把原本散落在经验、会议和内容里的知识，整理成可以播放、可以复盘、可以协作传播的根数据。</p>
    <p>在这个过程中，${focus} 不是一句口号，而是一套可以被反复训练的工作方式。每个节点都需要对应清晰的表达、真实的视频材料，以及能够被用户理解的行动路径。</p>
    <p>当脑图负责结构，原文负责语义，讲解负责传递时，一条根数据就能从“信息”变成“可执行的资产”。</p>
  `;
}

function makeLectureContent(...items) {
  return items.map((content, index) => ({
    id: `lecture-note-${index + 1}`,
    content,
  }));
}

const rootDataFeed = [
  {
    id: 'root-001',
    title: '产业数智链增长模型',
    creator: '史教授数智课',
    avatar: '史',
    avatarUrl: 'https://i.pravatar.cc/100?img=12',
    sections: {
      mindmap: {
        title: '战略拆解脑图',
        content: makeMindmapContent('建设产业数智链', '增长飞轮', '产业协作团队', '形成可持续成交闭环'),
        videos: [
          makeVideo('root-001-mindmap-1', '总览：增长飞轮脑图', 0, '02:18'),
          makeVideo('root-001-mindmap-2', '节点：资源到资产', 1, '03:06'),
          makeVideo('root-001-mindmap-3', '路径：成交闭环', 2, '02:42'),
        ],
        stats: { likes: '2.4w', comments: '842', favorites: '1.2w', shares: '转发' },
        comments: [
          makeComment(1, '访客', '访', 5, '这张脑图把复杂逻辑压得很清楚，能直接拿去复盘。'),
          makeComment(2, '项目同事', '同', 15, '左右切换部分以后，学习节奏会更自然。'),
        ],
      },
      original: {
        title: '原文：产业升级的关键表述',
        content: makeOriginalContent('产业数智链增长模型', '增长飞轮'),
        videos: [
          makeVideo('root-001-original-1', '原文逐句阅读', 1, '04:10'),
          makeVideo('root-001-original-2', '重点段落标注', 2, '02:56'),
        ],
        stats: { likes: '1.8w', comments: '526', favorites: '9.6k', shares: '转发' },
        comments: [
          makeComment(3, '产品经理', '产', 24, '原文和讲解分开后，对比理解更轻松。'),
          makeComment(4, '学习者', '学', 31, '这一段适合配合脑图反复看。'),
        ],
      },
      lecture: {
        title: '讲解：从根数据到行动方案',
        content: makeLectureContent(
          '先解释根数据的定义：它不是单条视频，而是一组能够互相证明、互相补充的内容结构。',
          '再拆落地动作：从脑图到原文，再到讲解，每一步都要能支撑用户继续理解。',
          '最后看复盘指标：点赞、收藏、评论和分享分别反映不同层面的价值反馈。'
        ),
        videos: [
          makeVideo('root-001-lecture-1', '讲解一：定义根数据', 2, '05:15'),
          makeVideo('root-001-lecture-2', '讲解二：落地动作', 0, '04:38'),
          makeVideo('root-001-lecture-3', '讲解三：复盘指标', 1, '03:44'),
        ],
        stats: { likes: '3.1w', comments: '1.1k', favorites: '1.7w', shares: '转发' },
        comments: [
          makeComment(5, '体验官', '验', 23, '讲解视频更像是把方法真正讲活了。'),
          makeComment(6, '业务负责人', '业', 44, '可以直接作为团队培训材料。'),
        ],
      },
    },
  },
  {
    id: 'root-002',
    title: 'AI 协作工作流',
    creator: '用户协作分享',
    avatar: '协',
    avatarUrl: 'https://i.pravatar.cc/100?img=32',
    sections: {
      mindmap: {
        title: '脑图：人机协同路径',
        content: makeMindmapContent('搭建 AI 协作流程', '任务拆分', '知识工作者', '让复杂任务稳定交付'),
        videos: [
          makeVideo('root-002-mindmap-1', '协作链路总览', 1, '02:32'),
          makeVideo('root-002-mindmap-2', '任务拆分方法', 0, '03:28'),
        ],
        stats: { likes: '5.2k', comments: '342', favorites: '982', shares: '转发' },
        comments: [makeComment(7, '设计师', '设', 16, '横向三段切换很符合学习时的思路。')],
      },
      original: {
        title: '原文：提示词协作原则',
        content: makeOriginalContent('AI 协作工作流', '任务拆分'),
        videos: [
          makeVideo('root-002-original-1', '原文精读', 2, '04:01'),
          makeVideo('root-002-original-2', '规则摘录', 1, '03:16'),
          makeVideo('root-002-original-3', '案例复盘', 0, '02:49'),
        ],
        stats: { likes: '7.8k', comments: '419', favorites: '1.4k', shares: '转发' },
        comments: [makeComment(8, '运营同学', '运', 9, '原文部分单独收藏很有必要。')],
      },
      lecture: {
        title: '讲解：把提示词变成流程',
        content: makeLectureContent(
          '把提示词从一次性输入，升级成团队可复用的流程模板，是 AI 协作真正提效的关键。'
        ),
        videos: [makeVideo('root-002-lecture-1', '流程搭建实操', 0, '06:20')],
        stats: { likes: '1.1w', comments: '608', favorites: '2.3k', shares: '转发' },
        comments: [makeComment(9, '创业者', '创', 37, '这段讲解最适合给新人看。')],
      },
    },
  },
  {
    id: 'root-003',
    title: '品牌内容成交路径',
    creator: '片场速递',
    avatar: '片',
    avatarUrl: 'https://i.pravatar.cc/100?img=47',
    sections: {
      mindmap: {
        title: '脑图：内容到成交',
        content: makeMindmapContent('设计内容成交路径', '信任建立', '品牌内容团队', '提升内容转化效率'),
        videos: [makeVideo('root-003-mindmap-1', '成交路径脑图', 2, '02:44')],
        stats: { likes: '8.8k', comments: '126', favorites: '3.4k', shares: '转发' },
        comments: [makeComment(10, '内容策划', '策', 49, '这个脑图适合做复盘模板。')],
      },
      original: {
        title: '原文：用户信任建立',
        content: makeOriginalContent('品牌内容成交路径', '用户信任建立'),
        videos: [
          makeVideo('root-003-original-1', '信任建立原文', 0, '03:05'),
          makeVideo('root-003-original-2', '成交话术原文', 1, '03:50'),
        ],
        stats: { likes: '6.6k', comments: '233', favorites: '1.9k', shares: '转发' },
        comments: [makeComment(11, '销售顾问', '销', 20, '原文可以直接摘到脚本里。')],
      },
      lecture: {
        title: '讲解：短视频成交拆解',
        content: makeLectureContent(
          '开场需要先建立问题意识，让用户知道这条内容为什么和自己有关。',
          '转化节点不是硬推销，而是把信任、证据和行动建议自然连接起来。'
        ),
        videos: [
          makeVideo('root-003-lecture-1', '开场结构拆解', 1, '04:27'),
          makeVideo('root-003-lecture-2', '转化节点拆解', 2, '05:02'),
        ],
        stats: { likes: '1.6w', comments: '734', favorites: '5.8k', shares: '转发' },
        comments: [makeComment(12, '品牌主理人', '品', 28, '讲解把成交链路讲得很细。')],
      },
    },
  },
];

function makeComment(id, author, avatar, imageIndex, content) {
  return {
    id,
    author,
    avatar,
    avatarUrl: `https://i.pravatar.cc/100?img=${imageIndex}`,
    content,
  };
}

const makeSectionStateKey = (rootId, sectionKey) => `${rootId}-${sectionKey}`;
const makeVideoRefKey = (rootId, sectionKey, videoId) =>
  `${rootId}-${sectionKey}-${videoId}`;

function App() {
  const navigate = useNavigate();
  const scrollerRef = useRef(null);
  const rootScrollTimeoutRef = useRef(null);
  const sectionScrollTimeoutRefs = useRef({});
  const sectionScrollerRefs = useRef({});
  const videoRefs = useRef({});
  const [activeRootIndex, setActiveRootIndex] = useState(0);
  const [activeSectionKeyByRootId, setActiveSectionKeyByRootId] = useState({});
  const [activeVideoIndexBySectionId, setActiveVideoIndexBySectionId] = useState({});
  const [pausedStates, setPausedStates] = useState({});
  const [likedStates, setLikedStates] = useState({ 'root-001-mindmap': true });
  const [starredStates, setStarredStates] = useState({});
  const [activeSheet, setActiveSheet] = useState(null);
  const [preview, setPreview] = useState(null);
  const [avatarLoadErrors, setAvatarLoadErrors] = useState({});

  const currentRoot = rootDataFeed[activeRootIndex];
  const currentSectionKey = getActiveSectionKey(currentRoot, activeSectionKeyByRootId);
  const currentSection = currentRoot.sections[currentSectionKey];
  const currentSectionStateKey = makeSectionStateKey(currentRoot.id, currentSectionKey);
  const currentVideoIndex = getActiveVideoIndex(
    activeVideoIndexBySectionId,
    currentSectionStateKey,
    currentSection.videos.length
  );
  const currentVideo = currentSection.videos[currentVideoIndex] ?? currentSection.videos[0];
  const currentVisibleVideoKey = currentVideo
    ? makeVideoRefKey(currentRoot.id, currentSectionKey, currentVideo.id)
    : '';

  const currentComments = currentSection.comments;
  const selectedSectionLabel = sectionTabs.find((tab) => tab.key === currentSectionKey)?.label;
  const previewRoot = preview
    ? rootDataFeed.find((root) => root.id === preview.rootId)
    : null;
  const previewSection = previewRoot?.sections[preview?.sectionKey];

  const visibleSectionKeys = useMemo(
    () =>
      rootDataFeed.map((root) => ({
        rootId: root.id,
        sectionKey: getActiveSectionKey(root, activeSectionKeyByRootId),
      })),
    [activeSectionKeyByRootId]
  );

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([key, video]) => {
      if (!video) {
        return;
      }

      const shouldPlay =
        !preview &&
        key === currentVisibleVideoKey &&
        !pausedStates[currentSectionStateKey];

      if (shouldPlay) {
        video
          .play()
          .catch(() => {
            setPausedStates((prev) => ({ ...prev, [currentSectionStateKey]: true }));
          });
      } else {
        video.pause();
      }
    });
  }, [currentSectionStateKey, currentVisibleVideoKey, pausedStates, preview]);

  useEffect(() => {
    visibleSectionKeys.forEach(({ rootId, sectionKey }) => {
      const scroller = sectionScrollerRefs.current[rootId];
      const sectionIndex = sectionTabs.findIndex((tab) => tab.key === sectionKey);

      if (scroller && sectionIndex >= 0) {
        scroller.scrollTo({
          left: sectionIndex * scroller.clientWidth,
          behavior: 'smooth',
        });
      }
    });
  }, [visibleSectionKeys]);

  useEffect(() => {
    return () => {
      if (rootScrollTimeoutRef.current) {
        window.clearTimeout(rootScrollTimeoutRef.current);
      }
      Object.values(sectionScrollTimeoutRefs.current).forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  const handleRootScroll = () => {
    if (!scrollerRef.current) {
      return;
    }

    if (rootScrollTimeoutRef.current) {
      window.clearTimeout(rootScrollTimeoutRef.current);
    }

    rootScrollTimeoutRef.current = window.setTimeout(() => {
      const container = scrollerRef.current;
      const nextIndex = Math.round(container.scrollTop / container.clientHeight);
      const safeIndex = clamp(nextIndex, 0, rootDataFeed.length - 1);
      const nextRoot = rootDataFeed[safeIndex];
      const nextSectionKey = getActiveSectionKey(nextRoot, activeSectionKeyByRootId);

      setActiveRootIndex(safeIndex);
      setPausedStates((prev) => ({
        ...prev,
        [makeSectionStateKey(nextRoot.id, nextSectionKey)]: false,
      }));
    }, 100);
  };

  const handleSectionScroll = (root) => {
    const scroller = sectionScrollerRefs.current[root.id];
    if (!scroller) {
      return;
    }

    if (sectionScrollTimeoutRefs.current[root.id]) {
      window.clearTimeout(sectionScrollTimeoutRefs.current[root.id]);
    }

    sectionScrollTimeoutRefs.current[root.id] = window.setTimeout(() => {
      const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
      const safeIndex = clamp(nextIndex, 0, sectionTabs.length - 1);
      const nextSectionKey = sectionTabs[safeIndex].key;

      setActiveSectionKeyByRootId((prev) => ({
        ...prev,
        [root.id]: nextSectionKey,
      }));
      setPausedStates((prev) => ({
        ...prev,
        [makeSectionStateKey(root.id, nextSectionKey)]: false,
      }));
    }, 80);
  };

  const setSection = (root, sectionKey) => {
    setActiveSectionKeyByRootId((prev) => ({ ...prev, [root.id]: sectionKey }));
    setPausedStates((prev) => ({
      ...prev,
      [makeSectionStateKey(root.id, sectionKey)]: false,
    }));
  };

  const togglePlayback = (root, sectionKey) => {
    const sectionStateKey = makeSectionStateKey(root.id, sectionKey);
    setActiveRootIndex(rootDataFeed.findIndex((item) => item.id === root.id));
    setActiveSectionKeyByRootId((prev) => ({ ...prev, [root.id]: sectionKey }));
    setPausedStates((prev) => ({ ...prev, [sectionStateKey]: !prev[sectionStateKey] }));
  };

  const toggleLike = () => {
    setLikedStates((prev) => ({
      ...prev,
      [currentSectionStateKey]: !prev[currentSectionStateKey],
    }));
  };

  const toggleFavorite = () => {
    setStarredStates((prev) => ({
      ...prev,
      [currentSectionStateKey]: !prev[currentSectionStateKey],
    }));
  };

  const selectVideo = (videoIndex) => {
    setActiveVideoIndexBySectionId((prev) => ({
      ...prev,
      [currentSectionStateKey]: videoIndex,
    }));
    setPausedStates((prev) => ({ ...prev, [currentSectionStateKey]: false }));
    setActiveSheet(null);
  };

  const openPreview = (root, sectionKey) => {
    setActiveSheet(null);
    setPausedStates((prev) => ({
      ...prev,
      [makeSectionStateKey(root.id, sectionKey)]: true,
    }));
    setPreview({ rootId: root.id, sectionKey });
  };

  const closePreview = () => {
    if (preview) {
      setPausedStates((prev) => ({
        ...prev,
        [makeSectionStateKey(preview.rootId, preview.sectionKey)]: false,
      }));
    }
    setPreview(null);
  };

  const handleAvatarError = (key) => {
    setAvatarLoadErrors((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="page-shell player-page-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <main className="app-container">
        <button
          aria-label="返回首页"
          className="player-route-back"
          onClick={handleBack}
          type="button"
        >
          <ChevronLeft size={22} />
        </button>
        {/* <div className="root-count-pill">
          根数据 {activeRootIndex + 1} / {rootDataFeed.length}
        </div> */}

        <div
          className="video-scroller"
          onScroll={handleRootScroll}
          ref={scrollerRef}
        >
          {rootDataFeed.map((root, rootIndex) => {
            const activeSectionKey = getActiveSectionKey(root, activeSectionKeyByRootId);

            return (
              <section className="video-slide" key={root.id}>
                <div
                  className="section-scroller"
                  onScroll={() => handleSectionScroll(root)}
                  ref={(node) => {
                    if (node) {
                      sectionScrollerRefs.current[root.id] = node;
                    }
                  }}
                >
                  {sectionTabs.map((tab) => {
                    const section = root.sections[tab.key];
                    const sectionStateKey = makeSectionStateKey(root.id, tab.key);
                    const videoIndex = getActiveVideoIndex(
                      activeVideoIndexBySectionId,
                      sectionStateKey,
                      section.videos.length
                    );
                    const video = section.videos[videoIndex] ?? section.videos[0];
                    const videoRefKey = makeVideoRefKey(root.id, tab.key, video.id);
                    const isPaused =
                      rootIndex === activeRootIndex &&
                      tab.key === activeSectionKey &&
                      pausedStates[sectionStateKey];

                    return (
                      <article
                        className="section-panel"
                        key={tab.key}
                        onClick={() => togglePlayback(root, tab.key)}
                      >
                        <video
                          className="video-player"
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          ref={(node) => {
                            if (node) {
                              videoRefs.current[videoRefKey] = node;
                            } else {
                              delete videoRefs.current[videoRefKey];
                            }
                          }}
                          src={video.source}
                        />

                        <div className="v-overlay" />

                        <div className={`play-status-hint ${isPaused ? 'show' : ''}`}>
                          <Play size={28} fill="white" color="white" />
                        </div>

                        <div className="video-meta">
                          <button
                            className="title-link"
                            onClick={(event) => {
                              event.stopPropagation();
                              openPreview(root, tab.key);
                            }}
                            type="button"
                          >
                            <span>{section.title}</span>
                            <ChevronRight size={16} strokeWidth={2.5} />
                          </button>

                          <div className="creator-row">
                            <Avatar
                              alt={root.creator}
                              fallback={root.avatar}
                              imageUrl={root.avatarUrl}
                              imageErrorKey={`creator-${root.id}`}
                              loadErrors={avatarLoadErrors}
                              onError={handleAvatarError}
                              type="creator"
                            />
                            <span className="creator-name">{root.creator}</span>
                          </div>

                          <p className="root-title">{root.title}</p>

                          <div
                            className="episode-badge"
                            onClick={(event) => {
                              event.stopPropagation();
                              setActiveSheet('episode');
                            }}
                          >
                            第 {videoIndex + 1} 个视频 / 共 {section.videos.length} 个
                            <ChevronRight size={12} strokeWidth={3} />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div
                  className="section-tabs"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  {sectionTabs.map((tab) => (
                    <button
                      className={`section-tab ${tab.key === activeSectionKey ? 'active' : ''}`}
                      key={tab.key}
                      onClick={() => setSection(root, tab.key)}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div
          className="side-actions"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <ActionButton
            active={likedStates[currentSectionStateKey]}
            label={currentSection.stats.likes}
            onClick={toggleLike}
            title="点赞"
          >
            <Heart
              fill={likedStates[currentSectionStateKey] ? 'currentColor' : 'none'}
              size={28}
            />
          </ActionButton>

          <ActionButton
            label={currentSection.stats.comments}
            onClick={() => setActiveSheet('comment')}
            title="评论"
          >
            <MessageCircle size={28} />
          </ActionButton>

          <ActionButton
            activeStar={starredStates[currentSectionStateKey]}
            label={currentSection.stats.favorites}
            onClick={toggleFavorite}
            title="收藏"
          >
            <Star
              fill={starredStates[currentSectionStateKey] ? 'currentColor' : 'none'}
              size={28}
            />
          </ActionButton>

          <ActionButton label={currentSection.stats.shares} onClick={() => {}} title="分享">
            <Share2 size={28} />
          </ActionButton>
        </div>

        <button
          aria-hidden={activeSheet === null}
          className={`overlay-mask ${activeSheet ? 'active' : ''}`}
          onClick={() => setActiveSheet(null)}
          type="button"
        />

        <BottomSheet
          open={activeSheet === 'episode'}
          title={`${selectedSectionLabel}视频 (${currentSection.videos.length})`}
          onClose={() => setActiveSheet(null)}
        >
          <div className="episode-list">
            {currentSection.videos.map((video, index) => (
              <button
                className={`video-choice ${index === currentVideoIndex ? 'active' : ''}`}
                key={video.id}
                onClick={() => selectVideo(index)}
                type="button"
              >
                <span className="video-choice-index">{index + 1}</span>
                <span className="video-choice-title">{video.title}</span>
                <span className="video-choice-duration">{video.duration}</span>
              </button>
            ))}
          </div>
        </BottomSheet>

        <BottomSheet
          open={activeSheet === 'comment'}
          title={`评论 (${currentSection.stats.comments})`}
          onClose={() => setActiveSheet(null)}
        >
          <div className="comment-scroll">
            {currentComments.map((comment) => (
              <article className="comment-item" key={comment.id}>
                <Avatar
                  alt={comment.author}
                  fallback={comment.avatar}
                  imageUrl={comment.avatarUrl}
                  imageErrorKey={`comment-${comment.id}`}
                  loadErrors={avatarLoadErrors}
                  onError={handleAvatarError}
                  type="comment"
                />
                <div className="comment-body">
                  <div className="comment-author">{comment.author}</div>
                  <div className="comment-content">{comment.content}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="comment-input-bar">
            <input className="comment-input" placeholder="发表评论..." type="text" />
          </div>
        </BottomSheet>

        {previewRoot && previewSection ? (
          <ContentPreviewPage
            onClose={closePreview}
            root={previewRoot}
            section={previewSection}
            sectionKey={preview.sectionKey}
          />
        ) : null}
      </main>
    </div>
  );
}

function getActiveSectionKey(root, activeSectionKeyByRootId) {
  return activeSectionKeyByRootId[root.id] ?? 'mindmap';
}

function getActiveVideoIndex(activeVideoIndexBySectionId, sectionStateKey, total) {
  return clamp(activeVideoIndexBySectionId[sectionStateKey] ?? 0, 0, Math.max(total - 1, 0));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function Avatar({
  alt,
  fallback,
  imageErrorKey,
  imageUrl,
  loadErrors,
  onError,
  type,
}) {
  const className = type === 'comment' ? 'comment-avatar' : 'creator-avatar';
  const hasError = loadErrors[imageErrorKey];

  return (
    <div className={className}>
      {!hasError ? (
        <img
          alt={alt}
          className="avatar-image"
          onError={() => onError(imageErrorKey)}
          src={imageUrl}
        />
      ) : null}
      {hasError ? fallback : null}
    </div>
  );
}

function ContentPreviewPage({ onClose, section, sectionKey }) {
  return (
    <section className="content-preview-page">
      <header className="content-preview-header">
        <button
          aria-label="返回播放页"
          className="preview-back-button"
          onClick={onClose}
          type="button"
        >
          <ChevronLeft size={22} />
        </button>
        <h2>{section.title}</h2>
      </header>

      <div className="content-preview-body">
        {sectionKey === 'mindmap' ? (
          <MindmapPreview
            content={section.content}
            okStyle={okStampStyle}
          />
        ) : null}
        {sectionKey === 'original' ? (
          <OriginalPreview content={section.content} />
        ) : null}
        {sectionKey === 'lecture' ? (
          <LecturePreview content={section.content} videos={section.videos} />
        ) : null}
      </div>

    </section>
  );
}

function MindmapPreview({ content, okStyle }) {
  return (
    <article className="mindmap-preview mindmap-preview-template">
      <div className="mindmap-watermark" aria-hidden="true">
        <span className={okStyle.className} style={okStyle.extra}>
          OK
        </span>
      </div>

      <div className="mindmap-preview-content">
        <p>
          做 <PreviewMark>{content.action}</PreviewMark> 事，关键在于{' '}
          <PreviewMark>{content.keyPoint}</PreviewMark>。
        </p>
        <p>
          要针对 <PreviewMark>{content.target}</PreviewMark>，鉴于{' '}
          <PreviewMark>{content.situation}</PreviewMark> 的形势，发挥{' '}
          <PreviewMark>{content.advantage}</PreviewMark> 的优势。
        </p>
        <p>
          本着 <PreviewMark>{content.principle}</PreviewMark> 的原则，运用{' '}
          <PreviewMark>{content.method}</PreviewMark> 的方法，通过如下步骤实施：
        </p>
        <ol className="mindmap-steps">
          {content.steps.map((step, index) => (
            <li key={step}>
              <span>{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <p>
          预计经过 <PreviewMark>{content.time}</PreviewMark> 机遇期，最终实现{' '}
          <PreviewMark>{content.goal}</PreviewMark> 的目标。
        </p>
      </div>
    </article>
  );
}

function OriginalPreview({ content }) {
  return (
    <article
      className="original-preview"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

function LecturePreview({ content, videos }) {
  return (
    <div className="lecture-preview">
      {videos.map((video, index) => {
        const item = content[index] ?? content[content.length - 1];

        return (
          <article className="lecture-card" key={video.id}>
            <div className="lecture-card-meta">
              <span>第 {index + 1} 个视频</span>
              <span>{video.duration}</span>
            </div>
            <h3>{video.title}</h3>
            <p>{item?.content}</p>
          </article>
        );
      })}
    </div>
  );
}

function PreviewMark({ children }) {
  return <span className="preview-mark">{children}</span>;
}

function ActionButton({
  active = false,
  activeStar = false,
  children,
  label,
  onClick,
  title,
}) {
  return (
    <button
      aria-label={title}
      className={`action-item ${active ? 'active' : ''} ${activeStar ? 'active-star' : ''}`}
      onClick={onClick}
      type="button"
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

function BottomSheet({ children, open, onClose, title }) {
  return (
    <section className={`lark-sheet ${open ? 'open' : ''}`}>
      <div className="sheet-bar" />
      <div className="sheet-header">
        <h2 className="sheet-title">{title}</h2>
        <button
          aria-label="关闭面板"
          className="sheet-close"
          onClick={onClose}
          type="button"
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </section>
  );
}

export default App;
