import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RootDataDraftPage = () => {
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const [draftText, setDraftText] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const draftPlaceholder = `1. 这条根数据想解决什么问题
2. 核心观点是什么
3. 后续准备拆成哪些原文和讲解`;

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToastMessage(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleSave = () => {
    showToast('根数据草案已保存');
  };

  const handleEdit = () => {
    textareaRef.current?.focus();
    showToast('可以继续修改草案内容');
  };

  const handleContinueCreate = () => {
    navigate('/root-data');
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-100 font-sans">
      <div className="relative flex h-screen w-full max-w-[430px] flex-col overflow-hidden bg-white text-[#1F2329] shadow-2xl">
        <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#EEF0F4] bg-white px-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#374151] active:bg-gray-100"
            aria-label="返回首页"
          >
            <ChevronLeft size={24} strokeWidth={2.3} />
          </button>
          <div className="text-[17px] font-bold text-[#111827]">根数据草案</div>
          <div className="flex items-center gap-2">
            {/* <div
              onClick={handleSave}
              className="rounded-full bg-[#C8161D] px-4 py-1.5 text-[10px] font-medium text-white transition-all"
              role="button"
              tabIndex={0}
            >
              提交
            </div> */}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto  pb-40 ">
          <div className="rounded-[24px]  p-4">
    
            <textarea
              ref={textareaRef}
              value={draftText}
              onChange={(event) => setDraftText(event.target.value)}
              placeholder={draftPlaceholder}
              className="mt-4 h-[380px] w-full resize-none bg-white  text-[15px] leading-7 text-[#1F2329] outline-none placeholder:text-[#B6BAC3]"
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 shrink-0 bg-white px-4 pb-6 pt-3"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
        >
          <div className="flex gap-3">
            {/* <div
              type="button"
              onClick={handleEdit}
              className="flex h-[52px] flex-1 items-center justify-center rounded-[14px] bg-[#C8161D] text-[16px] font-bold text-white "
            >
              修改
            </div> */}
            <div
              type="button"
              onClick={handleContinueCreate}
              className="flex h-[52px] flex-1 items-center justify-center rounded-[14px] bg-[#C8161D] text-[16px] font-bold text-white "
            >
              提交
            </div>
          </div>
        </div>

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

export default RootDataDraftPage;
