import React from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RootDataSubmitSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-100 font-sans">
      <div className="relative flex h-screen w-full max-w-[430px] flex-col overflow-hidden bg-white shadow-2xl">
        {/* Title Bar */}
        <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#EEF0F4] bg-white px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#374151] active:bg-gray-100"
            aria-label="返回"
          >
            <ChevronLeft size={24} strokeWidth={2.3} />
          </button>
          {/* <div className="text-[17px] font-bold text-[#111827]">提交初审</div> */}
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-16">
          {/* Success Icon */}
          <div className="relative flex items-center justify-center">
            {/* <div className="absolute h-[108px] w-[108px] rounded-full bg-[#C8161D]/10" /> */}
            <div className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#C8161D] ">
              <Check size={26} strokeWidth={3} className="text-white" />
            </div>
          </div>

          {/* Text */}
          <p className="mt-8 text-center text-[20px] font-bold leading-8 text-[#111827]">
            提交成功
          </p>
          <p className="mt-2 text-center text-[14px] leading-6 text-[#6B7280]">
            根数据草案已提交初审，请您耐心等待
          </p>

          {/* Buttons */}
          <div className="mt-12 flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/my-root-data')}
              className="flex h-[52px] w-full items-center justify-center rounded-full bg-[#C8161D] text-[16px] font-bold text-white "
            >
              查看我的根数据
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex h-[52px] w-full items-center justify-center rounded-full border border-[#D1D5DB] bg-white text-[16px] font-bold text-[#374151] active:bg-gray-50"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootDataSubmitSuccessPage;
