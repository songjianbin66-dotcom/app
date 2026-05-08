import React from 'react';
import { ChevronLeft } from 'lucide-react';

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

const getEllipseSlotPosition = (layout, angle, width) => {
  const radians = (angle * Math.PI) / 180;
  const x = layout.centerX + layout.radiusX * Math.cos(radians);
  const y = layout.centerY + layout.radiusY * Math.sin(radians);

  return toRelationPosition({ x, y, width });
};

const contentSlotAngles = Array.from({ length: 9 }, (_, index) => -90 + index * 40);

const createRelationPreviewSlots = (mindmapData) => {
  const contentSlots = [
    { key: 'c0', value: mindmapData.action },
    { key: 'c1', value: mindmapData.keyPoint },
    { key: 'c2', value: mindmapData.target },
    { key: 'c3', value: mindmapData.situation },
    { key: 'c4', value: mindmapData.advantage },
    { key: 'c5', value: mindmapData.principle },
    { key: 'c6', value: mindmapData.method },
    { key: 'c7', value: mindmapData.time },
    { key: 'c8', value: mindmapData.goal },
  ].map((slot, index) => {
    const angle = contentSlotAngles[index];

    return {
      ...slot,
      position: getEllipseSlotPosition(
        contentRingLayout,
        angle,
        getSlotWidthForAngle(angle, {
          wide: 204,
          medium: 166,
          narrow: 138,
        })
      ),
    };
  });

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
  headerTitle = '脑图预览',
  showTemplatePicker = false,
  templateOptions = [],
  selectedTemplateIndex = 0,
  onSelectTemplate,
  showPrimaryAction = false,
  primaryActionLabel = '保存草稿',
}) {
  const { contentSlots, stepSlots } = createRelationPreviewSlots(mindmapData);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 shrink-0 bg-white z-20">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            aria-label="返回"
            onClick={onBack}
            className="flex items-center justify-center rounded-full text-gray-600"
          >
            <ChevronLeft size={22} />
          </button>
          <span className="font-bold text-lg">{headerTitle}</span>
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
                <h1 className="mb-3 text-[16px] font-bold leading-tight text-gray-900">{title}</h1>
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
            <section className="bg-white pb-2">
              <div className="mb-3 text-[12px] font-bold text-[#8F959E]">脑图模版</div>
              <div className="grid grid-cols-5 gap-1.5">
                {templateOptions.map((style, index) => (
                  <button
                    key={style.name}
                    type="button"
                    onClick={() => onSelectTemplate?.(index)}
                    className={`min-w-0 rounded-[10px] border p-1 text-center transition-all ${
                      selectedTemplateIndex === index
                        ? 'bg-[#F3F0FF] border-[#7265E3] shadow-[0_6px_16px_rgba(114,101,227,0.15)]'
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
                    <div className={`mt-1.5 truncate text-[10px] font-bold leading-tight ${selectedTemplateIndex === index ? 'text-[#7265E3]' : 'text-gray-500'}`}>
                      {style.name}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {showPrimaryAction ? (
            <div className="pb-4">
              <div className="w-full py-3 bg-[#7265E3] text-white rounded-xl font-bold flex items-center justify-center text-[13px]">
                <span>{primaryActionLabel}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

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
