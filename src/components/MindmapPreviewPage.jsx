import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, Pencil } from 'lucide-react';

const relationCanvas = {
  width: 554,
  height: 520,
  centerX: 277,
  centerY: 256,
};

const contentRingLayout = {
  centerX: relationCanvas.centerX,
  centerY: relationCanvas.centerY,
  radiusX: 208,
  radiusY: 186,
};

const stepCircleLayout = {
  centerX: relationCanvas.centerX,
  centerY: relationCanvas.centerY,
  radiusX: 126,
  radiusY: 110,
  minSlots: 9,
};

const toRelationPosition = ({ x, y, width }) => ({
  top: (y / relationCanvas.height) * 100,
  left: (x / relationCanvas.width) * 100,
  width: (width / relationCanvas.width) * 100,
});

const getSlotWidthForAngle = (angle, widths) => {
  const radians = (angle * Math.PI) / 180;
  const verticalFactor = Math.abs(Math.sin(radians));
  const horizontalFactor = Math.abs(Math.cos(radians));

  if (verticalFactor > 0.9) {
    return widths.wide;
  }

  if (horizontalFactor > 0.9) {
    return widths.medium;
  }

  return widths.narrow;
};

const getEllipseSlotPosition = (layout, angle, width, offset = {}) => {
  const radians = (angle * Math.PI) / 180;
  const { xOffset = 0, yOffset = 0 } = offset;
  const x = layout.centerX + layout.radiusX * Math.cos(radians) + xOffset;
  const y = layout.centerY + layout.radiusY * Math.sin(radians) + yOffset;

  return toRelationPosition({ x, y, width });
};

const contentSlotConfigs = [
  { key: 'c0', field: 'action', angle: -90, width: 188, yOffset: -12 },
  { key: 'c1', field: 'keyPoint', angle: -50, width: 156, xOffset: 12, yOffset: -10 },
  { key: 'c2', field: 'target', angle: -10, width: 148, xOffset: 14, yOffset: -4 },
  { key: 'c3', field: 'situation', angle: 30, width: 156, xOffset: 18, yOffset: 8 },
  { key: 'c4', field: 'advantage', angle: 70, width: 152, xOffset: 32, yOffset: 24 },
  { key: 'c5', field: 'principle', angle: 110, width: 152, xOffset: -32, yOffset: 24 },
  { key: 'c6', field: 'method', angle: 150, width: 156, xOffset: -18, yOffset: 8 },
  { key: 'c7', field: 'time', angle: 190, width: 164, xOffset: -10 },
  { key: 'c8', field: 'goal', angle: 230, width: 156, xOffset: -12, yOffset: -10 },
];

const createRelationPreviewSlots = (mindmapData) => {
  const contentSlots = contentSlotConfigs.map((config) => ({
    key: config.key,
    value: mindmapData[config.field],
    position: getEllipseSlotPosition(contentRingLayout, config.angle, config.width, {
      xOffset: config.xOffset,
      yOffset: config.yOffset,
    }),
  }));

  const stepSlotCount = Math.max(stepCircleLayout.minSlots, mindmapData.steps.length);
  const stepSlots = Array.from({ length: stepSlotCount }, (_, index) => {
    const angle = -70 + index * (360 / stepSlotCount);

    return {
      key: `s${index}`,
      value: mindmapData.steps[index] ?? '',
      position: getEllipseSlotPosition(
        stepCircleLayout,
        angle,
        getSlotWidthForAngle(angle, {
          wide: 152,
          medium: 126,
          narrow: 112,
        })
      ),
    };
  });

  return { contentSlots, stepSlots };
};

export default function MindmapPreviewPage({
  title,
  mindmapData,
  okStyle,
  onBack,
  headerTitle = '',
  showTemplatePicker = false,
  templateOptions = [],
  selectedTemplateIndex = 0,
  onSelectTemplate,
  onSaveTemplate,
  showFloatingEdit = true,
}) {
  const { contentSlots, stepSlots } = createRelationPreviewSlots(mindmapData);

  const containerRef = useRef(null);
  const floatingButtonRef = useRef(null);
  const dragStateRef = useRef({
    isDragging: false,
    pointerOffsetX: 0,
    pointerOffsetY: 0,
    startX: 0,
    startY: 0,
    suppressClick: false,
  });
  const [floatingButtonPos, setFloatingButtonPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      const container = containerRef.current;
      const button = floatingButtonRef.current;
      if (!container || !button) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const buttonWidth = button.offsetWidth || 50;
      const buttonHeight = button.offsetHeight || 75;

      setFloatingButtonPos((current) => {
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

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!dragStateRef.current.isDragging) return;

      const container = containerRef.current;
      const button = floatingButtonRef.current;
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

  const handleTemplateSelect = (index) => {
    onSelectTemplate?.(index);
    onSaveTemplate?.(index);
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-white overflow-hidden relative">
      <div className="px-4 py-3 flex items-center border-b border-gray-100 shrink-0 bg-white z-20">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            aria-label="返回"
            onClick={onBack}
            className="flex items-center justify-center rounded-full text-gray-600"
          >
            <ChevronLeft size={22} />
          </button>
          {headerTitle ? <span className="font-bold text-lg">{headerTitle}</span> : null}
        </div>
      </div>

      <div className="root-preview-scroll flex-1 overflow-y-auto bg-white px-4 py-5">
        <div className="space-y-8">
          <section className="relative overflow-hidden bg-white">
            <div className="relative z-10">
              <div className="relative aspect-[554/520] w-full overflow-hidden rounded-xl bg-[radial-gradient(circle_at_center,#ffffff_0%,#ffffff_62%,#f8fafc_100%)]">
                <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
                  <span
                    className={`select-none text-[180px] leading-none transition-all duration-500 ${okStyle.className}`}
                    style={okStyle.extra || {}}
                  >
                    OK
                  </span>
                </div>
                {contentSlots.map((slot) => (
                  <div
                    key={slot.key}
                    className="absolute z-10 min-w-0 -translate-x-1/2 -translate-y-1/2 text-center"
                    style={{
                      top: `${slot.position.top}%`,
                      left: `${slot.position.left}%`,
                      width: `${slot.position.width}%`,
                    }}
                  >
                    <span className="block min-h-[18px] truncate px-1 text-center text-[13px] font-bold leading-tight text-[#242932]">
                      {slot.value}
                    </span>
                    <span className="mt-1 block h-px w-full bg-[#B8BCC5]" />
                  </div>
                ))}
                {stepSlots.map((slot) => (
                  <div
                    key={slot.key}
                    className="absolute z-10 min-w-0 -translate-x-1/2 -translate-y-1/2 text-center"
                    style={{
                      top: `${slot.position.top}%`,
                      left: `${slot.position.left}%`,
                      width: `${slot.position.width}%`,
                    }}
                  >
                    <span className="block min-h-[18px] truncate px-1 text-center text-[13px] font-semibold leading-tight text-[#4B5563]">
                      {slot.value}
                    </span>
                    <span className="mt-1 block h-px w-full bg-[#C8CFD9]" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="root-mindmap-complete bg-white">
            <article className="mindmap-preview mindmap-preview-template">
              <div className="mindmap-preview-content">
                <h1 className="mindmap-preview-title">{title}</h1>
                <p>
                  做 <span className="preview-mark">{mindmapData.action}</span> 事，关键在于{' '}
                  <span className="preview-mark">{mindmapData.keyPoint}</span>。
                  要针对 <span className="preview-mark">{mindmapData.target}</span>，鉴于{' '}
                  <span className="preview-mark">{mindmapData.situation}</span> 的形势，发挥{' '}
                  <span className="preview-mark">{mindmapData.advantage}</span> 的优势。
                  本着 <span className="preview-mark">{mindmapData.principle}</span> 的原则，运用{' '}
                  <span className="preview-mark">{mindmapData.method}</span> 的方法，通过如下步骤实施：
                </p>
                <ol className="mindmap-steps">
                  {mindmapData.steps.map((step, index) => (
                    <li key={`${step}-${index}`}>
                      <span>{index + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
                <p>
                  预计经过 <span className="preview-mark">{mindmapData.time}</span> 机遇期，最终实现{' '}
                  <span className="preview-mark">{mindmapData.goal}</span> 的目标。
                </p>
              </div>
            </article>
          </section>

          {showTemplatePicker && templateOptions.length > 0 ? (
            <section className="bg-white pb-24">
              <div className="mb-3 text-[12px] font-bold text-[#8F959E]">脑图模版</div>
              <div className="grid grid-cols-5 gap-1.5">
                {templateOptions.map((style, index) => (
                  <button
                    key={style.name}
                    type="button"
                    onClick={() => handleTemplateSelect(index)}
                    className={`min-w-0 rounded-[10px] border p-1 text-center transition-all ${
                      selectedTemplateIndex === index
                        ? 'bg-[#FDEBEC] border-[#C8161D] shadow-[0_6px_16px_rgba(200,22,29,0.15)]'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex h-11 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50">
                      <span
                        className={`text-sm leading-none select-none ${style.previewClassName}`}
                        style={style.previewExtra || {}}
                      >
                        OK
                      </span>
                    </div>
                    <div className={`mt-1.5 truncate text-[10px] font-bold leading-tight ${selectedTemplateIndex === index ? 'text-[#C8161D]' : 'text-gray-500'}`}>
                      {style.name}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      {showFloatingEdit ? <button
        ref={floatingButtonRef}
        type="button"
        onClick={(event) => {
          if (dragStateRef.current.suppressClick) {
            event.preventDefault();
            dragStateRef.current.suppressClick = false;
            return;
          }

          onBack?.();
        }}
        onPointerDown={(event) => {
          const buttonRect = floatingButtonRef.current?.getBoundingClientRect();
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
          left: `${floatingButtonPos.x}px`,
          top: `${floatingButtonPos.y}px`,
        }}
      >
        <Pencil size={18} strokeWidth={2.4} />
        <span>编辑</span>
      </button> : null}

      <style>{`
        .root-preview-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
        .root-preview-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .root-mindmap-complete .preview-mark {
          border-bottom: 0 !important;
          background-image: none !important;
          text-decoration: none !important;
          text-decoration-line: none !important;
        }
      `}</style>
    </div>
  );
}
