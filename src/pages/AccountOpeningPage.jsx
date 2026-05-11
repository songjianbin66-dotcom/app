import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Check, Building2, User } from 'lucide-react';
import { SHARED_THEME_STYLES } from './HomePage.jsx';

/**
 * 开通收款账户（个人 / 企业），从数字链原型 AccountOpeningPage 迁移。
 */
const AccountOpeningPage = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [personalLongTerm, setPersonalLongTerm] = useState(false);
  const [enterpriseLongTerm, setEnterpriseLongTerm] = useState(false);
  const [legalPersonLongTerm, setLegalPersonLongTerm] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
  };

  const shellClass =
    'w-full max-w-[430px] h-screen flex flex-col shadow-2xl relative overflow-hidden text-[#1F2329]';

  if (showSuccess) {
    return (
      <div className="flex min-h-screen justify-center bg-gray-100 font-sans">
        <style>{SHARED_THEME_STYLES}</style>
        <div className={`${shellClass} bg-white`}>
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex flex-1 flex-col items-center justify-center p-6 text-center"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#E5CEAF]/20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E5CEAF] shadow-lg shadow-[#E5CEAF]/50">
                <Check className="h-8 w-8 text-white" strokeWidth={3} />
              </div>
            </div>

            <h2 className="mb-3 text-2xl font-black text-gray-900">恭喜您，开户成功</h2>
            <p className="mb-10 font-bold text-gray-500">现在您已经可以去分享根数据获得收益了！</p>

            <div className="w-full max-w-sm space-y-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full rounded-full bg-[#C8161D] py-4 text-base font-black text-white shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                立即分享根数据赚取收益
              </button>
              <button
                type="button"
                onClick={() => navigate('/root-data-draft')}
                className="w-full rounded-full bg-gray-900 py-4 text-base font-black text-white transition-all active:scale-95"
              >
                立即开发根数据
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-gray-100 font-sans">
      <style>{SHARED_THEME_STYLES}</style>
      <div className={`${shellClass} bg-gray-50`}>
        <div className="relative flex shrink-0 items-center justify-center border-b border-gray-100 bg-white px-4 py-4 shadow-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-4 rounded-full p-2 transition-colors hover:bg-gray-100"
            aria-label="返回"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <h1 className="text-lg font-black tracking-wider text-gray-900">开通收款账户</h1>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-6">
            <div className="mb-6 flex items-center rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
              <button
                type="button"
                onClick={() => setAccountType('personal')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition-all ${accountType === 'personal' ? 'bg-red-50 text-[#C8161D]' : 'text-gray-500'}`}
              >
                <User className="h-4 w-4" /> 个人账号
              </button>
              <button
                type="button"
                onClick={() => setAccountType('enterprise')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition-all ${accountType === 'enterprise' ? 'bg-red-50 text-[#C8161D]' : 'text-gray-500'}`}
              >
                <Building2 className="h-4 w-4" /> 企业账号
              </button>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
              {accountType === 'personal' ? (
                <div className="space-y-5">
                  <div className="mb-2 flex items-center rounded-lg bg-gray-50 px-3 py-2 text-xs font-bold text-gray-400">
                    日收款限额：10万元
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-400">姓名</label>
                    <input
                      type="text"
                      value="张三"
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border-none bg-gray-100 px-4 py-3.5 text-[15px] font-bold text-gray-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-400">身份证号</label>
                    <input
                      type="text"
                      value="**************1234"
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border-none bg-gray-100 px-4 py-3.5 text-[15px] font-bold text-gray-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-400">证件有效期</label>
                    <div className="mb-2 flex items-center gap-2">
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-gray-700">
                        <input
                          type="checkbox"
                          checked={personalLongTerm}
                          onChange={(e) => setPersonalLongTerm(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-[#C8161D] focus:ring-[#C8161D]"
                        />
                        长期有效
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        className="min-w-0 w-full flex-1 rounded-xl border-none bg-gray-50 px-2 py-3 text-[13px] font-bold text-gray-900 outline-none transition-all focus:ring-2 focus:ring-red-100"
                      />
                      <span className="font-bold text-gray-400">-</span>
                      {!personalLongTerm ? (
                        <input
                          type="date"
                          className="min-w-0 w-full flex-1 rounded-xl border-none bg-gray-50 px-2 py-3 text-[13px] font-bold text-gray-900 outline-none transition-all focus:ring-2 focus:ring-red-100"
                        />
                      ) : (
                        <input
                          type="text"
                          value="长期有效"
                          disabled
                          className="min-w-0 w-full flex-1 cursor-not-allowed rounded-xl border-none bg-gray-100 px-2 py-3 text-center text-[13px] font-bold text-gray-400 outline-none"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-400">手机号</label>
                    <input
                      type="text"
                      value="138****8888"
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border-none bg-gray-100 px-4 py-3.5 text-[15px] font-bold text-gray-400 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="mb-2 flex items-center rounded-lg bg-gray-50 px-3 py-2 text-xs font-bold text-gray-400">
                    日收款限额：100万元
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-400">企业名称</label>
                    <input
                      type="text"
                      placeholder="请输入企业名称"
                      className="w-full rounded-xl border-none bg-gray-50 px-4 py-3.5 text-[15px] font-bold text-gray-900 outline-none transition-all placeholder:font-normal placeholder:text-gray-300 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-400">营业执照编号</label>
                    <input
                      type="text"
                      placeholder="请输入统一社会信用代码"
                      className="w-full rounded-xl border-none bg-gray-50 px-4 py-3.5 text-[15px] font-bold text-gray-900 outline-none transition-all placeholder:font-normal placeholder:text-gray-300 focus:ring-2 focus:ring-red-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-400">证照有效期</label>
                    <div className="mb-2 flex items-center gap-2">
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-gray-700">
                        <input
                          type="checkbox"
                          checked={enterpriseLongTerm}
                          onChange={(e) => setEnterpriseLongTerm(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-[#C8161D] focus:ring-[#C8161D]"
                        />
                        长期有效
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        className="min-w-0 w-full flex-1 rounded-xl border-none bg-gray-50 px-2 py-3 text-[13px] font-bold text-gray-900 outline-none transition-all focus:ring-2 focus:ring-red-100"
                      />
                      <span className="font-bold text-gray-400">-</span>
                      {!enterpriseLongTerm ? (
                        <input
                          type="date"
                          className="min-w-0 w-full flex-1 rounded-xl border-none bg-gray-50 px-2 py-3 text-[13px] font-bold text-gray-900 outline-none transition-all focus:ring-2 focus:ring-red-100"
                        />
                      ) : (
                        <input
                          type="text"
                          value="长期有效"
                          disabled
                          className="min-w-0 w-full flex-1 cursor-not-allowed rounded-xl border-none bg-gray-100 px-2 py-3 text-center text-[13px] font-bold text-gray-400 outline-none"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-400">注册地</label>
                    <div className="flex gap-2">
                      <select className="flex-1 cursor-pointer appearance-none rounded-xl border-none bg-gray-50 px-3 py-3.5 text-sm font-bold text-gray-900 outline-none transition-all focus:ring-2 focus:ring-red-100">
                        <option value="">省份</option>
                        <option value="bj">北京</option>
                        <option value="sh">上海</option>
                        <option value="gd">广东</option>
                      </select>
                      <select className="flex-1 cursor-pointer appearance-none rounded-xl border-none bg-gray-50 px-3 py-3.5 text-sm font-bold text-gray-900 outline-none transition-all focus:ring-2 focus:ring-red-100">
                        <option value="">城市</option>
                        <option value="bj-c">北京市</option>
                        <option value="sh-c">上海市</option>
                        <option value="gz-c">广州市</option>
                      </select>
                      <select className="flex-1 cursor-pointer appearance-none rounded-xl border-none bg-gray-50 px-3 py-3.5 text-sm font-bold text-gray-900 outline-none transition-all focus:ring-2 focus:ring-red-100">
                        <option value="">区县</option>
                        <option value="cy">朝阳区</option>
                        <option value="xh">徐汇区</option>
                        <option value="th">天河区</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-400">注册详细地址</label>
                    <input
                      type="text"
                      placeholder="请输入详细地址"
                      className="w-full rounded-xl border-none bg-gray-50 px-4 py-3.5 text-[15px] font-bold text-gray-900 outline-none transition-all placeholder:font-normal placeholder:text-gray-300 focus:ring-2 focus:ring-red-100"
                    />
                  </div>

                  <div className="my-6 h-px bg-gray-100" />

                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-400">法人姓名</label>
                    <input
                      type="text"
                      placeholder="请输入法人姓名"
                      className="w-full rounded-xl border-none bg-gray-50 px-4 py-3.5 text-[15px] font-bold text-gray-900 outline-none transition-all placeholder:font-normal placeholder:text-gray-300 focus:ring-2 focus:ring-red-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-400">法人证件类型</label>
                    <select className="w-full cursor-pointer appearance-none rounded-xl border-none bg-gray-50 px-4 py-3.5 text-[15px] font-bold text-gray-900 outline-none transition-all focus:ring-2 focus:ring-red-100">
                      <option value="idcard">身份证</option>
                      <option value="passport">护照</option>
                      <option value="hkmo">港澳居民来往内地通行证</option>
                      <option value="tw">台湾居民来往大陆通行证</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-400">法人证件号码</label>
                    <input
                      type="text"
                      placeholder="请输入法人证件号"
                      className="w-full rounded-xl border-none bg-gray-50 px-4 py-3.5 text-[15px] font-bold text-gray-900 outline-none transition-all placeholder:font-normal placeholder:text-gray-300 focus:ring-2 focus:ring-red-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-400">法人证件有效期</label>
                    <div className="mb-2 flex items-center gap-2">
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-gray-700">
                        <input
                          type="checkbox"
                          checked={legalPersonLongTerm}
                          onChange={(e) => setLegalPersonLongTerm(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-[#C8161D] focus:ring-[#C8161D]"
                        />
                        长期有效
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        className="min-w-0 w-full flex-1 rounded-xl border-none bg-gray-50 px-2 py-3 text-[13px] font-bold text-gray-900 outline-none transition-all focus:ring-2 focus:ring-red-100"
                      />
                      <span className="font-bold text-gray-400">-</span>
                      {!legalPersonLongTerm ? (
                        <input
                          type="date"
                          className="min-w-0 w-full flex-1 rounded-xl border-none bg-gray-50 px-2 py-3 text-[13px] font-bold text-gray-900 outline-none transition-all focus:ring-2 focus:ring-red-100"
                        />
                      ) : (
                        <input
                          type="text"
                          value="长期有效"
                          disabled
                          className="min-w-0 w-full flex-1 cursor-not-allowed rounded-xl border-none bg-gray-100 px-2 py-3 text-center text-[13px] font-bold text-gray-400 outline-none"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t border-gray-100 bg-white p-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-full bg-[#C8161D] py-4 text-base font-black text-white shadow-lg shadow-red-200 transition-all active:scale-95"
            >
              {isSubmitting ? '开户中...' : '立即开户'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOpeningPage;
