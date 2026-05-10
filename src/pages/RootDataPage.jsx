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
  Play,
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
  Redo2
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
const MINDMAP_FIELD_MAX_CHARS = 10;
const VIDEO_TAG_MAX_COUNT = 5;
const DEFAULT_VIDEO_TAGS = ['战略', '认知', '增长'];

const getCharacterCount = (value = '') => Array.from(value).length;
const limitMindmapText = (value = '') =>
  Array.from(value).slice(0, MINDMAP_FIELD_MAX_CHARS).join('');
const getInlineInputWidth = (value = '') => `${Math.max(getCharacterCount(value) + 1, 4)}em`;

const getDefaultVideoCover = (seed = 0) => DEFAULT_VIDEO_COVERS[Math.abs(seed) % DEFAULT_VIDEO_COVERS.length];
const stripFileExtension = (value = '') => value.replace(/\.[^.]+$/, '');
const truncateMiddle = (value = '', maxLength = 24) => {
  const chars = Array.from(value);

  if (chars.length <= maxLength) {
    return value;
  }

  const ellipsis = '...';
  const availableChars = maxLength - ellipsis.length;
  const headCount = Math.ceil(availableChars / 2);
  const tailCount = Math.floor(availableChars / 2);

  return `${chars.slice(0, headCount).join('')}${ellipsis}${chars.slice(-tailCount).join('')}`;
};
const formatFileSize = (bytes = 0) => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0MB';
  }

  const sizeInMb = bytes / (1024 * 1024);

  if (sizeInMb >= 1024) {
    return `${(sizeInMb / 1024).toFixed(2)}GB`;
  }

  return `${sizeInMb.toFixed(1)}MB`;
};
const formatDuration = (seconds = 0) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '00:00';
  }

  const totalSeconds = Math.round(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainSeconds = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, remainSeconds].map((part) => part.toString().padStart(2, '0')).join(':');
  }

  return [minutes, remainSeconds].map((part) => part.toString().padStart(2, '0')).join(':');
};

const createDefaultLectureVideo = (seed = 0) => ({
  id: Date.now() + seed,
  title: `讲解视频_${seed + 1}`,
  source: 'quick-add',
  duration: '04:32',
  size: '128.5MB',
  cover: getDefaultVideoCover(seed),
  tags: [...DEFAULT_VIDEO_TAGS],
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
    video: { id: 201, title: '函数概念介绍.mp4', source: 'quick-add', duration: '04:32', size: '128.5MB', cover: getDefaultVideoCover(0), tags: ['基础认知', '函数'] },
    html: '<p>函数（Function）是一段可以被重复调用的代码块，用于完成特定的任务。</p><p>通过将代码封装成函数，我们可以提高代码的复用性、可读性和可维护性。</p>',
    updatedAt: '今天 14:22 更新',
  }),
  createLectureEpisode(1, {
    title: '函数的定义与调用',
    video: { id: 202, title: '函数定义与调用.mp4', source: 'quick-add', duration: '05:18', size: '156.2MB', cover: getDefaultVideoCover(1), tags: ['定义', '调用'] },
    html: '<p>定义函数时需要声明函数名、参数和函数体。调用函数时，程序会进入函数体执行其中的逻辑。</p>',
    updatedAt: '今天 15:03 更新',
  }),
  createLectureEpisode(2, {
    title: '函数的参数与返回值',
  }),
];

const TabTitleInput = ({
  value,
  onChange,
  placeholder = '请输入标题',
  inputClassName = '',
  counterClassName = '',
}) => (
  <div className="rounded-[10px] border border-[#ECEEF3] bg-white px-3 py-2">
    <div className="flex items-center gap-4">
      <input
        type="text"
        placeholder={placeholder}
        className={`min-w-0 flex-1 border-none bg-transparent text-[13px] text-[#1F2329] outline-none placeholder:text-[13px] placeholder:font-medium placeholder:text-[#C9CDD7] ${inputClassName}`}
        value={value}
        onChange={onChange}
      />
      <span className={`shrink-0 text-[13px] font-medium text-[#C9CDD7] ${counterClassName}`}>
        {value.length}/20
      </span>
    </div>
  </div>
);

const App = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('create'); // 'create', 'browse', 'library', 'video-upload'
  const [activeTab, setActiveTab] = useState('mindmap');
  const [isLectureEditorOpen, setIsLectureEditorOpen] = useState(false);
  const [openLectureMenuId, setOpenLectureMenuId] = useState(null);
  const [tabTitles, setTabTitles] = useState({
    mindmap: '',
    text: '',
    video: '',
  });
  const [toastMessage, setToastMessage] = useState('');
  const [videoEditorDraft, setVideoEditorDraft] = useState(null);
  const [videoTagInput, setVideoTagInput] = useState('');
  const [pendingVideoTarget, setPendingVideoTarget] = useState(null);
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const [isUploadPreviewPlaying, setIsUploadPreviewPlaying] = useState(false);
  const [isOriginEditorFocused, setIsOriginEditorFocused] = useState(false);
  const [hasVisualViewportSupport, setHasVisualViewportSupport] = useState(false);
  const [keyboardToolbarTop, setKeyboardToolbarTop] = useState(null);
  const [isOriginKeyboardVisible, setIsOriginKeyboardVisible] = useState(false);

  const [okStyleIndex, setOkStyleIndex] = useState(0);
  const originEditorRef = useRef(null);
  const lectureEditorRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const uploadPreviewVideoRef = useRef(null);
  const createdObjectUrlsRef = useRef(new Set());
  const visualViewportBaselineRef = useRef(0);

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

  useEffect(() => () => {
    createdObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    createdObjectUrlsRef.current.clear();
  }, []);

  useEffect(() => {
    const handleFocusIn = (event) => {
      if (event.target === originEditorRef.current) {
        setIsOriginEditorFocused(true);
      }
    };

    const handleFocusOut = (event) => {
      if (event.target !== originEditorRef.current) {
        return;
      }

      window.setTimeout(() => {
        setIsOriginEditorFocused(document.activeElement === originEditorRef.current);
      }, 0);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  useEffect(() => {
    if (activeTab !== 'text') {
      setIsOriginEditorFocused(false);
      setIsOriginKeyboardVisible(false);
      setKeyboardToolbarTop(null);
    }
  }, [activeTab]);

  useEffect(() => {
    const viewport = window.visualViewport;
    setHasVisualViewportSupport(Boolean(viewport));

    if (!viewport) {
      return undefined;
    }

    const updateKeyboardToolbarPosition = () => {
      const viewportBottom = viewport.height + viewport.offsetTop;
      visualViewportBaselineRef.current = Math.max(visualViewportBaselineRef.current, viewportBottom);
      const nextOffset = Math.max(0, visualViewportBaselineRef.current - viewportBottom);
      const toolbarHeight = 48;
      const toolbarGap = 8;
      const nextTop = Math.max(0, viewport.offsetTop + viewport.height - toolbarHeight - toolbarGap);
      setKeyboardToolbarTop(nextTop);
      setIsOriginKeyboardVisible(nextOffset > 80);
    };

    updateKeyboardToolbarPosition();
    viewport.addEventListener('resize', updateKeyboardToolbarPosition);
    viewport.addEventListener('scroll', updateKeyboardToolbarPosition);

    return () => {
      viewport.removeEventListener('resize', updateKeyboardToolbarPosition);
      viewport.removeEventListener('scroll', updateKeyboardToolbarPosition);
    };
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsLectureEditorOpen(false);
    setOpenLectureMenuId(null);
  };

  const showToast = (message) => {
    setToastMessage(message);
  };

  const trackObjectUrl = (url) => {
    if (url) {
      createdObjectUrlsRef.current.add(url);
    }
  };

  const releaseObjectUrl = (url) => {
    if (url && createdObjectUrlsRef.current.has(url)) {
      URL.revokeObjectURL(url);
      createdObjectUrlsRef.current.delete(url);
    }
  };

  const createVideoDraftFromFile = (file) => new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    trackObjectUrl(objectUrl);

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;
    let isResolved = false;

    const finalize = (cover = '') => {
      if (isResolved) {
        return;
      }

      isResolved = true;
      resolve({
        id: Date.now(),
        title: stripFileExtension(file.name),
        fileName: file.name,
        source: 'upload',
        size: formatFileSize(file.size),
        duration: formatDuration(video.duration),
        cover,
        src: objectUrl,
        tags: [...DEFAULT_VIDEO_TAGS],
      });
    };

    const captureCurrentFrame = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 180;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        finalize(canvas.toDataURL('image/jpeg', 0.82));
      } catch (error) {
        finalize();
      }
    };

    video.addEventListener('loadedmetadata', () => {
      if (video.readyState >= 2) {
        const firstFrameTime = video.duration > 0.05 ? 0.05 : 0;
        video.currentTime = firstFrameTime;
      }
    }, { once: true });

    video.addEventListener('seeked', captureCurrentFrame, { once: true });
    video.addEventListener('loadeddata', () => {
      if (video.currentTime === 0) {
        captureCurrentFrame();
      }
    }, { once: true });

    video.addEventListener('error', () => finalize(), { once: true });
  });

  const disposeVideoAsset = (video) => {
    if (video?.source === 'upload') {
      releaseObjectUrl(video.src);
    }
  };

  const openVideoPicker = (target) => {
    setPendingVideoTarget(target);

    if (videoFileInputRef.current) {
      videoFileInputRef.current.value = '';
      videoFileInputRef.current.click();
    }
  };

  const handleVideoFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file || !pendingVideoTarget) {
      return;
    }

    const nextDraft = await createVideoDraftFromFile(file);
    setVideoEditorDraft(nextDraft);
    setVideoTagInput('');
    setView('video-upload');
    event.target.value = '';
  };

  const closeVideoUploadPage = () => {
    uploadPreviewVideoRef.current?.pause();

    if (videoEditorDraft?.src) {
      releaseObjectUrl(videoEditorDraft.src);
    }

    setVideoEditorDraft(null);
    setVideoTagInput('');
    setPendingVideoTarget(null);
    setIsSavingVideo(false);
    setIsUploadPreviewPlaying(false);
    setView('create');
  };

  const addVideoTag = () => {
    const nextTag = videoTagInput.trim();

    if (!nextTag || !videoEditorDraft) {
      return;
    }

    if (videoEditorDraft.tags.includes(nextTag)) {
      showToast('该标签已存在');
      return;
    }

    if (videoEditorDraft.tags.length >= VIDEO_TAG_MAX_COUNT) {
      showToast(`最多添加 ${VIDEO_TAG_MAX_COUNT} 个标签`);
      return;
    }

    setVideoEditorDraft((prev) => ({
      ...prev,
      tags: [...prev.tags, nextTag],
    }));
    setVideoTagInput('');
  };

  const removeVideoTag = (tagToRemove) => {
    setVideoEditorDraft((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleVideoTagKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addVideoTag();
    }
  };

  const assignVideoToTarget = (target, video) => {
    if (target.type === 'mindmap') {
      setMindmapVideos((prev) => {
        prev.forEach(disposeVideoAsset);
        return [video];
      });
      return;
    }

    if (target.type === 'origin') {
      setOriginContent((prev) => {
        prev.videos.forEach(disposeVideoAsset);
        return {
          ...prev,
          videos: [video],
        };
      });
      return;
    }

    setLectureEpisodes((prev) => prev.map((episode) => {
      if (episode.id !== target.episodeId) {
        return episode;
      }

      disposeVideoAsset(episode.video);
      return {
        ...episode,
        video,
      };
    }));
  };

  const saveVideoUpload = async () => {
    if (!videoEditorDraft || !pendingVideoTarget) {
      return;
    }

    uploadPreviewVideoRef.current?.pause();
    setIsSavingVideo(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    assignVideoToTarget(pendingVideoTarget, videoEditorDraft);
    setVideoEditorDraft(null);
    setVideoTagInput('');
    setPendingVideoTarget(null);
    setIsSavingVideo(false);
    setIsUploadPreviewPlaying(false);
    setView('create');
    showToast('视频上传完成');
  };

  const toggleUploadPreviewPlayback = async () => {
    const videoElement = uploadPreviewVideoRef.current;

    if (!videoElement) {
      return;
    }

    if (videoElement.paused) {
      try {
        await videoElement.play();
        setIsUploadPreviewPlaying(true);
      } catch (error) {
        setIsUploadPreviewPlaying(false);
      }
      return;
    }

    videoElement.pause();
    setIsUploadPreviewPlaying(false);
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

  const handleOriginSaveDraft = () => {
    const hasTitle = tabTitles.text.trim() !== '';
    const hasContent = getPlainText(originContent.html) !== '';
    const hasVideo = originContent.videos.length > 0;

    if (!hasTitle && !hasContent && !hasVideo) {
      showToast('请先填写原文标题或内容');
      return;
    }

    showToast('原文草稿已保存');
  };

  const showSharedDraftButton = activeTab === 'mindmap' || activeTab === 'text';
  const handleSharedDraftSave = activeTab === 'mindmap' ? handleMindmapComplete : handleOriginSaveDraft;
  const showOriginKeyboardToolbar =
    activeTab === 'text' &&
    isOriginEditorFocused &&
    (!hasVisualViewportSupport || isOriginKeyboardVisible);
  const originKeyboardToolbarStyle = hasVisualViewportSupport && keyboardToolbarTop !== null
    ? { top: `${keyboardToolbarTop}px` }
    : { bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' };

  const addStepAt = (idx) => {
    const newSteps = [...mindmapData.steps];
    newSteps.splice(idx + 1, 0, '');
    setMindmapData({ ...mindmapData, steps: newSteps });
  };

  const removeStep = (idx) => {
    if (mindmapData.steps.length === 1) return;
    setMindmapData({ ...mindmapData, steps: mindmapData.steps.filter((_, i) => i !== idx) });
  };
  const updateMindmapField = (field, value) => {
    const nextValue = limitMindmapText(value);

    if (getCharacterCount(value) > MINDMAP_FIELD_MAX_CHARS) {
      showToast('每要素填写最多10个汉字');
    }

    setMindmapData((prev) => ({
      ...prev,
      [field]: nextValue,
    }));
  };

  const updateStep = (idx, val) => {
    const nextValue = limitMindmapText(val);

    if (getCharacterCount(val) > MINDMAP_FIELD_MAX_CHARS) {
      showToast('每要素填写最多10个汉字');
    }

    const newSteps = [...mindmapData.steps];
    newSteps[idx] = nextValue;
    setMindmapData({ ...mindmapData, steps: newSteps });
  };

  const keepEditorSelection = (event) => {
    event.preventDefault();
  };

  const getEditorRefByType = (editorType = 'origin') =>
    editorType === 'lecture' ? lectureEditorRef.current : originEditorRef.current;

  const execCommand = (command, value = null, editorType = 'origin') => {
    getEditorRefByType(editorType)?.focus();
    document.execCommand(command, false, value);
    updateHtmlContent(editorType);
  };

  const insertImage = (editorType = 'origin') => {
    const imageUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60";
    const imgHtml = `<img src="${imageUrl}" style="max-width:100%; border-radius:8px; margin: 8px 0; display:block;" />`;
    getEditorRefByType(editorType)?.focus();
    document.execCommand('insertHTML', false, imgHtml);
    updateHtmlContent(editorType);
  };

  const updateHtmlContent = (editorType = 'origin') => {
    const editorElement = getEditorRefByType(editorType);

    if (editorElement) {
      const content = editorElement.innerHTML;

      if (editorType === 'origin') {
        setOriginContent((prev) => ({ ...prev, html: content }));
        return;
      }

      setLectureEpisodes((prev) => prev.map((episode) =>
        episode.id === activeLectureEpisodeId
          ? { ...episode, html: content }
          : episode
      ));
    }
  };

  const addVideoToTarget = (target, data) => {
    const nextVideo = {
      id: Date.now(),
      cover: data.cover || getDefaultVideoCover(Date.now()),
      tags: data.tags || [],
      ...data,
    };

    assignVideoToTarget(
      target === 'mindmap'
        ? { type: 'mindmap' }
        : target === 'origin'
          ? { type: 'origin' }
          : { type: 'lecture', episodeId: activeLectureEpisodeId },
      nextVideo
    );
  };

  const addLectureEpisode = () => {
    const nextEpisode = createLectureEpisode(lectureEpisodes.length);
    setLectureEpisodes(prev => [...prev, nextEpisode]);
    setActiveLectureEpisodeId(nextEpisode.id);
    setIsLectureEditorOpen(true);
    setOpenLectureMenuId(null);
  };

  const removeLectureEpisode = (id) => {
    if (lectureEpisodes.length === 1) return;

    const removedEpisode = lectureEpisodes.find((episode) => episode.id === id);
    const removeIndex = lectureEpisodes.findIndex(episode => episode.id === id);
    const nextEpisodes = lectureEpisodes.filter(episode => episode.id !== id);
    disposeVideoAsset(removedEpisode?.video);
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
        ? (() => {
            disposeVideoAsset(episode.video);
            return { ...episode, video: null };
          })()
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
          <div key={item.id} className="flex items-start gap-4">
            <div className="relative h-[120px] w-[180px] shrink-0 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#5C6F8A_0%,#2F4A67_100%)]">
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#FF5E5E] shadow-[0_6px_16px_rgba(17,24,39,0.14)] backdrop-blur-sm transition active:scale-95"
                aria-label="删除视频"
              >
                <Trash2 size={16} />
              </button>
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
              <div className="absolute bottom-2 left-2 rounded-[10px] bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white">
                {item.duration || '12:45'}
              </div>
            </div>

            <div className="min-w-0 flex-1 self-stretch py-2">
              <div
                className="truncate text-[14px] font-bold leading-6 text-[#111827]"
                title={item.fileName || item.title}
              >
                {truncateMiddle(item.fileName || item.title, 24)}
              </div>
              {item.tags?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={`${item.id}-${tag}`}
                      className="rounded-full bg-[#FCEAEC] px-2.5 py-1 text-[11px] font-semibold text-[#C8161D]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
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
              上传视频
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
        <div className="h-10 w-10 shrink-0" />
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
              {activeLectureEpisode.video && (
                <button
                  type="button"
                  onClick={removeActiveLectureVideo}
                  onKeyDown={(event) => handleDivActionKeyDown(event, removeActiveLectureVideo)}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#FF5E5E] shadow-[0_6px_16px_rgba(17,24,39,0.14)] backdrop-blur-sm transition active:scale-95"
                  aria-label="删除视频"
                >
                  <Trash2 size={16} />
                </button>
              )}
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
              <div className="flex items-start gap-3 bg-[#FAFAFC] px-4 py-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#C8161D] text-white">
                  <Video size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="truncate text-[13px] font-bold text-[#374151]"
                    title={activeLectureEpisode.video.fileName || activeLectureEpisode.video.title}
                  >
                    {truncateMiddle(activeLectureEpisode.video.fileName || activeLectureEpisode.video.title, 28)}
                  </div>
                  {activeLectureEpisode.video.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeLectureEpisode.video.tags.map((tag) => (
                        <span
                          key={`${activeLectureEpisode.video.id}-${tag}`}
                          className="rounded-full bg-[#FCEAEC] px-2.5 py-1 text-[11px] font-semibold text-[#C8161D]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                onClick={() => openVideoPicker({ type: 'lecture', episodeId: activeLectureEpisodeId })}
                onKeyDown={(event) => handleDivActionKeyDown(event, () => openVideoPicker({ type: 'lecture', episodeId: activeLectureEpisodeId }))}
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
            onClick={() => openVideoPicker({ type: 'lecture', episodeId: activeLectureEpisodeId })}
            onKeyDown={(event) => handleDivActionKeyDown(event, () => openVideoPicker({ type: 'lecture', episodeId: activeLectureEpisodeId }))}
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
              <div onMouseDown={keepEditorSelection} onClick={() => execCommand('bold', null, 'lecture')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('bold', null, 'lecture'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="加粗"><Bold size={17} /></div>
              <div onMouseDown={keepEditorSelection} onClick={() => execCommand('italic', null, 'lecture')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('italic', null, 'lecture'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="斜体"><Italic size={17} /></div>
              <div onMouseDown={keepEditorSelection} onClick={() => execCommand('underline', null, 'lecture')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('underline', null, 'lecture'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="下划线"><Underline size={17} /></div>
              <div className="mx-1 h-5 w-px bg-[#E5E7EB]" />
              <div onMouseDown={keepEditorSelection} onClick={() => execCommand('insertUnorderedList', null, 'lecture')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('insertUnorderedList', null, 'lecture'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="项目列表"><List size={17} /></div>
              <div onMouseDown={keepEditorSelection} onClick={() => execCommand('formatBlock', 'blockquote', 'lecture')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('formatBlock', 'blockquote', 'lecture'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="引用"><Quote size={17} /></div>
              <div onMouseDown={keepEditorSelection} onClick={() => execCommand('createLink', '#', 'lecture')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('createLink', '#', 'lecture'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="链接"><Link size={17} /></div>
              <div className="ml-auto flex gap-1 text-gray-300">
                <div onMouseDown={keepEditorSelection} onClick={() => execCommand('undo', null, 'lecture')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('undo', null, 'lecture'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="撤销"><Undo2 size={17} /></div>
                <div onMouseDown={keepEditorSelection} onClick={() => execCommand('redo', null, 'lecture')} onKeyDown={(event) => handleDivActionKeyDown(event, () => execCommand('redo', null, 'lecture'))} className="flex h-8 w-8 items-center justify-center rounded-md active:bg-gray-100" role="button" tabIndex={0} aria-label="重做"><Redo2 size={17} /></div>
              </div>
            </div>
            <div
              key={activeLectureEpisode.id}
              ref={lectureEditorRef}
              contentEditable
              onInput={() => updateHtmlContent('lecture')}
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

        <div className="pt-6">
          <button
            type="button"
            onClick={saveLectureEpisode}
            className="flex h-[48px] w-full items-center justify-center rounded-[15px] bg-[#C8161D] text-[18px] font-bold text-white"
          >
            保存草稿
          </button>
        </div>
      </div>
    </div>
  );

  const renderVideoUploadPage = () => (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#EEF0F4] bg-white px-4">
        <button
          type="button"
          onClick={closeVideoUploadPage}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#374151] active:bg-gray-100"
          aria-label="返回上一页"
        >
          <ChevronLeft size={24} strokeWidth={2.3} />
        </button>
        <div className="text-[17px] font-bold text-[#111827]">设置标签</div>
        <div
          onClick={() => {
            if (!videoEditorDraft || isSavingVideo) return;
            saveVideoUpload();
          }}
          className={`rounded-full bg-[#C8161D] px-4 py-1.5 text-[10px] font-medium text-white transition-all ${
            !videoEditorDraft || isSavingVideo ? 'cursor-not-allowed opacity-60' : ''
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              if (!videoEditorDraft || isSavingVideo) return;
              saveVideoUpload();
            }
          }}
        >
          {isSavingVideo ? '上传中' : '保存'}
        </div>
      </div>

      {videoEditorDraft && (
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="overflow-hidden rounded-[24px] bg-white">
            <button
              type="button"
              onClick={toggleUploadPreviewPlayback}
              className="relative block aspect-video w-full overflow-hidden bg-black"
              aria-label={isUploadPreviewPlaying ? '暂停视频预览' : '播放视频预览'}
            >
              {!isUploadPreviewPlaying && videoEditorDraft.cover && (
                <img
                  src={videoEditorDraft.cover}
                  alt="视频封面"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <video
                ref={uploadPreviewVideoRef}
                preload="metadata"
                poster={videoEditorDraft.cover}
                src={videoEditorDraft.src}
                className={`h-full w-full object-cover ${isUploadPreviewPlaying ? 'opacity-100' : 'opacity-0'}`}
                playsInline
                controls={false}
                onPlay={() => setIsUploadPreviewPlaying(true)}
                onPause={() => setIsUploadPreviewPlaying(false)}
                onEnded={() => setIsUploadPreviewPlaying(false)}
              />
              <div className="absolute inset-0 bg-black/18" />
              {!isUploadPreviewPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-black/35 text-white">
                    <Play size={28} fill="white" color="white" />
                  </div>
                </div>
              )}
              {isUploadPreviewPlaying && (
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
              )}
            </button>
          </div>

          <div className="mt-5 bg-white">
            <div className="mb-3  items-center gap-x-1.5 gap-y-1">
              <div className="text-[13px] font-bold text-[#1F2329]">视频标签</div>
              <div className="text-[11px] mt-[3px] font-medium leading-4 text-[#A0A7B4]">
                用于分类和检索，最多添加 {VIDEO_TAG_MAX_COUNT} 个
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {videoEditorDraft.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex h-[25px] items-center gap-1 rounded-full bg-[#FCEAEC] px-2 text-[#C8161D]"
                >
                  <span className="text-[12px] font-semibold leading-none tracking-[0.01em]">{tag}</span>
                  <button
                    type="button"
                    aria-label={`删除标签${tag}`}
                    onClick={() => removeVideoTag(tag)}
                    className="flex h-3 w-3 items-center justify-center rounded-full"
                  >
                    <X size={10} strokeWidth={2.25} />
                  </button>
                </div>
              ))}

              {videoEditorDraft.tags.length < VIDEO_TAG_MAX_COUNT && (
                <div className="flex min-w-[120px] flex-1 items-center border-b-2 border-[#C8161D] pb-0.5">
                  <input
                    type="text"
                    value={videoTagInput}
                    onChange={(event) => setVideoTagInput(event.target.value.slice(0, 12))}
                    onKeyDown={handleVideoTagKeyDown}
                    placeholder="添加标签（回车创建）"
                    className="w-full border-none bg-transparent text-[10px] leading-none text-[#1F2329] outline-none placeholder:text-[12px] placeholder:text-[#A0A7B4]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCreatePage = () => {
    if (activeTab === 'video' && isLectureEditorOpen && activeLectureEpisode) {
      return renderLectureEditPage();
    }

    const createTabs = [
      { id: 'mindmap', label: '脑图', icon: <Share2 size={18} /> },
      { id: 'text', label: '原文', icon: <FileText size={18} /> },
      { id: 'video', label: '讲解', icon: <Video size={18} /> },
    ];

    return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 顶部导航 */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shrink-0">
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
        <div className="flex items-center gap-2">
          {showSharedDraftButton && (
            <div
              onClick={handleSharedDraftSave}
              className="rounded-full bg-[#C8161D] px-4 py-1.5 text-[10px] font-medium text-white transition-all"
            >
              保存
            </div>
          )}
          <div 
            onClick={handleSubmit}
            className="rounded-full bg-[#C8161D] px-4 py-1.5 text-[10px] font-medium text-white transition-all"
          >
            提交审核
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-32 pt-4">
        {activeTab === 'mindmap' && (
          <div className="flex min-h-full flex-col gap-4">
            <div>
              <input
                type="text"
                placeholder="请输入脑图标题"
                className="min-w-0 flex-1 border-none bg-transparent text-[18px] font-bold leading-[1.6] text-[#1F2329] outline-none placeholder:font-medium placeholder:text-[#C9CDD7]"
                value={tabTitles.mindmap}
                onChange={(e) => updateTabTitle('mindmap', e.target.value)}
              />
            </div>
            <div className="px-1 py-2 text-[16px] leading-8 text-gray-800">
              做 <input className="inline-input" style={{ width: getInlineInputWidth(mindmapData.action) }} value={mindmapData.action} onChange={(e) => updateMindmapField('action', e.target.value)} /> 事，关键在于 <input className="inline-input" style={{ width: getInlineInputWidth(mindmapData.keyPoint) }} value={mindmapData.keyPoint} onChange={(e) => updateMindmapField('keyPoint', e.target.value)} />。<br />
              要针对 <input className="inline-input" style={{ width: getInlineInputWidth(mindmapData.target) }} value={mindmapData.target} onChange={(e) => updateMindmapField('target', e.target.value)} />，鉴于 <input className="inline-input" style={{ width: getInlineInputWidth(mindmapData.situation) }} value={mindmapData.situation} onChange={(e) => updateMindmapField('situation', e.target.value)} /> 的形势，发挥 <input className="inline-input" style={{ width: getInlineInputWidth(mindmapData.advantage) }} value={mindmapData.advantage} onChange={(e) => updateMindmapField('advantage', e.target.value)} /> 的优势，本着 <input className="inline-input" style={{ width: getInlineInputWidth(mindmapData.principle) }} value={mindmapData.principle} onChange={(e) => updateMindmapField('principle', e.target.value)} /> 的原则，运用 <input className="inline-input" style={{ width: getInlineInputWidth(mindmapData.method) }} value={mindmapData.method} onChange={(e) => updateMindmapField('method', e.target.value)} /> 的方法，通过如下步骤：
              
              <div className="my-4 space-y-2">
                {mindmapData.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="shrink-0 min-w-7 text-[16px] text-[#3F3F46]">{idx + 1}.</span>
                    <input className="flex-1 border-b border-[#A1A1AA] px-1 py-1 text-[16px] text-[#C8161D] outline-none" value={step} onChange={(e) => updateStep(idx, e.target.value)} />
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

              经过 <input className="inline-input" style={{ width: getInlineInputWidth(mindmapData.time) }} value={mindmapData.time} onChange={(e) => updateMindmapField('time', e.target.value)} /> (机遇期)，实现 <input className="inline-input" style={{ width: getInlineInputWidth(mindmapData.goal) }} value={mindmapData.goal} onChange={(e) => updateMindmapField('goal', e.target.value)} /> 的目标。
            </div>

            <AttachedVideoSection
              items={mindmapVideos}
              maxCount={1}
              onAdd={() => openVideoPicker({ type: 'mindmap' })}
              onRemove={(id) => setMindmapVideos((prev) => {
                const nextVideos = prev.filter((video) => {
                  if (video.id === id) {
                    disposeVideoAsset(video);
                    return false;
                  }

                  return true;
                });
                return nextVideos;
              })}
            />
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            <div className="">
              <input
                type="text"
                placeholder="请输入原文标题"
                className="min-w-0 w-full border-none bg-transparent text-left text-[18px] font-bold leading-[1.6] text-[#1F2329] outline-none placeholder:font-medium placeholder:text-[#C9CDD7]"
                value={tabTitles.text}
                onChange={(e) => updateTabTitle('text', e.target.value)}
              />
            </div>
            <div className="relative min-h-[400px] overflow-hidden rounded-[22px] bg-white">
              <div
                ref={originEditorRef}
                contentEditable
                onInput={() => updateHtmlContent('origin')}
                className="flex-1 overflow-y-auto px-4 pb-24 text-left text-[15px] leading-8 text-[#374151] outline-none no-scrollbar"
                style={{ minHeight: '300px', textAlign: 'left' }}
                dangerouslySetInnerHTML={{ __html: originContent.html }}
              />
              {!originContent.html && (
                <div className="pointer-events-none absolute left-1 right-4 top-1 w-auto text-left text-sm text-gray-300">
                  请输入原文内容...
                </div>
              )}
            </div>
            {originContent.videos.length > 0 && (
              <AttachedVideoSection
                items={originContent.videos}
                maxCount={1}
                onAdd={() => openVideoPicker({ type: 'origin' })}
                onRemove={(id) =>
                  setOriginContent((prev) => ({
                    ...prev,
                    videos: prev.videos.filter((video) => {
                      if (video.id === id) {
                        disposeVideoAsset(video);
                        return false;
                      }

                      return true;
                    }),
                  }))
                }
              />
            )}
          </div>
        )}

        {activeTab === 'video' && (
          <div className="space-y-4">
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
                          {episode.video?.tags?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {episode.video.tags.map((tag) => (
                                <span
                                  key={`${episode.id}-${tag}`}
                                  className="rounded-full bg-[#FCEAEC] px-2.5 py-1 text-[10px] font-semibold text-[#C8161D]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
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
                              <span className="absolute bottom-2 left-2 rounded-md bg-black/45 px-2 py-0.5 text-[12px] font-bold text-white">
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

      {showOriginKeyboardToolbar && (
        <div
          className="pointer-events-none fixed inset-x-0 z-30"
          style={originKeyboardToolbarStyle}
        >
          <div className="pointer-events-auto flex h-12 w-full items-center gap-1 border-t border-[#D1D5DB] bg-white px-3">
            <button
              type="button"
              onMouseDown={keepEditorSelection}
              onClick={() => execCommand('bold', null, 'origin')}
              className="flex h-9 min-w-9 items-center justify-center rounded-[12px] text-[#2B2F36] active:bg-[#F5F6F8]"
              aria-label="加粗"
            >
              <Bold size={18} strokeWidth={2.4} />
            </button>
            <button
              type="button"
              onMouseDown={keepEditorSelection}
              onClick={() => execCommand('underline', null, 'origin')}
              className="flex h-9 min-w-9 items-center justify-center rounded-[12px] text-[#2B2F36] active:bg-[#F5F6F8]"
              aria-label="下划线"
            >
              <Underline size={18} strokeWidth={2.2} />
            </button>
            <div className="mx-1 h-5 w-px bg-[#E5E7EB]" />
            <button
              type="button"
              onMouseDown={keepEditorSelection}
              onClick={() => insertImage('origin')}
              className="flex h-9 min-w-9 items-center justify-center rounded-[12px] text-[#2B2F36] active:bg-[#F5F6F8]"
              aria-label="插图"
            >
              <ImageIcon size={18} strokeWidth={2.2} />
            </button>
            <div className="mx-1 h-5 w-px bg-[#E5E7EB]" />
            <button
              type="button"
              onMouseDown={keepEditorSelection}
              onClick={() => openVideoPicker({ type: 'origin' })}
              className="flex h-9 min-w-9 items-center justify-center rounded-[12px] text-[#2B2F36] active:bg-[#F5F6F8]"
              aria-label="添加视频"
            >
              <Video size={18} strokeWidth={2.1} />
            </button>
          </div>
        </div>
      )}

      {!showOriginKeyboardToolbar && (
        <div
          className="pointer-events-none absolute inset-x-4 z-20"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 36px)' }}
        >
          <div className="pointer-events-auto flex gap-3">
            {createTabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex h-[40px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[12px] border px-3 transition-all active:scale-[0.98] ${
                    isActive
                      ? 'border-[#C8161D] bg-[#C8161D] text-white'
                      : 'border-[#E5E7EB] bg-white text-[#3F3F46]'
                  }`}
                >
                  {React.cloneElement(tab.icon, { size: 16, strokeWidth: isActive ? 2.25 : 2 })}
                  <span className={`truncate text-[13px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
    <div className="flex min-h-screen w-full justify-center bg-gray-100 font-sans">
      <div className="relative flex h-screen w-full max-w-[430px] flex-col overflow-hidden bg-white text-[#1F2329] shadow-2xl">
        <input
          ref={videoFileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoFileChange}
        />
        {view === 'create'
          ? renderCreatePage()
          : view === 'library'
            ? renderLibraryPage()
            : view === 'video-upload'
              ? renderVideoUploadPage()
              : renderBrowsePage()}
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
