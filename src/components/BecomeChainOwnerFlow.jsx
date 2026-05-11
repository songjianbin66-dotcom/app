import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Check,
  Clock,
  Camera,
  BadgeAlert,
} from 'lucide-react';

export function BecomeChainOwnerFlow({ onClose, onSuccess, onRootDataDev, onOpenAccount }) {
  const [step, setStep] = useState(0);

  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    if (step === 3) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [name, setName] = useState('');
  const [idCard, setIdCard] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [isManualAuth, setIsManualAuth] = useState(false);
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);
  const [thirdPartyIframeOpen, setThirdPartyIframeOpen] = useState(false);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [shakeTerms, setShakeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [showAuthSuccess, setShowAuthSuccess] = useState(false);

  const handleNextStep = () => {
    if (step === 1 && !showAuthSuccess) {
      setShowAuthSuccess(true);
    } else if (step === 1 && showAuthSuccess) {
      setShowAuthSuccess(false);
      setStep(step + 1);
    } else if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 0 && step < 4) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const renderStepsIndicator = (currentStep) => {
    const steps = ['实名认证', '签订协议', '支付'];
    return (
      <div className="flex justify-between items-center mb-10 text-[13px] font-bold px-2 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10" />
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isPassed = currentStep > stepNum;
          return (
            <div
              key={label}
              className={`flex flex-col items-center gap-2 ${isActive ? 'text-[#C8161D]' : isPassed ? 'text-gray-900' : 'text-gray-400'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-black transition-all ${isActive ? 'bg-[#C8161D] text-white shadow-lg' : isPassed ? 'bg-[#E5CEAF] text-white' : 'bg-gray-100'}`}
              >
                {isPassed ? <Check className="w-5 h-5" strokeWidth={3} /> : stepNum}
              </div>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[100] flex min-h-0 flex-col overflow-hidden bg-gray-50"
    >
      {step < 4 && (
        <div className="bg-white px-4 py-4 flex items-center justify-center relative sticky top-0 z-10 shadow-sm border-b border-gray-100 shrink-0">
          <button
            type="button"
            onClick={step === 0 ? onClose : handlePrevStep}
            className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-lg font-black text-gray-900 tracking-wider">
            {step === 0 && '开通链主'}
            {step === 1 && '实名认证'}
            {step === 2 && '签订协议'}
            {step === 3 && '支付链主费'}
          </h1>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {step === 0 && (
        <>
        <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar p-6">
          <h2 className="text-xl font-black text-gray-900 mb-6">链主开通步骤</h2>

          <div className="flex justify-between items-center mb-10 text-[13px] font-bold">
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-200">1</span>
              <span>实名认证</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-200">2</span>
              <span>签订协议</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-200">3</span>
              <span>支付费用</span>
            </div>
          </div>

          <div className="flex items-stretch gap-2 pb-6 mt-6">
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 relative flex flex-col items-center">
              <div className="absolute -top-3 w-full flex justify-center">
                <div className="  text-gray-900 px-1 py-1 text-[11px] font-black rounded whitespace-nowrap text-center scale-90 w-max  ">
                  根数据开发权
                </div>
              </div>
              <div className="p-1 pt-6 pb-2 flex-1 flex flex-col justify-center text-center">
                <p className="text-gray-500 font-bold leading-relaxed text-[11px] mt-1">
                  成为链主将获得
                  <br />
                  所有根数据使用权
                  <br />
                  和根数据<span className="font-black text-gray-900 text-xs">开发权</span>
                </p>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 relative flex flex-col items-center">
              <div className="absolute -top-3 w-full flex justify-center">
                <div className=" text-gray-900 px-1 py-1 text-[11px] font-black rounded whitespace-nowrap text-center scale-90 w-max  ">
                  1800链主额度销售权
                </div>
              </div>
              <div className="p-1 pt-6 pb-2 flex-1 flex flex-col justify-center text-center">
                <p className="text-gray-500 font-bold leading-relaxed text-[11px] mt-1">
                  成为链主将拥有
                  <br />
                  <span className="font-black text-[#C8161D] text-xs">1800</span>个链主额度
                  <br />
                  的<span className="font-black text-gray-900 text-xs">销售权</span>
                </p>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 relative flex flex-col items-center">
              <div className="absolute -top-3 w-full flex justify-center">
                <div className=" text-gray-900 px-1 py-1 text-[11px] font-black rounded whitespace-nowrap text-center scale-90 w-max">
                  根数据指导权
                </div>
              </div>
              <div className="p-1 pt-6 pb-2 flex-1 flex flex-col justify-center text-center">
                <p className="text-gray-500 font-bold leading-relaxed text-[11px] mt-1">
                  成为链主或可获得
                  <br />
                  根数据的<span className="font-black text-gray-900 text-xs">指导权</span>
                  <br />
                  赢得长期收益
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <p className="text-[13px] font-bold text-gray-500 leading-relaxed">
              以上是链主的三大权益，请详细阅读下方《链主协议》中的每一条款。开通链主权益分三步：完成实名认证、签署《链主协议》、支付费用10000元。
              <br />
              <span className="text-[#C8161D]">投资必须谨慎</span>
              ，链主协议一经签定生效概不退款。
            </p>
          </div>
        </div>
          <div className="shrink-0 border-t border-gray-100 bg-white p-6 space-y-4">
            <button
              type="button"
              onClick={() => {
                if (!agreedToTerms) {
                  alert('您需要先查看并同意链主协议');
                  setShakeTerms(true);
                  setTimeout(() => setShakeTerms(false), 500);
                  return;
                }
                handleNextStep();
              }}
              className="w-full py-4 rounded-full font-black text-base transition-all active:scale-95 shadow-lg bg-[#C8161D] text-white shadow-red-200"
            >
              立即开始实名认证
            </button>
            <motion.div
              animate={shakeTerms ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${agreedToTerms ? 'bg-[#C8161D] border-[#C8161D]' : 'bg-white border-gray-300'}`}
              >
                {agreedToTerms && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </button>
              <span className="text-xs font-bold text-gray-500">
                接受并同意{' '}
                <span className="text-[#C8161D] cursor-pointer" onClick={() => setShowTermsModal(true)}>
                  《链主协议》
                </span>
              </span>
            </motion.div>
          </div>
        </>
      )}

      {step === 1 && !showAuthSuccess && (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar p-6">
          {renderStepsIndicator(1)}

          {!isManualAuth ? (
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex-1 flex flex-col items-center">
              <h2 className="text-xl font-black text-gray-900 mb-2 mt-2">请拍摄/上传本人身份证照片</h2>
              <p className="text-gray-400 text-xs font-bold mb-8">
                请保证证件边框完整、字体清晰、亮度均匀 <BadgeAlert className="w-3 h-3 inline pb-0.5" />
              </p>

              <div className="w-full space-y-4 flex-1">
                <button
                  type="button"
                  onClick={() => {
                    setFrontUploaded(true);
                    setTimeout(() => {
                      setName('张三');
                      setIdCard('110105199001011234');
                    }, 500);
                  }}
                  className={`w-full h-40 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${frontUploaded ? 'border-[#C8161D] bg-red-50/50' : 'border-gray-100 border-dashed bg-gray-50'}`}
                >
                  {frontUploaded ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-[#C8161D] mb-3" />
                      <span className="text-[#C8161D] font-bold text-sm">人像面已上传</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-gray-400 mb-3" />
                      <span className="text-gray-500 font-bold text-sm">点击上传人像面</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setBackUploaded(true)}
                  className={`w-full h-40 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${backUploaded ? 'border-[#C8161D] bg-red-50/50' : 'border-gray-100 border-dashed bg-gray-50'}`}
                >
                  {backUploaded ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-[#C8161D] mb-3" />
                      <span className="text-[#C8161D] font-bold text-sm">国徽面已上传</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-gray-400 mb-3" />
                      <span className="text-gray-500 font-bold text-sm">点击上传国徽面</span>
                    </>
                  )}
                </button>
              </div>

              {frontUploaded && name ? (
                <div className="mt-6 w-full bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs font-bold text-gray-400 mb-2">识别结果</p>
                  <p className="text-[15px] font-black text-gray-900">
                    {name} <span className="text-gray-300 mx-2">|</span> {idCard}
                  </p>
                </div>
              ) : (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setIsManualAuth(true)}
                    className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    身份证没在身边，手动输入
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex-1 relative">
              <button
                type="button"
                onClick={() => setIsManualAuth(false)}
                className="absolute right-6 top-6 text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                返回拍照上传
              </button>
              <h2 className="text-xl font-black text-gray-900 mb-8 mt-2">手动输入身份信息</h2>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-2 block">真实姓名</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="请输入您的真实姓名"
                    className="w-full bg-gray-50 rounded-xl px-4 py-3.5 text-[15px] font-bold text-gray-900 border-none outline-none focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-300 placeholder:font-normal"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-2 block">身份证号码</label>
                  <input
                    value={idCard}
                    onChange={(e) => setIdCard(e.target.value)}
                    type="text"
                    placeholder="请输入18位身份证号"
                    className="w-full bg-gray-50 rounded-xl px-4 py-3.5 text-[15px] font-bold text-gray-900 border-none outline-none focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-300 placeholder:font-normal"
                  />
                </div>
              </div>
            </div>
          )}
          </div>
          <div className="shrink-0 border-t border-gray-100 bg-white p-6">
            <button
              type="button"
              disabled={(!isManualAuth && (!frontUploaded || !backUploaded)) || (isManualAuth && (!name || !idCard))}
              className="w-full py-4 rounded-full font-black text-base transition-all active:scale-95 shadow-lg bg-[#C8161D] text-white flex justify-center items-center gap-2 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
              onClick={() => {
                setThirdPartyIframeOpen(true);
              }}
            >
              开始验证
            </button>
          </div>
        </>
      )}

      {step === 1 && showAuthSuccess && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white">
          <div className="w-24 h-24 rounded-full bg-[#E5CEAF]/20 flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#E5CEAF] flex items-center justify-center shadow-lg shadow-[#E5CEAF]/50">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-3">恭喜您，实名认证通过！</h2>
          <p className="text-gray-500 font-bold mb-10">您的身份信息已核实</p>

          <div className="w-full max-w-sm space-y-4">
            <button
              type="button"
              onClick={() => handleNextStep()}
              className="w-full py-4 rounded-full font-black text-base transition-all active:scale-95 shadow-lg bg-[#C8161D] text-white shadow-red-200"
            >
              立即签署链主协议
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
          {renderStepsIndicator(2)}

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm flex min-h-0 flex-1 flex-col overflow-hidden relative">
            <div className="bg-gray-50 py-3 px-4 border-b border-gray-100 flex items-center justify-center relative">
              <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-4" />
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">第三方电子合同签署平台</span>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-[13px] leading-loose text-gray-600">
              <h3 className="text-center font-black text-gray-900 text-lg mb-6">《链主框架合作协议》</h3>
              <p className="font-bold mb-2 text-gray-800">甲方：平台运营方</p>
              <p className="font-bold mb-4 text-gray-800">乙方：认证链主 (您)</p>

              <p>1. 乙方自愿支付相关费用成为平台“链主”，享有根数据的开发权、使用权以及平台规定的其他权益。</p>
              <br />
              <p>2. 乙方承诺在享有上述权利同时，严格遵守国家相关法律法规规则，不得利用根数据从事任何违法活动。</p>
              <br />
              <p>3. 乙方知悉并同意拥有1800个链主额度的销售授权，产生的收益依据平台最新发布的政策结算。</p>
              <br />
              <p>
                4.{' '}
                <span className="font-bold text-[#C8161D]">
                  协议一经签字并完成付款即刻生效，款项将不予退还，请在签署前仔细评估商业风险。
                </span>
              </p>
              <br />
              <p>5. 本电子合同具有与纸质合同同等之法律效力。</p>
            </div>
          </div>
          </div>

          <div className="flex shrink-0 gap-4 border-t border-gray-100 bg-white p-6">
            <button type="button" onClick={handlePrevStep} className="flex-1 py-4 rounded-full font-black text-sm bg-gray-100 text-gray-700 active:scale-95 transition-all">
              暂不签署
            </button>
            <button
              type="button"
              onClick={() => {
                setIsVerifying(true);
                setTimeout(() => {
                  setIsVerifying(false);
                  handleNextStep();
                }, 1200);
              }}
              className="flex-[2] py-4 rounded-full font-black text-sm bg-[#C8161D] text-white active:scale-95 transition-all shadow-lg shadow-red-200"
            >
              {isVerifying ? '签署中...' : '我已阅读并签字'}
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-6">
          <div className="mb-8 w-full">{renderStepsIndicator(3)}</div>

          <div className="bg-white w-full rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center mt-4">
            <h3 className="text-gray-500 font-bold mb-2">待支付链主费</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-2xl font-bold text-gray-900">¥</span>
              <span className="text-5xl font-black text-gray-900 tracking-tight">
                10000<span className="text-3xl">.00</span>
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 bg-red-50 px-5 py-2.5 rounded-full text-[#C8161D] font-bold text-[13px] mb-4">
              <Clock className="w-4 h-4" />
              <span>
                支付剩余时间 <span className="font-mono">{formatTime(timeLeft)}</span>
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-bold">请在倒计时结束前完成支付</p>
          </div>
          </div>

          <div className="shrink-0 border-t border-gray-100 bg-white p-6">
            <button
              type="button"
              onClick={() => {
                setIsVerifying(true);
                setTimeout(() => {
                  setIsVerifying(false);
                  handleNextStep();
                }, 1500);
              }}
              className="w-full py-4 rounded-full font-black text-base transition-all active:scale-95 shadow-lg bg-[#C8161D] text-white flex justify-center items-center gap-2"
            >
              {isVerifying ? '正在支付...' : '去支付'}
            </button>
          </div>
        </>
      )}

      {step === 4 && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white">
          <div className="w-24 h-24 rounded-full bg-[#E5CEAF]/20 flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#E5CEAF] flex items-center justify-center shadow-lg shadow-[#E5CEAF]/50">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-3">恭喜您，签约成功</h2>
          <p className="text-gray-500 font-bold mb-10">您已成为尊贵的链主</p>

          <div className="w-full max-w-sm space-y-4">
            <button
              type="button"
              onClick={() => onOpenAccount()}
              className="w-full py-4 rounded-full font-black text-base transition-all active:scale-95 shadow-lg bg-[#C8161D] text-white shadow-red-200"
            >
              继续开通收款账户
            </button>
            <button
              type="button"
              onClick={() => onRootDataDev()}
              className="w-full py-4 rounded-full font-black text-base transition-all active:scale-95 shadow-lg bg-gray-900 text-white"
            >
              立即开发根数据
            </button>
            <button
              type="button"
              onClick={() => onSuccess()}
              className="w-full py-4 rounded-full font-black text-base transition-all active:scale-95 border-2 border-gray-100 text-gray-600 bg-white"
            >
              返回首页
            </button>
          </div>
        </div>
      )}
      </div>

      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-[200] flex flex-col bg-white"
          >
            <div className="bg-white px-4 py-4 flex items-center justify-center relative sticky top-0 z-10 shadow-sm border-b border-gray-100 shrink-0">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <h1 className="text-lg font-black text-gray-900 tracking-wider">《链主协议》</h1>
            </div>
            <div className="p-6 overflow-y-auto flex-1 text-[13px] leading-loose text-gray-600">
              <p>第一条：本协议旨在明确链主的权利与义务。用户在确认同意本协议前，应当充分阅读、理解各项条款内容。</p>
              <br />
              <p>第二条：作为链主，您将获得开发、使用及指导相关根数据的权利。您应当遵守平台相关规则及国家法律法规。</p>
              <br />
              <p>第三条：关于1800个链主额度的销售授权，平台将提供必要的技术支持与服务，具体收益分配以平台不时更新的结算规则为准。</p>
              <br />
              <p>第四条：请注意，任何投资均存在风险。链主费用的支付属于资源的预先采买。协议一旦签署生效，相关费用概不退还，敬请谅解并谨慎决策。</p>
              <br />
              <p>第五条：如有违规操作或滥用职权，平台有权随时终止您的链主身份并追究法律责任。</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {thirdPartyIframeOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-[300] flex flex-col bg-gray-50"
          >
            <div className="bg-white px-4 py-4 flex items-center justify-center relative sticky top-0 z-10 shadow-sm border-b border-gray-100 shrink-0">
              <button
                type="button"
                onClick={() => setThirdPartyIframeOpen(false)}
                className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <h1 className="text-lg font-black text-gray-900 tracking-wider">第三方实名认证</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">安全认证环境中...</h2>
              <p className="text-gray-500 text-sm mb-10">此页面模拟拉起第三方认证服务</p>

              <button
                type="button"
                onClick={() => {
                  setThirdPartyIframeOpen(false);
                  setShowAuthSuccess(true);
                }}
                className="w-full max-w-xs py-4 rounded-full font-black text-base transition-all active:scale-95 shadow-lg bg-blue-500 text-white"
              >
                模拟认证成功并返回
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
