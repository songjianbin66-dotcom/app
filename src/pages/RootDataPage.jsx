import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, 
  MoreVertical, 
  Plus, 
  Minus,
  Trash2, 
  Pencil,
  FileText, 
  Video, 
  Share2, 
  PlayCircle,
  UploadCloud,
  Bold,
  Italic,
  Underline,
  Image as ImageIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  List,
  Quote,
  Link,
  Undo2,
  Redo2,
  Maximize2,
  RefreshCcw
} from 'lucide-react';
import './player.css';
import MindmapPreviewPage from '../components/MindmapPreviewPage.jsx';

const THEME_COLOR = '#C8161D';

const DEFAULT_VIDEO_COVERS = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
];

const getDefaultVideoCover = (seed = 0) => DEFAULT_VIDEO_COVERS[Math.abs(seed) % DEFAULT_VIDEO_COVERS.length];

const createDefaultLectureVideo = (seed = 0) => ({
  id: Date.now() + seed,
  title: `讲解视频_${seed + 1}`,
  source: 'quick-add',
  duration: '04:32',
  size: '128.5MB',
  cover: getDefaultVideoCover(seed),
});

const createLectureEpisode = (index, overrides = {}) => ({
  id: Date.now() + index,
  title: `第 ${index + 1} 集`,
  video: null,
  html: '',
  updatedAt: '尚未编辑',
  ...overrides,
});

const getPlainText = (html = '') =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const initialLectureEpisodes = [
  createLectureEpisode(0, {
    title: '什么是函数',
    video: { id: 201, title: '函数概念介绍.mp4', source: 'quick-add', duration: '04:32', size: '128.5MB', cover: getDefaultVideoCover(0) },
    html: '<p>函数（Function）是一段可以被重复调用的代码块，用于完成特定的任务。</p><p>通过将代码封装成函数，我们可以提高代码的复用性、可读性和可维护性。</p>',
    updatedAt: '今天 14:22 更新',
  }),
  createLectureEpisode(1, {
    title: '函数的定义与调用',
    video: { id: 202, title: '函数定义与调用.mp4', source: 'quick-add', duration: '05:18', size: '156.2MB', cover: getDefaultVideoCover(1) },
    html: '<p>定义函数时需要声明函数名、参数和函数体。调用函数时，程序会进入函数体执行其中的逻辑。</p>',
    updatedAt: '今天 15:03 更新',
  }),
  createLectureEpisode(2, {
    title: '函数的参数与返回值',
  }),
];

const TabTitleInput = ({ value, onChange }) => (
  <div className="rounded-[10px] border border-[#ECEEF3] bg-white px-3 py-2">
    <div className="flex items-center gap-4">
      <input
        type="text"
        placeholder="请输入标题"
        className="min-w-0 flex-1 border-none bg-transparent text-[13px]  text-[#1F2329] outline-none placeholder:text-[13px] placeholder:font-medium placeholder:text-[#C9CDD7]"
        value={value}
        onChange={onChange}
      />
      <span className="shrink-0 text-[13px] font-medium text-[#C9CDD7]">
        {value.length}/20
      </span>
    </div>
  </div>
);

const App = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('create'); // 'create', 'browse', 'library'
  const [activeTab, setActiveTab] = useState('mindmap');
  const [isLectureEditorOpen, setIsLectureEditorOpen] = useState(false);
  const [openLectureMenuId, setOpenLectureMenuId] = useState(null);
  const [rootTags, setRootTags] = useState(['战略', '认知', '增长']);
  const [rootTagInput, setRootTagInput] = useState('');
  const [tabTitles, setTabTitles] = useState({
    mindmap: '',
    text: '',
    video: '',
  });
  const [toastMessage, setToastMessage] = useState('');
  
  const [okStyleIndex, setOkStyleIndex] = useState(0);
  const editorRef = useRef(null);

  const okStyles = [
    {
      name: '经典红',
      className: 'text-[#C8161D] font-black opacity-[0.10] tracking-[-10px]',
      extra: {
        transform: 'rotate(-11deg) scale(1.04)',
        filter: 'drop-shadow(0 0 18px rgba(200,22,29,0.16))',
      },
      previewClassName: 'text-[#C8161D] font-black',
      previewExtra: {
        transform: 'rotate(-8deg)',
        filter: 'drop-shadow(0 0 8px rgba(200,22,29,0.18))',
      }
    },
    {
      name: '印章红',
      className: 'text-[#FF4D4F] font-black opacity-[0.06] rotate-[-15deg] border-8 border-[#FF4D4F] rounded-2xl px-8',
      extra: '',
      previewClassName: 'text-[#FF4D4F] font-black rotate-[-10deg] border-2 border-[#FF4D4F] rounded-lg px-2 py-0.5 opacity-80',
      previewExtra: ''
    },
    {
      name: '描边风',
      className: 'text-transparent font-black opacity-[0.12] tracking-[-8px]',
      extra: {
        WebkitTextStroke: '3px #C8161D',
        textShadow: '8px 10px 0 rgba(200,22,29,0.08)',
        transform: 'rotate(-7deg)',
      },
      previewClassName: 'text-transparent font-black',
      previewExtra: {
        WebkitTextStroke: '1.6px #C8161D',
        textShadow: '4px 5px 0 rgba(200,22,29,0.12)',
        transform: 'rotate(-6deg)',
      }
    },
    {
      name: '极简灰',
      className: 'text-[#B7BEC9] font-light italic opacity-[0.15] tracking-[18px]',
      extra: {
        transform: 'rotate(-13deg) scale(1.08)',
        textShadow: '0 14px 28px rgba(148,163,184,0.14)',
      },
      previewClassName: 'text-[#A8B0BC] font-light italic tracking-[6px]',
      previewExtra: {
        transform: 'rotate(-10deg)',
      }
    },
    {
      name: '霓虹红',
      className: 'text-[#D92B32] font-black opacity-[0.11] tracking-[-6px]',
      extra: {
        transform: 'rotate(9deg) scale(1.02)',
        textShadow: '0 0 20px rgba(217,43,50,0.42), 0 0 52px rgba(217,43,50,0.20)',
      },
      previewClassName: 'text-[#D92B32] font-black',
      previewExtra: {
        transform: 'rotate(7deg)',
        textShadow: '0 0 10px rgba(217,43,50,0.46), 0 0 22px rgba(217,43,50,0.24)',
      }
    }
  ];

  const mockLibraryVideos = [
    { id: 101, title: '项目演示视频_01', duration: '02:30', date: '2024-03-20', size: '96.4MB', cover: getDefaultVideoCover(0) },
    { id: 102, title: '核心逻辑讲解', duration: '05:15', date: '2024-03-18', size: '142.8MB', cover: getDefaultVideoCover(1) },
    { id: 103, title: '用户反馈录屏', duration: '01:45', date: '2024-03-15', size: '88.1MB', cover: getDefaultVideoCover(2) },
    { id: 104, title: '产品宣传片Final', duration: '03:00', date: '2024-03-10', size: '110.6MB', cover: getDefaultVideoCover(3) },
  ];

  const [mindmapData, setMindmapData] = useState({
    action: '', keyPoint: '', target: '', situation: '', advantage: '',
    principle: '', method: '', steps: [''], time: '', goal: ''
  });

  const [mindmapVideos, setMindmapVideos] = useState([]);
  const [originContent, setOriginContent] = useState({ html: '', videos: [] });
  const [lectureEpisodes, setLectureEpisodes] = useState(() => initialLectureEpisodes);
  const [activeLectureEpisodeId, setActiveLectureEpisodeId] = useState(() => lectureEpisodes[0]?.id);
  const activeLectureEpisodeIndex = lectureEpisodes.findIndex((episode) => episode.id === activeLectureEpisodeId);
  const activeLectureEpisode = lectureEpisodes[activeLectureEpisodeIndex] || lectureEpisodes[0];
  const completedLectureCount = lectureEpisodes.filter(
    (episode) => episode.video && getPlainText(episode.html)
  ).length;
  const totalLectureSeconds = lectureEpisodes.reduce((total, episode) => {
    const [minutes = 0, seconds = 0] = (episode.video?.duration || '00:00').split(':').map(Number);
    return total + minutes * 60 + seconds;
  }, 0);
  const totalLectureDuration = `${Math.floor(totalLectureSeconds / 60).toString().padStart(2, '0')}:${(totalLectureSeconds % 60).toString().padStart(2, '0')}`;
  const activeLectureTextCount = getPlainText(activeLectureEpisode?.html).length;

  const mindmapFields = [
    mindmapData.action,
    mindmapData.keyPoint,
    mindmapData.target,
    mindmapData.situation,
    mindmapData.advantage,
    mindmapData.principle,
    mindmapData.method,
    mindmapData.time,
    mindmapData.goal,
  ];
  const isMindmapComplete =
    tabTitles.mindmap.trim() !== '' &&
    mindmapFields.every((value) => value.trim() !== '') &&
    mindmapData.steps.every((step) => step.trim() !== '');
  const isOriginComplete =
    tabTitles.text.trim() !== '' &&
    getPlainText(originContent.html) !== '';
  const isLectureComplete =
    tabTitles.video.trim() !== '' &&
    lectureEpisodes.length > 0 &&
    lectureEpisodes.every(
      (episode) =>
        episode.title.trim() !== '' &&
        Boolean(episode.video) &&
        getPlainText(episode.html) !== ''
    );
  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => setToastMessage(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsLectureEditorOpen(false);
    setOpenLectureMenuId(null);
  };

  const showToast = (message) => {
    setToastMessage(message);
  };

  const addRootTag = () => {
    const nextTag = rootTagInput.trim();

    if (!nextTag) {
      return;
    }

    if (rootTags.includes(nextTag)) {
      showToast('该标签已存在');
      return;
    }

    if (rootTags.length >= 5) {
      showToast('最多添加 5 个标签');
      return;
    }

    setRootTags((prev) => [...prev, nextTag]);
    setRootTagInput('');
  };

  const removeRootTag = (tagToRemove) => {
    setRootTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleRootTagKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addRootTag();
    }
  };

  const updateTabTitle = (tab, value) => {
    setTabTitles((prev) => ({
      ...prev,
      [tab]: value.slice(0, 100),
    }));
  };

  const openMindmapPreview = () => {
    setView('browse');
  };

  const handleSubmit = () => {
    const missingTabs = [];

    if (!isMindmapComplete) {
      missingTabs.push({ id: 'mindmap', label: '脑图' });
    }
    if (!isOriginComplete) {
      missingTabs.push({ id: 'text', label: '原文' });
    }
    if (!isLectureComplete) {
      missingTabs.push({ id: 'video', label: '讲解' });
    }

    if (missingTabs.length > 0) {
      const [firstMissingTab] = missingTabs;
      setActiveTab(firstMissingTab.id);
      setIsLectureEditorOpen(false);
      setOpenLectureMenuId(null);
      showToast(`请先完成${missingTabs.map((tab) => tab.label).join('、')}内容后再提交`);
      return;
    }

    openMindmapPreview();
  };

  const handleMindmapComplete = () => {
    if (!isMindmapComplete) {
      showToast('请先完成脑图内容');
      return;
    }

    openMindmapPreview();
  };

  const addStepAt = (idx) => {
    const newSteps = [...mindmapData.steps];
    newSteps.splice(idx + 1, 0, '');
    setMindmapData({ ...mindmapData, steps: newSteps });
  };

  const removeStep = (idx) => {
    if (mindmapData.steps.length === 1) return;
    setMindmapData({ ...mindmapData, steps: mindmapData.steps.filter((_, i) => i !== idx) });
  };
  const updateStep = (idx, val) => {
    const newSteps = [...mindmapData.steps];
    newSteps[idx] = val;
    setMindmapData({ ...mindmapData, steps: newSteps });
  };

  const keepEditorSelection = (event) => {
    event.preventDefault();
  };

  const execCommand = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    updateHtmlContent();
  };

  const insertImage = () => {
    const imageUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60";
    const imgHtml = `<img src="${imageUrl}" style="max-width:100%; border-radius:8px; margin: 8px 0; display:block;" />`;
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, imgHtml);
    updateHtmlContent();
  };

  const updateHtmlContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      if (activeTab === 'text') {
        setOriginContent(prev => ({ ...prev, html: content }));
      } else {
        setLectureEpisodes(prev => prev.map(episode =>
          episode.id === activeLectureEpisodeId
            ? { ...episode, html: content }
            : episode
        ));
      }
    }
  };

  const addVideoToTarget = (target, data) => {
    const nextVideo = {
      id: Date.now(),
      cover: data.cover || getDefaultVideoCover(Date.now()),
      ...data,
    };

    if (target === 'mindmap') {
      setMindmapVideos([nextVideo]);
    } else if (target === 'origin') {
      setOriginContent(prev => ({ ...prev, videos: [nextVideo] }));
    } else {
      setLectureEpisodes(prev => prev.map(episode =>
        episode.id === activeLectureEpisodeId
          ? { ...episode, video: nextVideo }
          : episode
      ));
    }
  };

  const addQuickVideo = (target) => {
    const count =
      target === 'mindmap'
        ? mindmapVideos.length
        : target === 'origin'
          ? originContent.videos.length
          : activeLectureEpisodeIndex + 1;

    if (target === 'mindmap' && mindmapVideos.length >= 1) {
      showToast('脑图仅支持添加 1 个视频');
      return;
    }

    if (target === 'origin' && originContent.videos.length >= 1) {
      showToast('原文仅支持添加 1 个视频');
      return;
    }

    addVideoToTarget(target, {
      title: target === 'lecture' ? `讲解视频_${count}` : `视频_${count + 1}`,
      source: 'quick-add',
      duration: target === 'lecture' ? '04:32' : '12:45',
      size: '128.5MB',
      cover: getDefaultVideoCover(count),
    });
  };

  const addLectureEpisode = () => {
    const nextEpisode = createLectureEpisode(lectureEpisodes.length, {
      video: createDefaultLectureVideo(lectureEpisodes.length),
    });
    setLectureEpisodes(prev => [...prev, nextEpisode]);
    setActiveLectureEpisodeId(nextEpisode.id);
    setIsLectureEditorOpen(true);
    setOpenLectureMenuId(null);
  };

  const removeLectureEpisode = (id) => {
    if (lectureEpisodes.length === 1) return;

    const removeIndex = lectureEpisodes.findIndex(episode => episode.id === id);
    const nextEpisodes = lectureEpisodes.filter(episode => episode.id !== id);
    setLectureEpisodes(nextEpisodes);

    if (activeLectureEpisodeId === id) {
      const nextActiveIndex = Math.max(0, removeIndex - 1);
      setActiveLectureEpisodeId(nextEpisodes[nextActiveIndex].id);
    }
  };

  const updateLectureEpisodeTitle = (id, titleValue) => {
    setLectureEpisodes(prev => prev.map(episode =>
      episode.id === id
        ? { ...episode, title: titleValue }
        : episode
    ));
  };

  const removeActiveLectureVideo = () => {
    setLectureEpisodes(prev => prev.map(episode =>
      episode.id === activeLectureEpisodeId
        ? { ...episode, video: null }
        : episode
    ));
  };

  const openLectureEpisodeEditor = (episodeId) => {
    setActiveLectureEpisodeId(episodeId);
    setIsLectureEditorOpen(true);
    setOpenLectureMenuId(null);
  };

  const closeLectureEpisodeEditor = () => {
    setIsLectureEditorOpen(false);
  };

  const saveLectureEpisode = () => {
    setLectureEpisodes(prev => prev.map(episode =>
      episode.id === activeLectureEpisodeId
        ? { ...episode, updatedAt: '刚刚更新' }
        : episode
    ));
    closeLectureEpisodeEditor();
  };

  const deleteLectureEpisodeFromList = (episodeId) => {
    if (lectureEpisodes.length === 1) return;
    removeLectureEpisode(episodeId);
    setOpenLectureMenuId(null);
  };

  const handleDivActionKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const handleBackHome = () => {
    navigate('/');
  };

  const AttachedVideoSection = ({ items, onAdd, onRemove, maxCount = Infinity }) => (
    <div className="rounded-[15px] border border-[#ECECF3] bg-white p-2 shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative h-[120px] w-[180px] shrink-0 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#5C6F8A_0%,#2F4A67_100%)]">
              {item.cover && (
                <img
                  src={item.cover}
                  alt={`${item.title}封面`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                  <PlayCircle size={32} strokeWidth={1.8} />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 rounded-[10px] bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white">
                {item.duration || '12:45'}
              </div>
            </div>

            <div className="min-w-0 flex-1 self-stretch py-2">
              <div className="line-clamp-2 text-[14px] font-bold leading-6 text-[#111827]">
                {item.title}
              </div>
              <div className="mt-2 text-[12px] font-medium text-[#A1A1AA]">
                {item.size || '128.5MB'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="flex shrink-0 items-center gap-1 self-end pb-3 text-[13px] font-bold text-[#FF5E5E]"
            >
              <Trash2 size={16} />
              删除
            </button>
          </div>
        ))}

        {items.length < maxCount && (
          <div
            type="button"
            onClick={onAdd}
            className="flex min-h-[150px] w-full flex-col items-center justify-center rounded-[24px]  px-3 py-6 text-center"
          >
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#C8161D] text-white ]">
              <Plus size={20} strokeWidth={2.8} />
            </div>
            <div className="text-[14px]  text-[#B11319]">
              添加视频
            </div>
            <div className="mt-2 text-[12px] font-medium text-[#A1A1AA]">
              支持 MP4 / MOV / AVI 等格式，单个视频不超过 200MB
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderLectureEditPage = () => (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-gray-100 px-4">
        <div
          onClick={closeLectureEpisodeEditor}
          onKeyDown={(event) => handleDivActionKeyDown(event, closeLectureEpisodeEditor)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#374151] active:bg-gray-100"
          role="button"
          tabIndex={0}
          aria-label="返回讲解列表"
        >
          <ChevronLeft size={25} strokeWidth={2.4} />
        </div>
        <div className="text-[19px] font-bold text-[#111827]">
          编辑第{activeLectureEpisodeIndex + 1}集
        </div>
        <div className="flex items-center gap-1">
          <div
            onClick={saveLectureEpisode}
            className="flex h-10 items-center px-2 text-[16px] font-bold text-[#C8161D]"
            onKeyDown={(event) => handleDivActionKeyDown(event, saveLectureEpisode)}
            role="button"
            tabIndex={0}
          >
            保存
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5">
        <div className="mb-6">
          <label className="mb-2 block text-[13px] font-bold text-[#4B5563]">集标题</label>
          <div className="relative">
            <input
              value={activeLectureEpisode.title}
              onChange={(e) => updateLectureEpisodeTitle(activeLectureEpisode.id, e.target.value.slice(0, 30))}
              className="h-12 w-full rounded-xl border border-[#E5E7EB] px-3 pr-14 text-[16px] font-medium text-[#1F2937] outline-none transition-colors focus:border-[#C8161D]"
              placeholder={`第 ${activeLectureEpisodeIndex + 1} 集标题`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400">
              {activeLectureEpisode.title.length}/30
            </span>
          </div>
        </div>

        <div className="mb-7">
          <div className="mb-3 text-[13px] font-bold text-[#4B5563]">视频</div>
          <div className="overflow-hidden rounded-xl bg-[#FFF3F4] shadow-[0_1px_0_rgba(17,24,39,0.04)]">
            <div className="relative aspect-video overflow-hidden bg-[#C8161D]">
              {activeLectureEpisode.video?.cover && (
                <img
                  src={activeLectureEpisode.video.cover}
                  alt={`${activeLectureEpisode.title}视频封面`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center text-white backdrop-blur-sm">
                  <PlayCircle size={34} strokeWidth={1.8} />
                </div>
              </div>
              {/* <div className="absolute bottom-0 left-0 right-0 flex h-10 items-center justify-between bg-black/48 px-3 text-white">
                <span className="text-[13px]">{activeLectureEpisode.video?.duration || '00:00'}</span>
                <div className="flex items-center gap-3 text-white/85">
                  <RefreshCcw size={16} />
                  <Maximize2 size={16} />
                </div>
              </div> */}
            </div>

            {activeLectureEpisode.video ? (
              <div className="flex items-center gap-3 bg-[#FAFAFC] px-4 py-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#C8161D] text-white">
                  <Video size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-bold text-[#374151]">{activeLectureEpisode.video.title}</div>
                  <div className="mt-0.5 text-[12px] text-gray-400">{activeLectureEpisode.video.size || '128.5MB'}</div>
                </div>
                <div
                  onClick={removeActiveLectureVideo}
                  onKeyDown={(event) => handleDivActionKeyDown(event, removeActiveLectureVideo)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 active:bg-gray-100"
                  role="button"
                  tabIndex={0}
                  aria-label="删除视频"
                >
                  <X size={20} />
                </div>
              </div>
            ) : (
              <div
                onClick={() => addQuickVideo('lecture')}
                onKeyDown={(event) => handleDivActionKeyDown(event, () => addQuickVideo('lecture'))}
                className="flex w-full items-center justify-center gap-2 bg-[#FAFAFC] px-4 py-4 text-[14px] font-bold text-[#C8161D]"
                role="button"
                tabIndex={0}
              >
                <UploadCloud size={18} />
                添加视频
              </div>
            )}
          </div>

          <div
            onClick={() => addQuickVideo('lecture')}
            onKeyDown={(event) => handleDivActionKeyDown(event, () => addQuickVideo('lecture'))}
            className="mt-4 flex h-[58px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#F1B8BB] text-[#C8161D] active:bg-[#FFF3F4]"
            role="button"
            tabIndex={0}
          >
            <span className="flex items-center gap-2 text-[14px] font-bold">
              <UploadCloud size={18} />
              {activeLectureEpisode.video ? '更换视频' : '上传视频'}
            </span>
            <span className="mt-1 text-[11px] font-medium text-gray-400">支持 MP4 / MOV / AVI 等格式，最大 2GB</span>
          </div>
        </div>

        <div>
          <div className="mb-3 text-[13px] font-bold text-[#4B5563]">文本讲解</div>
          <div className="relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
            <div className="flex h-11 items-center gap-1 border-b border-[#EEF0F4] bg-[#FAFAFC] px-3 text-[#4B5563]">
              <div onMouseDown={keepEditorSelection} onClick={() => execCommand('bold')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('bold'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="加粗"><Bold size={17} /></div>
              <div onMouseDown={keepEditorSelection} onClick={() => execCommand('italic')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('italic'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="斜体"><Italic size={17} /></div>
              <div onMouseDown={keepEditorSelection} onClick={() => execCommand('underline')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('underline'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="下划线"><Underline size={17} /></div>
              <div className="mx-1 h-5 w-px bg-[#E5E7EB]" />
              <div onMouseDown={keepEditorSelection} onClick={() => execCommand('insertUnorderedList')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('insertUnorderedList'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="项目列表"><List size={17} /></div>
              <div onMouseDown={keepEditorSelection} onClick={() => execCommand('formatBlock', 'blockquote')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('formatBlock', 'blockquote'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="引用"><Quote size={17} /></div>
              <div onMouseDown={keepEditorSelection} onClick={() => execCommand('createLink', '#')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('createLink', '#'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="链接"><Link size={17} /></div>
              <div className="ml-auto flex gap-1 text-gray-300">
                <div onMouseDown={keepEditorSelection} onClick={() => execCommand('undo')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('undo'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="撤销"><Undo2 size={17} /></div>
                <div onMouseDown={keepEditorSelection} onClick={() => execCommand('redo')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('redo'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="重做"><Redo2 size={17} /></div>
              </div>
            </div>
            <div
              key={activeLectureEpisode.id}
              ref={editorRef}
              contentEditable
              onInput={updateHtmlContent}
              className="min-h-[240px] p-4 pb-10 text-[15px] leading-7 text-[#374151] outline-none"
              dangerouslySetInnerHTML={{ __html: activeLectureEpisode.html }}
            />
            {!activeLectureEpisode.html && (
              <div className="pointer-events-none absolute left-4 top-[62px] text-[14px] text-gray-300">
                请输入本集讲解内容...
              </div>
            )}
            <div className="absolute bottom-3 right-4 text-[13px] text-gray-400">
              {activeLectureTextCount}/5000
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreatePage = () => {
    if (activeTab === 'video' && isLectureEditorOpen && activeLectureEpisode) {
      return renderLectureEditPage();
    }

    return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 顶部导航 */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 shrink-0">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            aria-label="返回首页"
            onClick={handleBackHome}
            className="flex items-center justify-center rounded-full text-gray-600"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span className="font-medium text-[17px]">创建根数据</span>
        </div>
        <div 
          onClick={handleSubmit}
          className="rounded-full bg-[#C8161D] px-4 py-1.5 text-[10px] font-medium text-white transition-all"
        >
          提交审核
        </div>
      </div>

      <div className="border-b border-[#EEF0F4] bg-white px-4 py-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="text-[13px] font-bold text-[#1F2329]">根数据标签</div>
          <AlertCircle size={14} className="text-[#A0A7B4]" />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {rootTags.map((tag) => (
            <div
              key={tag}
              className="flex h-[25px] items-center gap-1 rounded-full bg-[#FCEAEC] px-2 text-[#C8161D]"
            >
              <span className="text-[12px] font-semibold leading-none tracking-[0.01em]">{tag}</span>
              <div
                 aria-label={`删除标签${tag}`}
                onClick={() => removeRootTag(tag)}
                className="flex h-3 w-3 items-center justify-center rounded-full text-[#C8161D] "
              >
                <X size={10} strokeWidth={2.25} />
              </div>
            </div>
          ))}

          {rootTags.length < 5 && (
            <div className="flex min-w-[120px] flex-1 items-center border-b-2 border-[#C8161D] pb-0.5">
              <input
                type="text"
                value={rootTagInput}
                onChange={(e) => setRootTagInput(e.target.value.slice(0, 12))}
                onKeyDown={handleRootTagKeyDown}
                placeholder="添加标签（回车创建）"
                className="w-full border-none bg-transparent text-[10px] leading-none text-[#1F2329] outline-none placeholder:text-[#A0A7B4] placeholder:text-[12px]"
              />
            </div>
          )}
        </div>

        <div className="mt-3 text-[11px] font-medium leading-4 text-[#A0A7B4]">
          标签属于整个根数据，用于分类和检索，最多添加 5 个
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex h-11 bg-white shrink-0">
        {[
          { id: 'mindmap', label: '脑图', icon: <Share2 size={18} /> },
          { id: 'text', label: '原文', icon: <FileText size={18} /> },
          { id: 'video', label: '讲解', icon: <Video size={18} /> },
        ].map(tab => {
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 h-11 flex items-center justify-center relative transition-all ${
                activeTab === tab.id ? 'text-[#C8161D]' : 'text-gray-500'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {React.cloneElement(tab.icon, { size: 17 })}
                <span className={`text-[14px] transition-colors ${activeTab === tab.id ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-[2px] h-[4px] w-[72px] rounded-full bg-[#C8161D]" />
              )}
            </button>
          );
        })}
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        {activeTab === 'mindmap' && (
          <div className="flex min-h-full flex-col gap-4">
            <TabTitleInput
              value={tabTitles.mindmap}
              onChange={(e) => updateTabTitle('mindmap', e.target.value)}
            />
            <div className="bg-white rounded-xl p-6 border border-gray-100 leading-8 text-[14px] text-gray-800">
              做 <input className="inline-input" value={mindmapData.action} onChange={(e) => setMindmapData({...mindmapData, action: e.target.value})} /> 事，关键在于 <input className="inline-input" value={mindmapData.keyPoint} onChange={(e) => setMindmapData({...mindmapData, keyPoint: e.target.value})} />。<br />
              要针对 <input className="inline-input" value={mindmapData.target} onChange={(e) => setMindmapData({...mindmapData, target: e.target.value})} />，鉴于 <input className="inline-input" value={mindmapData.situation} onChange={(e) => setMindmapData({...mindmapData, situation: e.target.value})} /> 的形势，发挥 <input className="inline-input" value={mindmapData.advantage} onChange={(e) => setMindmapData({...mindmapData, advantage: e.target.value})} /> 的优势，本着 <input className="inline-input" value={mindmapData.principle} onChange={(e) => setMindmapData({...mindmapData, principle: e.target.value})} /> 的原则，运用 <input className="inline-input" value={mindmapData.method} onChange={(e) => setMindmapData({...mindmapData, method: e.target.value})} /> 的方法，通过如下步骤：
              
              <div className="my-4 space-y-2">
                {mindmapData.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="shrink-0 min-w-7 text-[#3F3F46] text-[14px]">{idx + 1}.</span>
                    <input className="flex-1 border-b border-[#A1A1AA] px-1 outline-none text-[#C8161D] py-1 text-[14px]" value={step} onChange={(e) => updateStep(idx, e.target.value)} />
                    <div className="ml-2 flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        aria-label="新增步骤"
                        onClick={() => addStepAt(idx)}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C8161D] text-white transition-transform active:scale-95"
                      >
                        <Plus size={12} strokeWidth={3} />
                      </button>
                      <button
                        type="button"
                        aria-label="删除步骤"
                        onClick={() => removeStep(idx)}
                        disabled={mindmapData.steps.length === 1}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C8161D] text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              经过 <input className="inline-input" value={mindmapData.time} onChange={(e) => setMindmapData({...mindmapData, time: e.target.value})} /> (机遇期)，实现 <input className="inline-input" value={mindmapData.goal} onChange={(e) => setMindmapData({...mindmapData, goal: e.target.value})} /> 的目标。
            </div>

            <AttachedVideoSection
              items={mindmapVideos}
              maxCount={1}
              onAdd={() => addQuickVideo('mindmap')}
              onRemove={(id) => setMindmapVideos((prev) => prev.filter((video) => video.id !== id))}
            />

            <div className="mt-auto pt-2">
              <button
                type="button"
                onClick={handleMindmapComplete}
                className="flex h-[48px] w-full items-center justify-center rounded-[15px] bg-[#C8161D] text-[18px] font-bold text-white shadow-[0_18px_32px_rgba(200,22,29,0.28)]"
              >
                保存草稿
              </button>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            <TabTitleInput
              value={tabTitles.text}
              onChange={(e) => updateTabTitle('text', e.target.value)}
            />
            <div className="bg-white rounded-xl flex flex-col border border-gray-100 overflow-hidden min-h-[400px] relative">
              <div className="p-2 bg-gray-50 border-b border-gray-100 flex items-center space-x-3 overflow-x-auto no-scrollbar shrink-0">
                <div className="flex space-x-3 pr-2 border-r border-gray-200">
                  <button type="button" onMouseDown={keepEditorSelection} onClick={() => execCommand('bold')} className="p-1 hover:bg-gray-200 rounded transition-colors"><Bold size={16} className="text-gray-600" /></button>
                  <button type="button" onMouseDown={keepEditorSelection} onClick={() => execCommand('italic')} className="p-1 hover:bg-gray-200 rounded transition-colors"><Italic size={16} className="text-gray-600" /></button>
                  <button type="button" onMouseDown={keepEditorSelection} onClick={() => execCommand('underline')} className="p-1 hover:bg-gray-200 rounded transition-colors"><Underline size={16} className="text-gray-600" /></button>
                </div>
                <button type="button" aria-label="插图" onMouseDown={keepEditorSelection} onClick={insertImage} className="flex h-7 w-7 items-center justify-center text-gray-600 shrink-0 hover:bg-gray-200 rounded transition-colors">
                  <ImageIcon size={14} />
                </button>
              </div>
              <div ref={editorRef} contentEditable onInput={updateHtmlContent} className="p-4 flex-1 outline-none text-[15px] leading-relaxed overflow-y-auto no-scrollbar" style={{ minHeight: '300px' }} dangerouslySetInnerHTML={{ __html: originContent.html }} />
              {!originContent.html && (
                <div className="absolute top-[88px] left-4 text-gray-300 pointer-events-none text-sm">
                  请输入原文内容...
                </div>
              )}
            </div>
            <AttachedVideoSection
              items={originContent.videos}
              maxCount={1}
              onAdd={() => addQuickVideo('origin')}
              onRemove={(id) =>
                setOriginContent((prev) => ({
                  ...prev,
                  videos: prev.videos.filter((video) => video.id !== id),
                }))
              }
            />
          </div>
        )}

        {activeTab === 'video' && (
          <div className="space-y-4">
            <TabTitleInput
              value={tabTitles.video}
              onChange={(e) => updateTabTitle('video', e.target.value)}
            />
            <div className="rounded-xl border border-[#EEF0F4] bg-white shadow-[0_10px_28px_rgba(17,24,39,0.04)]">
              <div className="flex items-center justify-between border-b border-[#EEF0F4] px-4 py-4">
                <div>
                  <div className="text-[15px] font-bold text-[#1F2329]">讲解（{lectureEpisodes.length}集）</div>
                  <div className="mt-1 text-[12px] font-medium text-[#6B7280]">
                    已完成 {completedLectureCount} 集，全部时长 {totalLectureDuration}
                  </div>
                </div>
                <div
                  onClick={addLectureEpisode}
                  onKeyDown={(event) => handleDivActionKeyDown(event, addLectureEpisode)}
                  className="flex h-[28px] items-center gap-1.5 rounded-full bg-[#C8161D] px-4 text-[11px]  text-white shadow-[0_8px_18px_rgba(200,22,29,0.24)] active:scale-95"
                  role="button"
                  tabIndex={0}
                >
                  <Plus size={18} strokeWidth={2} />
                  新增一集
                </div>
              </div>

              <div className="space-y-3 p-3">
                {lectureEpisodes.map((episode, idx) => {
                  const hasVideo = Boolean(episode.video);
                  const hasText = Boolean(episode.html.trim());

                  return (
                    <div
                      key={episode.id}
                      className="w-full rounded-xl border border-[#EEF0F4] bg-white p-4 text-left shadow-[0_4px_16px_rgba(17,24,39,0.03)]"
                    >
                      <div className="relative mb-4 flex items-start gap-3">
                        <span className="shrink-0 rounded-[5px] bg-[#FCEAEC] px-3 py-[4px] text-[8px] font-black text-[#C8161D]">
                          第{idx + 1}集
                        </span>
                        <div className="min-w-0 flex-1 pt-0.5 text-[11px] font-bold text-[#111827]">
                          {episode.title}
                        </div>
                        <div
                          className="relative -mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#4B5563] active:bg-gray-100"
                          onClick={(event) => {
                            event.stopPropagation();
                            setOpenLectureMenuId(openLectureMenuId === episode.id ? null : episode.id);
                          }}
                          onKeyDown={(event) => {
                            event.stopPropagation();
                            handleDivActionKeyDown(event, () => setOpenLectureMenuId(openLectureMenuId === episode.id ? null : episode.id));
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label="打开分集操作菜单"
                        >
                          <MoreVertical size={22} />
                        </div>
                        {openLectureMenuId === episode.id && (
                          <div
                            className="absolute right-0 top-8 z-20 w-[108px] overflow-hidden rounded-xl bg-white py-1.5 shadow-[0_10px_28px_rgba(17,24,39,0.16)] ring-1 ring-black/5"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <div
                              className="flex h-10 items-center gap-2 px-3 text-[13px] font-medium text-[#374151] active:bg-gray-50"
                              onClick={() => openLectureEpisodeEditor(episode.id)}
                              onKeyDown={(event) => handleDivActionKeyDown(event, () => openLectureEpisodeEditor(episode.id))}
                              role="button"
                              tabIndex={0}
                            >
                              <Pencil size={15} />
                              编辑
                            </div>
                            <div
                              className={`flex h-10 items-center gap-2 px-3 text-[13px] font-medium ${
                                lectureEpisodes.length === 1 ? 'text-gray-300' : 'text-[#EF4444] active:bg-red-50'
                              }`}
                              onClick={() => deleteLectureEpisodeFromList(episode.id)}
                              onKeyDown={(event) => handleDivActionKeyDown(event, () => deleteLectureEpisodeFromList(episode.id))}
                              role="button"
                              tabIndex={0}
                              aria-disabled={lectureEpisodes.length === 1}
                            >
                              <Trash2 size={15} />
                              删除
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`relative h-[112px] w-full shrink-0 overflow-hidden rounded-lg ${hasVideo ? 'bg-[#C8161D]' : 'bg-[#F5F6F8]'}`}>
                          {hasVideo ? (
                            <>
                              {episode.video.cover && (
                                <img
                                  src={episode.video.cover}
                                  alt={`${episode.title}视频封面`}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              )}
                              <div className="absolute inset-0 bg-black/20" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-11 w-11 items-center justify-center  text-white">
                                  <PlayCircle size={29} strokeWidth={1.8} />
                                </div>
                              </div>
                              <span className="absolute bottom-2 right-2 rounded-md bg-black/45 px-2 py-0.5 text-[12px] font-bold text-white">
                                {episode.video.duration || '00:00'}
                              </span>
                            </>
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-1 text-[#9CA3AF] ">
                              {/* <Video size={28} /> */}
                              {/* <Plus size={14} /> */}
                            </div>
                          )}
                        </div>

                        {/* <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-[#374151]">
                            {hasVideo ? <CheckCircle2 size={16} className="text-[#4CAF7A]" /> : <AlertCircle size={16} className="text-[#F59E0B]" />}
                            {hasVideo ? '已上传视频' : '未上传视频'}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-[#374151]">
                            {hasText ? <CheckCircle2 size={16} className="text-[#4CAF7A]" /> : <AlertCircle size={16} className="text-[#F59E0B]" />}
                            {hasText ? '已填写讲解' : '未填写讲解'}
                          </div>
                          <div className="pt-1 text-[12px] font-medium text-[#9CA3AF]">{episode.updatedAt}</div>
                        </div> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .inline-input { 
          border: none; border-bottom: 1px solid #A1A1AA; margin: 0 4px; outline: none; 
          width: 65px; text-align: center; color: ${THEME_COLOR}; font-weight: inherit; font-size: inherit; line-height: inherit;
          background: transparent; transition: border-color 0.2s;
        }
        .inline-input:focus { border-bottom-color: ${THEME_COLOR}; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .root-mindmap-complete .preview-mark { text-decoration: none; }
      `}</style>
    </div>
    );
  };

  const renderBrowsePage = () => {
    return (
      <MindmapPreviewPage
        headerTitle="脑图预览"
        title={tabTitles.mindmap}
        mindmapData={mindmapData}
        okStyle={okStyles[okStyleIndex]}
        onBack={() => setView('create')}
        showTemplatePicker
        templateOptions={okStyles}
        selectedTemplateIndex={okStyleIndex}
        onSelectTemplate={setOkStyleIndex}
        showPrimaryAction
        primaryActionLabel="保存草稿"
      />
    );
  };

  const renderLibraryPage = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 py-3 flex items-center space-x-3 border-b border-gray-100">
        <ChevronLeft className="text-gray-600 cursor-pointer" onClick={() => setView('create')} />
        <span className="font-bold text-lg">视频素材库</span>
      </div>
      <div className="p-4 bg-gray-50 border-b border-gray-100 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm outline-none" placeholder="搜索历史上传视频..." />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockLibraryVideos.map(video => (
          <div key={video.id} className="flex items-center p-3 border border-gray-100 rounded-xl hover:bg-[#FDEBEC] cursor-pointer" onClick={() => { addVideoToTarget(activeTab === 'mindmap' ? 'mindmap' : activeTab === 'text' ? 'origin' : 'lecture', { title: video.title, source: 'library', duration: video.duration, size: video.size, cover: video.cover }); setView('create'); }}>
            <div className="relative mr-4 h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
              <img src={video.cover} alt={`${video.title}封面`} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <PlayCircle className="text-white" size={24} />
              </div>
            </div>
            <div className="flex-1"><div className="font-medium text-gray-800">{video.title}</div><div className="text-xs text-gray-400 mt-1">{video.duration} · {video.date}</div></div>
            <div className="p-2 text-[#C8161D]"><Plus size={20} /></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex justify-center bg-white w-full min-h-screen">
      <div className="w-full max-w-[400px] h-[812px] bg-white relative overflow-hidden font-sans border-[8px] border-black rounded-[3rem] my-4">
        {view === 'create' ? renderCreatePage() : view === 'library' ? renderLibraryPage() : renderBrowsePage()}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full opacity-20" />
        {toastMessage && (
          <div className="pointer-events-none absolute left-1/2 top-6 z-50 w-[calc(100%-32px)] -translate-x-1/2">
            <div className="rounded-2xl bg-[rgba(17,24,39,0.88)] px-4 py-3 text-center text-[13px] font-medium leading-5 text-white shadow-[0_12px_32px_rgba(17,24,39,0.22)] backdrop-blur-sm">
              {toastMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
