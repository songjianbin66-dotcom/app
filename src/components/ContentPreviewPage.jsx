import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Pencil } from 'lucide-react';
import MindmapPreviewPage from './MindmapPreviewPage.jsx';

const okStampStyle = {
  className: 'ok-stamp',
  extra: {},
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function normalizeSectionKey(sectionKey) {
  if (sectionKey === 'text') {
    return 'original';
  }

  if (sectionKey === 'video') {
    return 'lecture';
  }

  return sectionKey;
}

function OriginalPreview({ content }) {
  if (!content) {
    return <article className="original-preview text-[#9CA3AF]">暂无原文内容</article>;
  }

  return (
    <article
      className="original-preview"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

function normalizeLectureItems(content) {
  if (Array.isArray(content)) {
    return content.map((item, index) => ({
      id: item?.id ?? `lecture-note-${index + 1}`,
      title: item?.title ?? '',
      content: item?.content ?? '',
      html: item?.html ?? '',
    }));
  }

  if (typeof content === 'string' && content.trim() !== '') {
    return [
      {
        id: 'lecture-note-1',
        content: '',
        html: content,
      },
    ];
  }

  return [];
}

function LecturePreview({
  content,
  title,
  videos = [],
  videoIndex = 0,
  showEpisodePicker = true,
}) {
  const items = normalizeLectureItems(content);
  const totalEpisodes = Math.max(items.length, videos.length, 1);
  const [selectedIndex, setSelectedIndex] = useState(
    clamp(videoIndex ?? 0, 0, Math.max(totalEpisodes - 1, 0))
  );

  useEffect(() => {
    setSelectedIndex(clamp(videoIndex ?? 0, 0, Math.max(totalEpisodes - 1, 0)));
  }, [totalEpisodes, videoIndex]);

  const selectedVideo = videos[selectedIndex] ?? null;
  const item = items[selectedIndex] ?? items[items.length - 1] ?? null;
  const paragraphs = item?.content
    ?.split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean) ?? [];
  const headline = selectedVideo?.title || item?.title || title || `讲解第 ${selectedIndex + 1} 集`;

  return (
    <div className="lecture-preview">
      <article className="lecture-card" key={selectedVideo?.id ?? item?.id ?? headline}>
        <h3>{headline}</h3>
        {item?.html ? (
          <div
            className="lecture-copy"
            dangerouslySetInnerHTML={{ __html: item.html }}
          />
        ) : null}
        {!item?.html ? (
          <div className="lecture-copy">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => (
                <p key={`${headline}-paragraph-${index + 1}`}>{paragraph}</p>
              ))
            ) : (
              <p>暂无讲解内容</p>
            )}
          </div>
        ) : null}
      </article>

      {showEpisodePicker && totalEpisodes > 1 ? (
        <section className="lecture-episode-picker" aria-label={`讲解全 ${totalEpisodes} 集`}>
          <div className="lecture-episode-picker-title">讲解全 {totalEpisodes} 集</div>
          <div className="lecture-episode-scroller">
            {Array.from({ length: totalEpisodes }, (_, index) => (
              <button
                className={`lecture-episode-chip ${index === selectedIndex ? 'active' : ''}`}
                key={`lecture-episode-${index + 1}`}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                第{index + 1}集
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default function ContentPreviewPage({
  onClose,
  section,
  sectionKey,
  videoIndex = 0,
  showEpisodePicker = true,
}) {
  const normalizedSectionKey = normalizeSectionKey(sectionKey);
  const previewPageRef = useRef(null);
  const floatingEditButtonRef = useRef(null);
  const dragStateRef = useRef({
    isDragging: false,
    pointerOffsetX: 0,
    pointerOffsetY: 0,
    startX: 0,
    startY: 0,
    suppressClick: false,
  });
  const [floatingEditButtonPos, setFloatingEditButtonPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (normalizedSectionKey === 'mindmap') {
      return undefined;
    }

    const updateFloatingButtonPosition = () => {
      const container = previewPageRef.current;
      const button = floatingEditButtonRef.current;
      if (!container || !button) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const buttonWidth = button.offsetWidth || 50;
      const buttonHeight = button.offsetHeight || 75;

      setFloatingEditButtonPos((current) => {
        const hasInitialPosition = current.x !== 0 || current.y !== 0;
        const defaultX = containerWidth - buttonWidth - 14;
        const defaultY = containerHeight - buttonHeight - 18;

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
  }, [normalizedSectionKey]);

  useEffect(() => {
    if (normalizedSectionKey === 'mindmap') {
      return undefined;
    }

    const handlePointerMove = (event) => {
      if (!dragStateRef.current.isDragging) return;

      const container = previewPageRef.current;
      const button = floatingEditButtonRef.current;
      if (!container || !button) return;

      const containerRect = container.getBoundingClientRect();
      const buttonWidth = button.offsetWidth;
      const buttonHeight = button.offsetHeight;
      const nextX = event.clientX - containerRect.left - dragStateRef.current.pointerOffsetX;
      const nextY = event.clientY - containerRect.top - dragStateRef.current.pointerOffsetY;
      const movedDistance = Math.hypot(
        event.clientX - dragStateRef.current.startX,
        event.clientY - dragStateRef.current.startY
      );

      if (movedDistance > 4) {
        dragStateRef.current.suppressClick = true;
      }

      setFloatingEditButtonPos({
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
  }, [normalizedSectionKey]);

  return (
    <section className="content-preview-page" ref={previewPageRef}>
      {normalizedSectionKey === 'mindmap' ? (
        <MindmapPreviewPage
          title={section.title}
          mindmapData={section.content}
          okStyle={okStampStyle}
          onBack={onClose}
        />
      ) : null}
      {normalizedSectionKey !== 'mindmap' ? (
        <>
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
            <div />
          </header>

          <div className="content-preview-body">
            {normalizedSectionKey === 'original' ? (
              <OriginalPreview content={section.content} />
            ) : null}
            {normalizedSectionKey === 'lecture' ? (
              <LecturePreview
                content={section.content}
                title={section.title}
                videos={section.videos}
                videoIndex={videoIndex}
                showEpisodePicker={showEpisodePicker}
              />
            ) : null}
          </div>

          <button
            ref={floatingEditButtonRef}
            type="button"
            onClick={(event) => {
              if (dragStateRef.current.suppressClick) {
                event.preventDefault();
                dragStateRef.current.suppressClick = false;
                return;
              }

              onClose();
            }}
            onPointerDown={(event) => {
              const buttonRect = floatingEditButtonRef.current?.getBoundingClientRect();
              if (!buttonRect) return;

              dragStateRef.current.isDragging = true;
              dragStateRef.current.pointerOffsetX = event.clientX - buttonRect.left;
              dragStateRef.current.pointerOffsetY = event.clientY - buttonRect.top;
              dragStateRef.current.startX = event.clientX;
              dragStateRef.current.startY = event.clientY;
              dragStateRef.current.suppressClick = false;
            }}
            className="content-preview-floating-edit"
            aria-label="编辑"
            style={{
              left: `${floatingEditButtonPos.x}px`,
              top: `${floatingEditButtonPos.y}px`,
            }}
          >
            <Pencil size={18} strokeWidth={2.4} />
            <span>编辑</span>
          </button>
        </>
      ) : null}
    </section>
  );
}
