import React from 'react';
import { PlayCircle, Plus, Trash2 } from 'lucide-react';

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

function AttachedVideoSection({ items, onAdd, onRemove, maxCount = Infinity }) {
  return (
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
            onClick={onAdd}
            className="flex min-h-[150px] w-full flex-col items-center justify-center rounded-[24px] px-3 py-6 text-center"
          >
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#C8161D] text-white">
              <Plus size={20} strokeWidth={2.8} />
            </div>
            <div className="text-[14px] text-[#B11319]">上传视频</div>
            <div className="mt-2 text-[12px] font-medium text-[#A1A1AA]">
              支持 MP4 / MOV / AVI 等格式，单个视频不超过 200MB
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttachedVideoSection;
