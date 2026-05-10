import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, 
  ChevronDown,
  Plus, 
  Minus,
  FileText, 
  Video, 
  Share2, 
  PlayCircle,
  Play,
  Bold,
  Underline,
  Image as ImageIcon,
  Search,
  X,
  RefreshCw,
  FilePen,
} from 'lucide-react';
import './player.css';
import MindmapPreviewPage from '../components/MindmapPreviewPage.jsx';
import AttachedVideoSection from '../components/AttachedVideoSection.jsx';
import ContentTabPanel from '../components/ContentTabPanel.jsx';
import ContentPreviewPage from '../components/ContentPreviewPage.jsx';

const THEME_COLOR = '#C8161D';

const DRAFT_CONTENT_500 = `根数据是一套可以被团队反复调用的表达资产，它的价值不在于写完，而在于能否被看懂、被复用、被执行。

创作一条优质根数据，需要先想清楚三件事：观点清楚、结构清楚、动作清楚。观点决定读者为什么要继续看，结构决定读者能否快速理解，动作决定内容是否能真正进入业务场景。

在脑图阶段，把核心方法论提炼成关键要素，确保每一个节点都指向可执行的行动。在原文阶段，把脑图里的逻辑展开，用段落叙述清楚每个论点背后的依据和推演过程。在讲解阶段，把原文里的精华浓缩为一段说给人听的内容，让团队成员能够快速理解并付诸行动。

一条好的根数据，最终的检验标准不是它有多完整，而是团队在业务场景里能否调用它来解决真实问题。根数据创作的起点是一个真实的业务挑战，终点是一套可以被反复执行的方法论沉淀。`;


const DEFAULT_VIDEO_COVERS = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
];
const MINDMAP_FIELD_MAX_CHARS = 10;
const TITLE_MAX_CHARS = 50;
const VIDEO_TAG_MAX_COUNT = 5;
const DEFAULT_VIDEO_TAGS = ['战略', '认知', '增长'];
const ROOT_DATA_TYPE_OPTIONS = ['经验总结', '阅读心得', '未来打算'];
const REVIEW_SUBMIT_ENDPOINT = '/api/root-data/review';

const getCharacterCount = (value = '') => Array.from(value).length;
const limitMindmapText = (value = '') =>
  Array.from(value).slice(0, MINDMAP_FIELD_MAX_CHARS).join('');
const limitTitleText = (value = '') =>
  Array.from(value.replace(/[\r\n]+/g, '')).slice(0, TITLE_MAX_CHARS).join('');
const getInlineInputWidth = (value = '') => `${Math.max(getCharacterCount(value) + 1, 4)}em`;

const getDefaultVideoCover = (seed = 0) => DEFAULT_VIDEO_COVERS[Math.abs(seed) % DEFAULT_VIDEO_COVERS.length];
const createVideoPlaceholderCover = (title = '视频预览') => {
  const safeTitle = encodeURIComponent(title.slice(0, 18) || '视频预览');

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C8161D" />
          <stop offset="100%" stop-color="#1F2937" />
        </linearGradient>
      </defs>
      <rect width="1280" height="720" rx="48" fill="url(#bg)" />
      <circle cx="640" cy="320" r="88" fill="rgba(255,255,255,0.16)" />
      <polygon points="620,272 620,368 698,320" fill="#FFFFFF" />
      <text x="640" y="470" text-anchor="middle" fill="#FFFFFF" font-size="44" font-family="Arial, sans-serif" font-weight="700">${decodeURIComponent(safeTitle)}</text>
      <text x="640" y="528" text-anchor="middle" fill="rgba(255,255,255,0.78)" font-size="24" font-family="Arial, sans-serif">iOS 预览封面</text>
    </svg>`
  )}`;
};
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

const serializeVideoAsset = (video = {}) => ({
  id: video.id ?? '',
  title: video.title ?? '',
  fileName: video.fileName ?? '',
  source: video.source ?? '',
  size: video.size ?? '',
  duration: video.duration ?? '',
  cover: video.cover ?? '',
  tags: Array.isArray(video.tags) ? video.tags : [],
});

const getPlainText = (html = '') =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const createEmptyLectureItem = () => ({
  id: `lecture-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: '',
  html: '',
  videos: [],
  isSaved: false,
});

const isLectureItemComplete = (item) =>
  item.title.trim() !== '' &&
  getPlainText(item.html) !== '' &&
  item.videos.length > 0;

const LECTURE_INDEX_CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const getLectureItemLabel = (item, index) => item.title.trim() || `讲解 ${index + 1}`;
const getLectureIndexLabel = (index) => LECTURE_INDEX_CN[index] ?? `${index + 1}`;
const getLectureSheetTitle = (item, index) => {
  const title = item.title.trim();

  return title ? `讲解${getLectureIndexLabel(index)}: ${title}` : `讲解${getLectureIndexLabel(index)}`;
};

const PREVIEW_IMAGE_URL = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';
const FAKE_ORIGINAL_PREVIEW_HTML = `
  <article>
    <p><strong>根数据不是一段孤立内容，</strong>而是一套可以被团队反复调用的表达资产。它的价值不在于“写完”，而在于是否能被看懂、被复用、被执行。</p>
    <p>当我们把一条方法论沉淀为原文时，需要先交代清楚背景，再把重点拆开讲透。只有这样，后续的讲解、分发和协作才会更顺畅。</p>
    <img src="${PREVIEW_IMAGE_URL}" alt="原文预览示意图" style="width:100%; border-radius:18px; margin:18px 0; display:block;" />
    <p>一条合格的原文，至少要同时满足三件事：<strong>观点清楚</strong>、<u>结构清楚</u>、动作清楚。观点决定读者为什么继续看，结构决定读者能不能快速理解，动作决定内容是否能真正进入业务场景。</p>
    <p>所以在预览态里，我们更希望看到的是一份“像正式内容”的样子：有段落层次，有强调重点，也有足够直观的图片辅助，而不是一块没有节奏的大段文字。</p>
  </article>
`;

const buildFakeLecturePreviewData = (count = 1) =>
  Array.from({ length: Math.max(count, 1) }, (_, index) => {
    const lectureNo = getLectureIndexLabel(index);

    return {
      content: {
        id: `fake-lecture-${index + 1}`,
        title: `讲解${lectureNo}：把根数据讲透`,
        html: `
          <article>
            <p><strong>这是一段用于预览的演示讲解内容。</strong>我们在这里故意保留明显的版式层次，方便你确认讲解页在正式上线前的观感。</p>
            <p>讲解页和原文页不一样，它更强调“说给人听”的节奏，所以段落通常会更短，重点句会更明确，关键动作也会被单独提出来。</p>
            <img src="${DEFAULT_VIDEO_COVERS[index % DEFAULT_VIDEO_COVERS.length]}" alt="讲解预览示意图" style="width:100%; border-radius:18px; margin:18px 0; display:block;" />
            <p>比如这里会把核心提醒直接标出来：<u>先让用户明白为什么重要，再告诉他下一步怎么做。</u>这样讲解才不会只停留在“解释”，而会自然过渡到“行动”。</p>
            <p>最后再补一段总结：<strong>讲解的终点不是播放完成，而是让人愿意回到场景里继续执行。</strong>这类加粗和下划线，也能帮你快速确认当前预览样式是否符合预期。</p>
          </article>
        `,
        content: '',
      },
      video: {
        id: `fake-lecture-video-${index + 1}`,
        title: `讲解${lectureNo}：预览示例`,
        duration: index % 2 === 0 ? '03:28' : '04:12',
      },
    };
  });

function TitleTextarea({ value, onChange, placeholder }) {
  const textareaRef = useRef(null);

  const syncTextareaHeight = () => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      onInput={syncTextareaHeight}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      }}
      className="min-h-[29px] w-full resize-none overflow-hidden border-none bg-transparent p-0 text-left text-[18px] font-bold leading-[1.6] text-[#1F2329] outline-none placeholder:font-medium placeholder:text-[#C9CDD7]"
    />
  );
}

const App = () => {
  const navigate = useNavigate();
  const initialLectureItemRef = useRef(null);
  if (!initialLectureItemRef.current) {
    initialLectureItemRef.current = createEmptyLectureItem();
  }

  const [view, setView] = useState('create'); // 'create', 'browse', 'library', 'video-upload', 'content-preview', 'submit-review'
  const [activeTab, setActiveTab] = useState('mindmap');
  const [tabTitles, setTabTitles] = useState({
    mindmap: '',
    text: '',
  });
  const [toastMessage, setToastMessage] = useState('');
  const [videoEditorDraft, setVideoEditorDraft] = useState(null);
  const [videoTagInput, setVideoTagInput] = useState('');
  const [pendingVideoTarget, setPendingVideoTarget] = useState(null);
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const [isUploadPreviewPlaying, setIsUploadPreviewPlaying] = useState(false);
  const [isOriginEditorFocused, setIsOriginEditorFocused] = useState(false);
  const [isLectureEditorFocused, setIsLectureEditorFocused] = useState(false);
  const [hasVisualViewportSupport, setHasVisualViewportSupport] = useState(false);
  const [keyboardToolbarTop, setKeyboardToolbarTop] = useState(null);
  const [isOriginKeyboardVisible, setIsOriginKeyboardVisible] = useState(false);
  const [contentPreview, setContentPreview] = useState(null);
  const [lectureItems, setLectureItems] = useState(() => [initialLectureItemRef.current]);
  const [activeLectureId, setActiveLectureId] = useState(initialLectureItemRef.current.id);
  const [isLectureSheetOpen, setIsLectureSheetOpen] = useState(false);
  const [selectedRootDataType, setSelectedRootDataType] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [okStyleIndex, setOkStyleIndex] = useState(0);
  const originEditorRef = useRef(null);
  const lectureEditorRef = useRef(null);
  const imageFileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const uploadPreviewVideoRef = useRef(null);
  const createdObjectUrlsRef = useRef(new Set());
  const visualViewportBaselineRef = useRef(0);
  const savedEditorSelectionRef = useRef(null);
  const pendingImageEditorTypeRef = useRef('origin');
  const editingOriginalSrcRef = useRef(null);
  const videoPickerActionRef = useRef('new'); // 'new' | 'replace'
  const pendingReplaceOldSrcRef = useRef(null);
  const isVideoEditModeRef = useRef(false);

  const floatingCreateBtnRef = useRef(null);
  const floatingCreateDragRef = useRef({
    isDragging: false,
    pointerOffsetX: 0,
    pointerOffsetY: 0,
    startX: 0,
    startY: 0,
    suppressClick: false,
  });
  const [floatingCreateBtnPos, setFloatingCreateBtnPos] = useState({ x: 0, y: 0 });

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

  const activeLectureIndex = Math.max(lectureItems.findIndex((item) => item.id === activeLectureId), 0);
  const activeLectureItem = lectureItems[activeLectureIndex] ?? lectureItems[0] ?? initialLectureItemRef.current;
  const savedLectureCount = lectureItems.filter((item) => item.isSaved).length;

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
    lectureItems.some((item) => item.isSaved && isLectureItemComplete(item));

  useEffect(() => {
    const lectureSummary = lectureItems.map((item, index) => ({
      index: index + 1,
      id: item.id,
      title: item.title || `讲解 ${index + 1}`,
      isSaved: item.isSaved,
      hasContent: getPlainText(item.html) !== '',
      hasVideo: item.videos.length > 0,
    }));

    console.info('[RootDataPage] lecture state changed', {
      activeTab,
      activeLectureId,
      lectureCount: lectureItems.length,
      savedLectureCount,
      shouldShowLectureDropdown: savedLectureCount >= 1,
      isLectureSheetOpen,
      lectureSummary,
    });
  }, [activeLectureId, activeTab, isLectureSheetOpen, lectureItems, savedLectureCount]);

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
        setIsLectureEditorFocused(false);
      }

      if (event.target === lectureEditorRef.current) {
        setIsLectureEditorFocused(true);
        setIsOriginEditorFocused(false);
      }
    };

    const handleFocusOut = (event) => {
      if (event.target !== originEditorRef.current && event.target !== lectureEditorRef.current) {
        return;
      }

      window.setTimeout(() => {
        setIsOriginEditorFocused(document.activeElement === originEditorRef.current);
        setIsLectureEditorFocused(document.activeElement === lectureEditorRef.current);
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
    if (activeTab !== 'text' && activeTab !== 'video') {
      setIsOriginEditorFocused(false);
      setIsLectureEditorFocused(false);
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

  useEffect(() => {
    const updateCreateBtnPosition = () => {
      const container = document.querySelector('.floating-create-container');
      const button = floatingCreateBtnRef.current;
      if (!container || !button) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const buttonWidth = button.offsetWidth || 50;
      const buttonHeight = button.offsetHeight || 75;

      setFloatingCreateBtnPos((current) => {
        const hasInitialPosition = current.x !== 0 || current.y !== 0;
        const defaultX = containerWidth - buttonWidth - 14;
        const defaultY = containerHeight - buttonHeight - 100;

        if (!hasInitialPosition) {
          return { x: defaultX, y: defaultY };
        }

        return {
          x: Math.min(Math.max(12, current.x), containerWidth - buttonWidth - 12),
          y: Math.min(Math.max(72, current.y), containerHeight - buttonHeight - 12),
        };
      });
    };

    updateCreateBtnPosition();
    window.addEventListener('resize', updateCreateBtnPosition);
    return () => window.removeEventListener('resize', updateCreateBtnPosition);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!floatingCreateDragRef.current.isDragging) return;

      const container = document.querySelector('.floating-create-container');
      const button = floatingCreateBtnRef.current;
      if (!container || !button) return;

      const containerRect = container.getBoundingClientRect();
      const buttonWidth = button.offsetWidth;
      const buttonHeight = button.offsetHeight;
      const nextX = event.clientX - containerRect.left - floatingCreateDragRef.current.pointerOffsetX;
      const nextY = event.clientY - containerRect.top - floatingCreateDragRef.current.pointerOffsetY;
      const movedDistance = Math.hypot(
        event.clientX - floatingCreateDragRef.current.startX,
        event.clientY - floatingCreateDragRef.current.startY
      );

      if (movedDistance > 4) {
        floatingCreateDragRef.current.suppressClick = true;
      }

      setFloatingCreateBtnPos({
        x: Math.min(Math.max(12, nextX), containerRect.width - buttonWidth - 12),
        y: Math.min(Math.max(72, nextY), containerRect.height - buttonHeight - 12),
      });
    };

    const handlePointerUp = () => {
      floatingCreateDragRef.current.isDragging = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const handleTabClick = (tab) => {
    if (tab !== 'video') {
      setIsLectureSheetOpen(false);
    }

    setActiveTab(tab);
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

  const updateLectureItem = (lectureId, updater) => {
    setLectureItems((prev) => prev.map((item) => (
      item.id === lectureId ? updater(item) : item
    )));
  };

  const openLectureSheet = () => {
    console.info('[RootDataPage] openLectureSheet requested', {
      lectureCount: lectureItems.length,
      savedLectureCount,
      canOpen: savedLectureCount >= 1,
    });

    setActiveTab('video');

    if (savedLectureCount >= 1) {
      setIsLectureSheetOpen(true);
    }
  };

  const selectLectureItem = (lectureId) => {
    console.info('[RootDataPage] selectLectureItem', {
      lectureId,
      previousActiveLectureId: activeLectureId,
    });
    setActiveLectureId(lectureId);
    setActiveTab('video');
    setIsLectureSheetOpen(false);
  };

  const addLectureItem = () => {
    const nextLectureItem = createEmptyLectureItem();
    console.info('[RootDataPage] addLectureItem', {
      previousLectureCount: lectureItems.length,
      nextLectureId: nextLectureItem.id,
    });

    setLectureItems((prev) => [...prev, nextLectureItem]);
    setActiveLectureId(nextLectureItem.id);
    setActiveTab('video');
    setIsLectureSheetOpen(false);
  };

  const createVideoDraftFromFile = (file) => new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    trackObjectUrl(objectUrl);
    const fallbackCover = createVideoPlaceholderCover(stripFileExtension(file.name));

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    let isResolved = false;

    const finalize = (cover = fallbackCover) => {
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
        cover: cover || fallbackCover,
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
        finalize(fallbackCover);
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

    video.addEventListener('error', () => finalize(fallbackCover), { once: true });
    window.setTimeout(() => finalize(fallbackCover), 1600);
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

  const openVideoEditor = (target, existingVideo) => {
    editingOriginalSrcRef.current = existingVideo.src || null;
    isVideoEditModeRef.current = true;
    setVideoEditorDraft({ ...existingVideo });
    setVideoTagInput('');
    setPendingVideoTarget(target);
    setView('video-upload');
  };

  const handleReplaceVideoClick = () => {
    pendingReplaceOldSrcRef.current = videoEditorDraft?.src || null;
    videoPickerActionRef.current = 'replace';

    if (videoFileInputRef.current) {
      videoFileInputRef.current.value = '';
      videoFileInputRef.current.click();
    }
  };

  const handleVideoFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file || !pendingVideoTarget) {
      videoPickerActionRef.current = 'new';
      pendingReplaceOldSrcRef.current = null;
      return;
    }

    const nextDraft = await createVideoDraftFromFile(file);

    if (videoPickerActionRef.current === 'replace') {
      // 如果在本次编辑中已替换过一次，需释放上一个临时 src
      const oldSrc = pendingReplaceOldSrcRef.current;
      if (oldSrc && oldSrc !== editingOriginalSrcRef.current) {
        releaseObjectUrl(oldSrc);
      }
      pendingReplaceOldSrcRef.current = null;
      videoPickerActionRef.current = 'new';
      // 保留已有标签，其余元数据用新文件覆盖
      setVideoEditorDraft((prev) => ({
        ...nextDraft,
        tags: prev?.tags ?? nextDraft.tags,
      }));
    } else {
      setVideoEditorDraft(nextDraft);
      setVideoTagInput('');
      setView('video-upload');
    }

    event.target.value = '';
  };

  const closeVideoUploadPage = () => {
    uploadPreviewVideoRef.current?.pause();

    // 编辑模式下，若未更换视频，draft.src 与原始 src 相同，不能释放（原视频仍在使用）
    if (videoEditorDraft?.src && videoEditorDraft.src !== editingOriginalSrcRef.current) {
      releaseObjectUrl(videoEditorDraft.src);
    }

    editingOriginalSrcRef.current = null;
    isVideoEditModeRef.current = false;
    videoPickerActionRef.current = 'new';
    pendingReplaceOldSrcRef.current = null;
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

  const assignVideoToTarget = (target, video, { disposeOld = true } = {}) => {
    if (target.type === 'mindmap') {
      setMindmapVideos((prev) => {
        if (disposeOld) prev.forEach(disposeVideoAsset);
        return [video];
      });
      return;
    }

    if (target.type === 'origin') {
      setOriginContent((prev) => {
        if (disposeOld) prev.videos.forEach(disposeVideoAsset);
        return {
          ...prev,
          videos: [video],
        };
      });
      return;
    }

    const targetLectureId = target.lectureId ?? activeLectureItem.id;
    updateLectureItem(targetLectureId, (item) => {
      if (disposeOld) item.videos.forEach(disposeVideoAsset);

      return {
        ...item,
        videos: [video],
      };
    });
  };

  const saveVideoUpload = async () => {
    if (!videoEditorDraft || !pendingVideoTarget) {
      return;
    }

    uploadPreviewVideoRef.current?.pause();
    setIsSavingVideo(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));

    // 编辑模式且未更换视频时，src 相同，不能 dispose 旧视频的 URL（即将继续使用）
    const isEditSameSrc =
      editingOriginalSrcRef.current !== null &&
      videoEditorDraft.src === editingOriginalSrcRef.current;

    assignVideoToTarget(pendingVideoTarget, videoEditorDraft, { disposeOld: !isEditSameSrc });

    editingOriginalSrcRef.current = null;
    isVideoEditModeRef.current = false;
    videoPickerActionRef.current = 'new';
    pendingReplaceOldSrcRef.current = null;
    setVideoEditorDraft(null);
    setVideoTagInput('');
    setPendingVideoTarget(null);
    setIsSavingVideo(false);
    setIsUploadPreviewPlaying(false);
    setView('create');
    showToast('视频保存成功');
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
    const nextValue = limitTitleText(value);

    if (getCharacterCount(value.replace(/[\r\n]+/g, '')) > TITLE_MAX_CHARS) {
      showToast(`标题最多支持${TITLE_MAX_CHARS}个汉字`);
    }

    if (tab === 'video') {
      updateLectureItem(activeLectureItem.id, (item) => ({
        ...item,
        title: nextValue,
      }));
      return;
    }

    setTabTitles((prev) => ({
      ...prev,
      [tab]: nextValue,
    }));
  };

  const openMindmapPreview = () => {
    setView('browse');
  };

  const openContentPreview = (sectionKey) => {
    const normalizedSectionKey = sectionKey === 'text' ? 'original' : sectionKey === 'video' ? 'lecture' : sectionKey;
    const lectureIndex = Math.max(lectureItems.findIndex((item) => item.id === activeLectureId), 0);

    setContentPreview({
      sectionKey: normalizedSectionKey,
      videoIndex: normalizedSectionKey === 'lecture' ? lectureIndex : 0,
    });
    setView('content-preview');
  };

  const openSubmitReviewPage = () => {
    setSelectedRootDataType('');
    setView('submit-review');
  };

  const buildReviewPayload = (rootDataType) => {
    const submittedLectures = lectureItems
      .filter((item) => item.isSaved && isLectureItemComplete(item))
      .map((item, index) => ({
        id: item.id,
        sortOrder: index + 1,
        title: item.title.trim(),
        html: item.html,
        plainText: getPlainText(item.html),
        videos: item.videos.map(serializeVideoAsset),
      }));

    return {
      rootDataType,
      reviewStatus: 'pending',
      submittedAt: new Date().toISOString(),
      mindmap: {
        title: tabTitles.mindmap.trim(),
        ...mindmapData,
        steps: [...mindmapData.steps],
        videos: mindmapVideos.map(serializeVideoAsset),
      },
      original: {
        title: tabTitles.text.trim(),
        html: originContent.html,
        plainText: getPlainText(originContent.html),
        videos: originContent.videos.map(serializeVideoAsset),
      },
      lectures: submittedLectures,
    };
  };

  const submitRootDataForReview = async (payload) => {
    const endpoint = window.__ROOT_DATA_REVIEW_ENDPOINT__ || REVIEW_SUBMIT_ENDPOINT;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json().catch(() => ({}));
      return {
        mocked: false,
        ...result,
      };
    } catch (error) {
      console.warn('[RootDataPage] review submit fallback', error);
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      return {
        mocked: true,
        reviewStatus: 'pending',
      };
    }
  };

  const handleSubmit = () => {
    openSubmitReviewPage();
  };

  const handleConfirmSubmitReview = async () => {
    if (!selectedRootDataType) {
      showToast('请选择根数据类型');
      return;
    }

    const payload = buildReviewPayload(selectedRootDataType);
    setIsSubmittingReview(true);

    try {
      await submitRootDataForReview(payload);
      showToast('已提交审核，等待审核');
      window.setTimeout(() => {
        navigate('/');
      }, 700);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleMindmapComplete = () => {
    const hasTitle = tabTitles.mindmap.trim() !== '';
    const hasAnyField =
      mindmapFields.some((value) => value.trim() !== '') ||
      mindmapData.steps.some((step) => step.trim() !== '');

    if (!hasTitle && !hasAnyField) {
      showToast('请先填写脑图标题或内容');
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
    openContentPreview('text');
  };

  const handleLectureSaveDraft = () => {
    const hasTitle = activeLectureItem.title.trim() !== '';
    const hasContent = getPlainText(activeLectureItem.html) !== '';
    const hasVideo = activeLectureItem.videos.length > 0;

    console.info('[RootDataPage] handleLectureSaveDraft', {
      activeLectureId: activeLectureItem.id,
      lectureCount: lectureItems.length,
      hasTitle,
      hasContent,
      hasVideo,
    });

    if (!hasTitle && !hasContent && !hasVideo) {
      showToast('请先填写讲解标题或内容');
      return;
    }

    updateLectureItem(activeLectureItem.id, (item) => ({
      ...item,
      isSaved: true,
    }));
    showToast('讲解草稿已保存');
    openContentPreview('video');
  };

  const showSharedDraftButton = activeTab === 'mindmap' || activeTab === 'text' || activeTab === 'video';
  const handleSharedDraftSave = activeTab === 'mindmap'
    ? handleMindmapComplete
    : activeTab === 'text'
      ? handleOriginSaveDraft
      : handleLectureSaveDraft;
  const activeRichTextEditorType = activeTab === 'video' ? 'lecture' : 'origin';
  const showRichTextKeyboardToolbar =
    ((activeTab === 'text' && isOriginEditorFocused) ||
      (activeTab === 'video' && isLectureEditorFocused)) &&
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

  const saveEditorSelection = (editorType = 'origin') => {
    const editorElement = getEditorRefByType(editorType);
    const selection = window.getSelection();

    if (!editorElement || !selection || selection.rangeCount === 0) {
      savedEditorSelectionRef.current = null;
      return;
    }

    const range = selection.getRangeAt(0);

    if (!editorElement.contains(range.commonAncestorContainer)) {
      savedEditorSelectionRef.current = null;
      return;
    }

    savedEditorSelectionRef.current = range.cloneRange();
  };

  const restoreEditorSelection = (editorType = 'origin') => {
    const editorElement = getEditorRefByType(editorType);
    const savedRange = savedEditorSelectionRef.current;
    const selection = window.getSelection();

    if (!editorElement || !selection) {
      return false;
    }

    editorElement.focus();

    if (!savedRange) {
      return false;
    }

    try {
      selection.removeAllRanges();
      selection.addRange(savedRange);
      return true;
    } catch (error) {
      return false;
    }
  };

  const execCommand = (command, value = null, editorType = 'origin') => {
    getEditorRefByType(editorType)?.focus();
    document.execCommand(command, false, value);
    updateHtmlContent(editorType);
  };

  const insertImageHtml = (imageUrl, editorType = 'origin') => {
    const imgHtml = `<img src="${imageUrl}" style="max-width:100%; border-radius:8px; margin: 8px 0; display:block;" />`;

    restoreEditorSelection(editorType);
    document.execCommand('insertHTML', false, imgHtml);
    updateHtmlContent(editorType);
  };

  const openImagePicker = (editorType = 'origin') => {
    saveEditorSelection(editorType);
    pendingImageEditorTypeRef.current = editorType;

    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = '';
      imageFileInputRef.current.click();
    }
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0];
    const editorType = pendingImageEditorTypeRef.current || 'origin';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        insertImageHtml(reader.result, editorType);
      } else {
        showToast('图片插入失败，请重试');
      }

      pendingImageEditorTypeRef.current = 'origin';
      savedEditorSelectionRef.current = null;
      event.target.value = '';
    };

    reader.onerror = () => {
      showToast('图片读取失败，请重试');
      pendingImageEditorTypeRef.current = 'origin';
      savedEditorSelectionRef.current = null;
      event.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  const updateHtmlContent = (editorType = 'origin') => {
    const editorElement = getEditorRefByType(editorType);

    if (editorElement) {
      const content = editorElement.innerHTML;

      if (editorType === 'origin') {
        setOriginContent((prev) => ({ ...prev, html: content }));
        return;
      }

      updateLectureItem(activeLectureItem.id, (item) => ({
        ...item,
        html: content,
      }));
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
      typeof target === 'string'
        ? target === 'mindmap'
          ? { type: 'mindmap' }
          : target === 'origin'
            ? { type: 'origin' }
            : { type: 'lecture', lectureId: activeLectureItem.id }
        : target,
      nextVideo
    );
  };

  const handleBackHome = () => {
    navigate('/');
  };

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
        <div className="text-[17px] font-bold text-[#111827]">
          {isVideoEditModeRef.current ? '视频编辑' : '设置标签'}
        </div>
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

              {/* 更换视频：仅编辑模式显示 */}
              {isVideoEditModeRef.current && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleReplaceVideoClick(); }}
                  className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-sm active:bg-black/60"
                >
                  <RefreshCw size={11} strokeWidth={2.3} />
                  更换视频
                </button>
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
    const createTabs = [
      { id: 'mindmap', label: '脑图', icon: <Share2 size={18} /> },
      { id: 'text', label: '原文', icon: <FileText size={18} /> },
      { id: 'video', label: '讲解', icon: <Video size={18} /> },
    ];

    return (
    <div className="flex flex-col h-full bg-white relative floating-create-container">
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
          <span className="font-medium text-[17px]">创作</span>
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
              <TitleTextarea
                placeholder="请输入脑图标题"
                value={tabTitles.mindmap}
                onChange={(value) => updateTabTitle('mindmap', value)}
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
              onEdit={(video) => openVideoEditor({ type: 'mindmap' }, video)}
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
          <ContentTabPanel
            beforeEditor={(
              <div>
                <TitleTextarea
                  placeholder="请输入原文标题"
                  value={tabTitles.text}
                  onChange={(value) => updateTabTitle('text', value)}
                />
              </div>
            )}
            editorRef={originEditorRef}
            html={originContent.html}
            onInput={() => updateHtmlContent('origin')}
            placeholder="请输入原文内容..."
            wrapperClassName="min-h-[400px] rounded-[22px] bg-white"
            contentClassName="flex-1 overflow-y-auto px-4 pb-24 text-left text-[15px] leading-8 text-[#374151] outline-none no-scrollbar"
            placeholderClassName="left-1 right-4 top-1 w-auto text-left text-sm text-gray-300"
            editorStyle={{ minHeight: '300px', textAlign: 'left' }}
            afterEditor={originContent.videos.length > 0 ? (
              <AttachedVideoSection
                items={originContent.videos}
                maxCount={1}
                onAdd={() => openVideoPicker({ type: 'origin' })}
                onEdit={(video) => openVideoEditor({ type: 'origin' }, video)}
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
            ) : null}
          />
        )}

        {activeTab === 'video' && (
          <ContentTabPanel
            editorKey={activeLectureItem.id}
            beforeEditor={(
              <div>
                <TitleTextarea
                  placeholder="请输入讲解标题"
                  value={activeLectureItem.title}
                  onChange={(value) => updateTabTitle('video', value)}
                />
              </div>
            )}
            editorRef={lectureEditorRef}
            html={activeLectureItem.html}
            onInput={() => updateHtmlContent('lecture')}
            placeholder="请输入讲解内容..."
            wrapperClassName="min-h-[400px] rounded-[22px] bg-white"
            contentClassName="flex-1 overflow-y-auto px-4 pb-24 text-left text-[15px] leading-8 text-[#374151] outline-none no-scrollbar"
            placeholderClassName="left-1 right-4 top-1 w-auto text-left text-sm text-gray-300"
            editorStyle={{ minHeight: '300px', textAlign: 'left' }}
            afterEditor={activeLectureItem.videos.length > 0 ? (
              <AttachedVideoSection
                items={activeLectureItem.videos}
                maxCount={1}
                onAdd={() => openVideoPicker({ type: 'lecture', lectureId: activeLectureItem.id })}
                onEdit={(video) => openVideoEditor({ type: 'lecture', lectureId: activeLectureItem.id }, video)}
                onRemove={(id) =>
                  updateLectureItem(activeLectureItem.id, (item) => ({
                    ...item,
                    videos: item.videos.filter((video) => {
                      if (video.id === id) {
                        disposeVideoAsset(video);
                        return false;
                      }

                      return true;
                    }),
                  }))
                }
              />
            ) : null}
          />
        )}
      </div>

      {showRichTextKeyboardToolbar && (
        <div
          className="pointer-events-none fixed inset-x-0 z-30"
          style={originKeyboardToolbarStyle}
        >
          <div className="pointer-events-auto flex h-12 w-full items-center gap-1 border-t border-[#D1D5DB] bg-white px-3">
            <button
              type="button"
              onMouseDown={keepEditorSelection}
              onClick={() => execCommand('bold', null, activeRichTextEditorType)}
              className="flex h-9 min-w-9 items-center justify-center rounded-[12px] text-[#2B2F36] active:bg-[#F5F6F8]"
              aria-label="加粗"
            >
              <Bold size={18} strokeWidth={2.4} />
            </button>
            <button
              type="button"
              onMouseDown={keepEditorSelection}
              onClick={() => execCommand('underline', null, activeRichTextEditorType)}
              className="flex h-9 min-w-9 items-center justify-center rounded-[12px] text-[#2B2F36] active:bg-[#F5F6F8]"
              aria-label="下划线"
            >
              <Underline size={18} strokeWidth={2.2} />
            </button>
            <div className="mx-1 h-5 w-px bg-[#E5E7EB]" />
            <button
              type="button"
              onMouseDown={keepEditorSelection}
              onClick={() => openImagePicker(activeRichTextEditorType)}
              className="flex h-9 min-w-9 items-center justify-center rounded-[12px] text-[#2B2F36] active:bg-[#F5F6F8]"
              aria-label="插图"
            >
              <ImageIcon size={18} strokeWidth={2.2} />
            </button>
            <div className="mx-1 h-5 w-px bg-[#E5E7EB]" />
            <button
              type="button"
              onMouseDown={keepEditorSelection}
              onClick={() => openVideoPicker(
                activeRichTextEditorType === 'lecture'
                  ? { type: 'lecture', lectureId: activeLectureItem.id }
                  : { type: activeRichTextEditorType }
              )}
              className="flex h-9 min-w-9 items-center justify-center rounded-[12px] text-[#2B2F36] active:bg-[#F5F6F8]"
              aria-label="添加视频"
            >
              <Video size={18} strokeWidth={2.1} />
            </button>
          </div>
        </div>
      )}

      {!showRichTextKeyboardToolbar && (
        <div
          className="pointer-events-none absolute inset-x-4 z-20"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 36px)' }}
        >
          <div className="pointer-events-auto flex gap-3">
            {createTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const showLectureDropdown = tab.id === 'video' && savedLectureCount >= 1;
              const handleCreateTabClick = () => {
                if (tab.id === 'video' && isActive && showLectureDropdown) {
                  openLectureSheet();
                  return;
                }

                handleTabClick(tab.id);
              };

              return (
                <div
                  key={tab.id}
                  className="relative flex min-w-0 flex-1"
                >
                  <button
                    type="button"
                    onClick={handleCreateTabClick}
                    className={`flex h-[40px] w-full min-w-0 items-center justify-center gap-1.5 rounded-[12px] border px-3 transition-all active:scale-[0.98] ${
                      showLectureDropdown ? 'pr-8' : ''
                    } ${
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
                  {showLectureDropdown ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openLectureSheet();
                      }}
                      className={`absolute inset-y-0 right-0 flex w-8 items-center justify-center rounded-r-[12px] ${
                        isActive ? 'text-white/92' : 'text-[#6B7280]'
                      }`}
                      aria-label="选择讲解"
                    >
                      <ChevronDown size={14} strokeWidth={2.4} />
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        aria-hidden={!isLectureSheetOpen}
        className={`overlay-mask ${isLectureSheetOpen ? 'active' : ''}`}
        onClick={() => setIsLectureSheetOpen(false)}
        type="button"
      />

      <BottomSheet
        open={isLectureSheetOpen}
        title={`讲解列表 (${lectureItems.length})`}
        onClose={() => setIsLectureSheetOpen(false)}
      >
        <div className="episode-list">
          {lectureItems.map((item, index) => (
            <button
              className={`video-choice root-lecture-choice ${item.id === activeLectureItem.id ? 'active' : ''}`}
              key={item.id}
              onClick={() => selectLectureItem(item.id)}
              type="button"
            >
              <span className="video-choice-index">{index + 1}</span>
              <span className="video-choice-title">{getLectureSheetTitle(item, index)}</span>
              {/* <span className="video-choice-duration">{item.isSaved ? '已保存' : '未保存'}</span> */}
            </button>
          ))}
        </div>
        <div className="px-4 pb-4 pt-1">
          <button
            type="button"
            onClick={addLectureItem}
            className="flex h-[40px] w-full items-center justify-center gap-1.5 rounded-[12px] border border-[#C8161D] bg-[#C8161D] px-3 text-white transition-all active:scale-[0.98]"
          >
            <Plus size={16} strokeWidth={2.8} />
            <span className="text-[13px] font-bold">增加讲解</span>
          </button>
        </div>
      </BottomSheet>

      {activeTab === 'mindmap' && (
        <button
          ref={floatingCreateBtnRef}
          type="button"
          className="content-preview-floating-edit"
          aria-label="创作"
          style={{
            left: `${floatingCreateBtnPos.x}px`,
            top: `${floatingCreateBtnPos.y}px`,
          }}
          onPointerDown={(event) => {
            const buttonRect = floatingCreateBtnRef.current?.getBoundingClientRect();
            if (!buttonRect) return;
            floatingCreateDragRef.current.isDragging = true;
            floatingCreateDragRef.current.pointerOffsetX = event.clientX - buttonRect.left;
            floatingCreateDragRef.current.pointerOffsetY = event.clientY - buttonRect.top;
            floatingCreateDragRef.current.startX = event.clientX;
            floatingCreateDragRef.current.startY = event.clientY;
            floatingCreateDragRef.current.suppressClick = false;
          }}
          onClick={(event) => {
            if (floatingCreateDragRef.current.suppressClick) {
              event.preventDefault();
              floatingCreateDragRef.current.suppressClick = false;
              return;
            }
            navigate('/root-data-draft', { state: { mode: 'view', content: DRAFT_CONTENT_500 } });
          }}
        >
          <FilePen size={18} strokeWidth={2.4} />
          <span>草案</span>
        </button>
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
        .root-lecture-choice.active {
          border-color: rgba(200, 22, 29, 0.55);
          background: #FCEAEC;
          color: ${THEME_COLOR};
        }
        .root-lecture-choice {
          align-items: start;
        }
        .root-lecture-choice .video-choice-title {
          overflow: visible;
          text-overflow: initial;
          white-space: normal;
          word-break: break-all;
          line-height: 1.5;
        }
        .root-lecture-choice.active .video-choice-index {
          background: rgba(200, 22, 29, 0.12);
          color: ${THEME_COLOR};
        }
      `}</style>
    </div>
    );
  };

  const handleSaveMindmapTemplate = async (index) => {
    const selectedStyle = okStyles[index];
    const endpoint = '/api/root-data/mindmap-template';

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateIndex: index, templateName: selectedStyle?.name }),
      });
    } catch (error) {
      console.warn('[RootDataPage] mindmap template save fallback', error);
    }

    showToast('模板保存成功');
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
        onSaveTemplate={handleSaveMindmapTemplate}
      />
    );
  };

  const renderContentPreviewPage = () => {
    if (!contentPreview) {
      return null;
    }

    const fakeLecturePreviewData = buildFakeLecturePreviewData(lectureItems.length);
    const previewSection = contentPreview.sectionKey === 'original'
      ? {
          title: '原文预览',
          content: FAKE_ORIGINAL_PREVIEW_HTML,
          videos: [],
        }
      : {
          title: '讲解预览',
          content: fakeLecturePreviewData.map((item) => item.content),
          videos: fakeLecturePreviewData.map((item) => item.video),
        };

    return (
      <ContentPreviewPage
        onClose={() => {
          setContentPreview(null);
          setView('create');
        }}
        section={previewSection}
        sectionKey={contentPreview.sectionKey}
        videoIndex={contentPreview.videoIndex}
        showEpisodePicker={false}
      />
    );
  };

  const renderSubmitReviewPage = () => (
    <div className="flex h-full flex-col bg-white">
      <div className="relative flex h-[58px] shrink-0 items-center border-b border-[#EEF0F4] bg-white px-4">
        <button
          type="button"
          onClick={() => setView('create')}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#374151] active:bg-gray-100"
          aria-label="返回创建页"
        >
          <ChevronLeft size={24} strokeWidth={2.3} />
        </button>
        <div className="pointer-events-none absolute inset-x-0 text-center text-[17px] font-bold text-[#111827]">提交审核</div>
      </div>

      <div className="flex-1 px-4 pt-3 pb-4">
        <div className="text-[15px] font-medium leading-6 ">请选择根数据类型：</div>
        <div className="mt-3 space-y-3">
            {ROOT_DATA_TYPE_OPTIONS.map((option) => {
              const isSelected = selectedRootDataType === option;
              return (
                <div
                  key={option}
                  onClick={() => setSelectedRootDataType(option)}
                  className={`flex w-full items-center justify-between rounded-[12px] border px-4 py-4 text-left transition-all ${
                    isSelected
                      ? 'border-[#C8161D] bg-[#FFF0F1]'
                      : 'border-[#EFE3E4] bg-white'
                  }`}
                >
                  <span className={`text-[16px] font-semibold ${isSelected ? 'text-[#C8161D]' : 'text-[#1F2329]'}`}>
                    {option}
                  </span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      isSelected ? 'border-[#C8161D]' : 'border-[#D0D5DD]'
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isSelected ? 'bg-[#C8161D]' : 'bg-transparent'
                      }`}
                    />
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      <div className="shrink-0 px-5 pb-6 pt-3">
        <div
          onClick={handleConfirmSubmitReview}
          disabled={!selectedRootDataType || isSubmittingReview}
          className={`flex h-[52px] w-full items-center justify-center rounded-[12px] text-[16px] font-bold text-white transition-all ${
            !selectedRootDataType || isSubmittingReview
              ? 'cursor-not-allowed bg-[#E6AEB1]'
              : 'bg-[#C8161D] active:scale-[0.99]'
          }`}
        >
          {isSubmittingReview ? '提交中...' : '确认提交'}
        </div>
      </div>
    </div>
  );

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
          <div key={video.id} className="flex items-center p-3 border border-gray-100 rounded-xl hover:bg-[#FDEBEC] cursor-pointer" onClick={() => { addVideoToTarget(activeTab === 'mindmap' ? 'mindmap' : activeTab === 'text' ? 'origin' : { type: 'lecture', lectureId: activeLectureItem.id }, { title: video.title, source: 'library', duration: video.duration, size: video.size, cover: video.cover }); setView('create'); }}>
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
          ref={imageFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFileChange}
        />
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
              : view === 'content-preview'
                ? renderContentPreviewPage()
                : view === 'submit-review'
                  ? renderSubmitReviewPage()
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
