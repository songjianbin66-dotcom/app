import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Play,
  Search,
  Star,
  X,
} from 'lucide-react';
import { TiArrowForward } from 'react-icons/ti';
import './player.css';
import ContentPreviewPage from '../components/ContentPreviewPage.jsx';

const sectionTabs = [
  { key: 'mindmap', label: '脑图' },
  { key: 'lecture', label: '讲解' },
  { key: 'original', label: '原文' },
];

const sampleVideos = [
  'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4',
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
  'https://media.w3.org/2010/05/bunny/trailer.mp4',
];

const homepageInstructorAvatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
];

const makeVideo = (id, title, sourceIndex, duration) => ({
  id,
  title,
  duration,
  source: sampleVideos[sourceIndex % sampleVideos.length],
});

function makeMindmapContent(action, keyPoint, target, goal) {
  return {
    action,
    keyPoint,
    target,
    situation: '数智化转型进入深水区，团队需要把零散经验沉淀成可复用资产',
    advantage: '内容、数据和协作网络',
    principle: '先结构化，再视频化，最后持续复盘',
    method: '根数据拆解法',
    steps: ['明确核心目标', '拆出关键节点', '绑定视频讲解', '通过评论和收藏验证价值'],
    time: '30 天',
    goal,
  };
}

function makeOriginalContent(title, focus) {
  return `
    <p><strong>${title}</strong> 的核心，是把原本散落在经验、会议和内容里的知识，整理成可以播放、<u>可以复盘、可以协作传播的根数据</u>。</p>
    <p>在这个过程中，<u>${focus}</u> 不是一句口号，<strong>而是一套可以被反复训练的工作方式。</strong>每个节点都需要对应清晰的表达、真实的视频材料，以及能够被用户理解的行动路径。</p>
    <figure>
      <img
        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
        alt="${title} 配图"
      />
    </figure>
    <p>当脑图负责结构，原文负责语义，讲解负责传递时，一条根数据就能从“信息”变成<strong>“可执行的资产”</strong>。</p>
  `;
}

function makeLectureContent(...items) {
  return items.map((content, index) => ({
    id: `lecture-note-${index + 1}`,
    content,
  }));
}

const rootDataFeed = [
  {
    id: 'root-001',
    title: '产业数智链增长模型',
    creator: '史教授数智课',
    avatar: '史',
    avatarUrl: homepageInstructorAvatars[0],
    sections: {
      mindmap: {
        title: '战略拆解脑图',
        content: makeMindmapContent('建设产业数智链', '增长飞轮', '产业协作团队', '形成可持续成交闭环'),
        videos: [makeVideo('root-001-mindmap-1', '总览：增长飞轮脑图', 0, '02:18')],
        stats: { likes: '2.4w', comments: '842', favorites: '1.2w', shares: '1.1w' },
        comments: [
          makeComment(1, '访客', '访', 5, '这张脑图把复杂逻辑压得很清楚，能直接拿去复盘。'),
          makeComment(2, '项目同事', '同', 15, '左右切换部分以后，学习节奏会更自然。'),
        ],
      },
      original: {
        title: '原文：产业升级的关键表述',
        content: makeOriginalContent('产业数智链增长模型', '增长飞轮'),
        videos: [makeVideo('root-001-original-1', '原文逐句阅读', 1, '04:10')],
        stats: { likes: '1.8w', comments: '526', favorites: '9.6k', shares: '8.3k' },
        comments: [
          makeComment(3, '产品经理', '产', 24, '原文和讲解分开后，对比理解更轻松。'),
          makeComment(4, '学习者', '学', 31, '这一段适合配合脑图反复看。'),
        ],
      },
      lecture: {
        title: '讲解：从根数据到行动方案',
        content: makeLectureContent(
          `先解释根数据的定义：它不是单条视频，也不是一张孤立脑图，而是一组能够互相证明、互相补充、互相跳转的内容结构。用户看到的每一个节点，都应该能回答“这条信息解决什么问题”“和上下文是什么关系”“为什么值得继续看”。

          所以讲解的第一步，不是急着给答案，而是先帮用户建立一个认知框架。只有当用户知道自己正在理解什么、为什么要理解，它才会愿意继续进入后面的动作和案例。`,
          `再拆落地动作：从脑图到原文，再到讲解，每一步都要能支撑用户继续理解，不能只是形式上的切换。脑图负责提纲挈领，原文负责把概念说准确，讲解负责把“知道”变成“会用”。

          如果其中任一层断掉，用户就会觉得内容很多，但抓不住重点。所以这一集的重点，不是多讲，而是把三层内容之间的承接关系讲清楚，让每一次切换都有明确目的。`,
          `最后看复盘指标：点赞、收藏、评论和分享分别反映不同层面的价值反馈。点赞代表即时认同，收藏代表未来还会回来用，评论代表用户愿意把自己的理解放进来，分享则说明这条内容已经具备传播价值。

          真正有用的讲解，不是只看某一个数字高不高，而是看这些指标组合起来说明了什么。只有把反馈读懂，后面的内容扩充和选题迭代才不会盲改。`,
          `补充案例拆解：把一条根数据放进真实业务场景，验证它是否能指导协作与成交。比如同样一句方法论，在会议复盘里可能是一个判断标准，在销售培训里可能是一段讲解脚本，在客户沟通里又会变成一句更易理解的话。

          案例的价值就在这里，它能帮我们确认这条讲解不是“写得漂亮”，而是真的能在不同场景里被拿去用。讲解一旦进入真实业务，就会暴露出哪些地方还不够具体、哪些地方需要补证据。`,
          `测试集扩展：增加更多讲解集数，观察用户在多集切换时的理解节奏和完成率。单集内容看起来通顺，不代表整组内容组合在一起也顺；很多问题只有放进连续观看路径里，才会真正出现。

          所以这一步不是简单加视频，而是测试“顺序是否合理”“每集之间是否有重复”“用户会不会在某一集明显掉线”。这些观察结果，会反过来帮助我们重排讲解结构。`,
          `继续补方法边界：什么场景适合先做脑图，什么场景应该先回到原文厘清定义，这件事如果不讲，团队很容易把方法用反。很多人一上来就急着画结构，结果概念本身没对齐，后面所有拆解都会偏。

          这一集要补的不是技巧，而是判断标准。什么时候先求清晰、什么时候先求完整、什么时候应该停下来做定义校准，这些边界讲清楚以后，方法才不会被机械照搬。`,
          `加入团队协作样例：同一条根数据如何在运营、销售和交付之间复用。运营关心传播话术，销售关心转化表达，交付关心落地步骤，看起来像三套语言，其实背后引用的是同一组核心认知。

          讲解在这里起到的是“翻译层”的作用，它把同一个底层结构，转换成不同角色都能直接使用的表达方式。这样团队共享的不是零散素材，而是真正可复用的资产。`,
          `最后补一次复训提醒：用户看完讲解后，下一步应该回到哪里继续执行。很多内容到“听懂”就结束了，但真正有价值的讲解，应该把人送回行动现场，而不是把人留在知识消费里。

          所以结尾要明确提醒：如果你刚刚理解的是结构，就回脑图复盘；如果你要校准表述，就回原文逐句看；如果你准备执行，就把这一集里的动作拆成待办。讲解的终点，不是播放完成，而是下一步动作开始。`
        ),
        videos: [
          makeVideo('root-001-lecture-1', '讲解一：定义根数据', 2, '05:15'),
          makeVideo('root-001-lecture-2', '讲解二：落地动作', 0, '04:38'),
          makeVideo('root-001-lecture-3', '讲解三：复盘指标', 1, '03:44'),
          makeVideo('root-001-lecture-4', '讲解四：案例拆解', 0, '04:12'),
          makeVideo('root-001-lecture-5', '讲解五：测试集扩展', 2, '03:58'),
          makeVideo('root-001-lecture-6', '讲解六：方法边界', 1, '04:26'),
          makeVideo('root-001-lecture-7', '讲解七：团队协作样例', 0, '05:03'),
          makeVideo('root-001-lecture-8', '讲解八：复训提醒', 2, '03:36'),
        ],
        stats: { likes: '3.1w', comments: '1.1k', favorites: '1.7w', shares: '1.4w' },
        comments: [
          makeComment(5, '体验官', '验', 23, '讲解视频更像是把方法真正讲活了。'),
          makeComment(6, '业务负责人', '业', 44, '可以直接作为团队培训材料。'),
        ],
      },
    },
  },
  {
    id: 'root-002',
    title: 'AI 协作工作流',
    creator: '用户协作分享',
    avatar: '协',
    avatarUrl: homepageInstructorAvatars[1],
    sections: {
      mindmap: {
        title: '脑图：人机协同路径',
        content: makeMindmapContent('搭建 AI 协作流程', '任务拆分', '知识工作者', '让复杂任务稳定交付'),
        videos: [makeVideo('root-002-mindmap-1', '协作链路总览', 1, '02:32')],
        stats: { likes: '5.2k', comments: '342', favorites: '982', shares: '612' },
        comments: [makeComment(7, '设计师', '设', 16, '横向三段切换很符合学习时的思路。')],
      },
      original: {
        title: '原文：提示词协作原则',
        content: makeOriginalContent('AI 协作工作流', '任务拆分'),
        videos: [makeVideo('root-002-original-1', '原文精读', 2, '04:01')],
        stats: { likes: '7.8k', comments: '419', favorites: '1.4k', shares: '956' },
        comments: [makeComment(8, '运营同学', '运', 9, '原文部分单独收藏很有必要。')],
      },
      lecture: {
        title: '讲解：把提示词变成流程',
        content: makeLectureContent(
          `把提示词从一次性输入，升级成团队可复用的流程模板，是 AI 协作真正提效的关键。单个人靠经验写出一个好提示词，并不等于团队就能稳定复制这个结果；只有把目标、上下文、步骤和验收标准都显性化，它才有可能被别人接住。

          这也是为什么我们强调“流程化”而不是“神奇提示词”。真正决定交付质量的，往往不是一句话写得多聪明，而是整个链路里有没有清楚的接力关系。`,
          `补充一集流程接力演示，让角色切换、上下文传递和验收标准更清楚。发起人给的信息不完整，执行人就会猜；执行人输出得不成型，审核人就只能返工。很多协作问题并不是能力问题，而是交接面设计得太模糊。

          所以这一集要讲的重点，是每一次接力都要留下可验证的信息。谁输入、谁加工、谁判断合格，这些边界一旦明确，流程就会变得顺很多。`,
          `再补一集错误修正案例，展示当输出偏航时该如何拉回。真实协作里，偏航不是例外，而是常态；如果没有纠偏机制，再好的流程模板也会在复杂任务里失效。

          这一集会重点说明三件事：先识别偏差发生在哪一层，再决定是补上下文、改任务拆分，还是重写验收标准。错误不是流程的反面，能不能快速拉回，反而最能证明流程是否成熟。`,
          `最后加入测试集回放，用来验证多集讲解下的信息承接是否自然。我们不是只看单次执行是否成功，更关注同一套流程在不同任务、不同成员、不同时间点下还能不能稳定复现。

          所以测试集的作用，是把流程放到更接近真实场景的环境里去检验。只有在多轮回放之后仍然顺畅的流程，才值得沉淀为团队共识。`,
          `继续补一集角色分工说明，让发起人、执行人和审核人的输入输出边界更清楚。发起人需要给出背景、目标和限制条件，执行人负责把任务展开成步骤，审核人则要依据标准做判断，而不是凭感觉说“再改改”。

          当三种角色的职责被说清楚以后，团队会明显减少那种“都在忙，但不知道谁该补这一刀”的情况。流程的效率，很多时候就差在这层角色清晰度上。`,
          `再加一集模板沉淀方法，说明哪些提示词应该固化进知识库，哪些应该保留弹性。固定得太死，团队会丧失适应新任务的能力；完全不沉淀，又会让每个人都在重复试错。

          比较稳的做法，是把高频、稳定、结构明确的部分沉成模板，把依赖场景判断的部分保留为空位。这样既能复用经验，又不会让模板成为新一轮低效的来源。`,
          `最后补交付复盘一集，把流程效果和真实业务结果连起来看。流程跑完不等于任务完成，更不等于业务变好了；只有把交付质量、返工次数、协作时长和最终结果一起放回来看，流程优化才有方向。

          这也是整组讲解的收束点。我们做流程，不是为了把过程做复杂，而是为了让复杂任务在团队里更稳定、更省力、更可复盘。`
        ),
        videos: [
          makeVideo('root-002-lecture-1', '流程搭建实操', 0, '06:20'),
          makeVideo('root-002-lecture-2', '流程接力演示', 1, '05:06'),
          makeVideo('root-002-lecture-3', '错误修正案例', 2, '04:18'),
          makeVideo('root-002-lecture-4', '测试集回放', 0, '03:47'),
          makeVideo('root-002-lecture-5', '角色分工说明', 1, '04:42'),
          makeVideo('root-002-lecture-6', '模板沉淀方法', 2, '05:11'),
          makeVideo('root-002-lecture-7', '交付复盘拆解', 0, '04:33'),
        ],
        stats: { likes: '1.1w', comments: '608', favorites: '2.3k', shares: '1.8k' },
        comments: [makeComment(9, '创业者', '创', 37, '这段讲解最适合给新人看。')],
      },
    },
  },
  {
    id: 'root-003',
    title: '品牌内容成交路径',
    creator: '片场速递',
    avatar: '片',
    avatarUrl: homepageInstructorAvatars[2],
    sections: {
      mindmap: {
        title: '脑图：内容到成交',
        content: makeMindmapContent('设计内容成交路径', '信任建立', '品牌内容团队', '提升内容转化效率'),
        videos: [makeVideo('root-003-mindmap-1', '成交路径脑图', 2, '02:44')],
        stats: { likes: '8.8k', comments: '126', favorites: '3.4k', shares: '743' },
        comments: [makeComment(10, '内容策划', '策', 49, '这个脑图适合做复盘模板。')],
      },
      original: {
        title: '原文：用户信任建立',
        content: makeOriginalContent('品牌内容成交路径', '用户信任建立'),
        videos: [makeVideo('root-003-original-1', '信任建立原文', 0, '03:05')],
        stats: { likes: '6.6k', comments: '233', favorites: '1.9k', shares: '521' },
        comments: [makeComment(11, '销售顾问', '销', 20, '原文可以直接摘到脚本里。')],
      },
      lecture: {
        title: '讲解：短视频成交拆解',
        content: makeLectureContent(
          `开场需要先建立问题意识，让用户知道这条内容为什么和自己有关。很多内容一上来就讲产品、讲优势、讲结果，但用户心里连“这件事和我有什么关系”都还没成立，自然不会继续往下看。

          所以开场真正要完成的，不是信息传递，而是注意力对齐。只要用户感受到“这是在说我的问题”，后面的信任建立和转化动作才有进入空间。`,
          `转化节点不是硬推销，而是把信任、证据和行动建议自然连接起来。用户愿不愿意进一步咨询，往往不是因为你说得多，而是因为它觉得你的建议有根据、你的表达不像催促、你的路径看起来可执行。

          这一集会特别强调节奏感。什么时候该给证据，什么时候该给承诺，什么时候只留一个很轻的行动口子，这些顺序一旦错了，内容就会显得用力过猛。`,
          `补充一集评论区互动设计，帮助内容从观看延伸到咨询和留资。很多转化不是发生在正文里，而是发生在用户看完以后愿不愿意开口那一刻。评论区如果设计得好，它会成为一个低门槛的转化缓冲区。

          所以我们不是简单追求评论数，而是要设计出能引导用户表达顾虑、暴露需求、愿意继续对话的问题。互动设计得越自然，后面的转化阻力就越小。`,
          `再补一集复盘测试，观察多集讲解是否更容易沉淀成交脚本。单条视频可能偶尔有效，但如果不能被复用，就很难真正形成团队资产。我们更关心的是：哪些表达稳定有效，哪些句子只是碰巧踩中情绪。

          复盘测试的目的，就是把这些有效表达提炼出来，逐步沉成一套可以持续复用的成交脚本，而不是每次都从零开始试。`,
          `继续加入一集用户异议拆解，把常见顾虑提前转成内容回答。很多用户不是没兴趣，而是心里有几个关键卡点没有被提前接住，比如“适不适合我”“会不会太复杂”“值不值得现在就做”。

          如果能在内容里预先回应这些异议，用户会明显更容易继续往下走。好的讲解不是回避质疑，而是比用户更早一步把疑问放到台面上解决。`,
          `再补一集证据展示设计，说明案例、数据和口碑该如何组合出现。只堆数字会显得冷，只讲故事会显得虚，只有把案例、结果和第三方证明搭配好，证据才会真正形成说服力。

          这一集重点讲的是“证据顺序”。先让用户看见类似的人，再让它看见具体结果，最后补一层可信来源，整段表达就会自然很多。`,
          `最后加一集成交脚本串联，把前面几集内容收束成一条完整转化路径。从问题唤起、价值建立、异议回应，到证据展示和行动引导，每一段都不是孤立存在的，而是为了把用户稳稳带到下一步。

          这集的作用，就是把零散的讲法串成一套可执行的话术路径。团队以后再做类似内容时，不需要重新摸索整套逻辑，只需要在这条主路径上替换场景和案例。`
        ),
        videos: [
          makeVideo('root-003-lecture-1', '开场结构拆解', 1, '04:27'),
          makeVideo('root-003-lecture-2', '转化节点拆解', 2, '05:02'),
          makeVideo('root-003-lecture-3', '互动设计拆解', 0, '03:41'),
          makeVideo('root-003-lecture-4', '复盘测试讲解', 1, '04:09'),
          makeVideo('root-003-lecture-5', '用户异议拆解', 2, '04:48'),
          makeVideo('root-003-lecture-6', '证据展示设计', 0, '03:57'),
          makeVideo('root-003-lecture-7', '成交脚本串联', 1, '05:14'),
        ],
        stats: { likes: '1.6w', comments: '734', favorites: '5.8k', shares: '2.1k' },
        comments: [makeComment(12, '品牌主理人', '品', 28, '讲解把成交链路讲得很细。')],
      },
    },
  },
];

function makeComment(id, author, avatar, imageIndex, content) {
  return {
    id,
    author,
    avatar,
    avatarUrl: `https://i.pravatar.cc/100?img=${imageIndex}`,
    content,
  };
}

const makeSectionStateKey = (rootId, sectionKey) => `${rootId}-${sectionKey}`;
const makeVideoRefKey = (rootId, sectionKey, videoId) =>
  `${rootId}-${sectionKey}-${videoId}`;

function resolveRouteStateTarget(routeState) {
  if (!routeState || typeof routeState !== 'object') {
    return null;
  }

  const { rootId, sectionKey, videoId } = routeState;

  if (typeof rootId !== 'string' || typeof sectionKey !== 'string') {
    return null;
  }

  const rootIndex = rootDataFeed.findIndex((root) => root.id === rootId);

  if (rootIndex < 0) {
    return null;
  }

  const root = rootDataFeed[rootIndex];
  const section = root.sections[sectionKey];

  if (!section) {
    return null;
  }

  const videoIndex = typeof videoId === 'string'
    ? section.videos.findIndex((video) => video.id === videoId)
    : -1;

  return {
    rootId: root.id,
    rootIndex,
    sectionKey,
    videoIndex: videoIndex >= 0 ? videoIndex : 0,
  };
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollerRef = useRef(null);
  const rootScrollTimeoutRef = useRef(null);
  const sectionScrollTimeoutRefs = useRef({});
  const sectionScrollerRefs = useRef({});
  const videoRefs = useRef({});
  const consumedLocationKeyRef = useRef(null);
  const [activeRootIndex, setActiveRootIndex] = useState(0);
  const [activeSectionKeyByRootId, setActiveSectionKeyByRootId] = useState({});
  const [activeVideoIndexBySectionId, setActiveVideoIndexBySectionId] = useState({});
  const [pausedStates, setPausedStates] = useState({});
  const [likedStates, setLikedStates] = useState({ 'root-001-mindmap': true });
  const [starredStates, setStarredStates] = useState({});
  const [activeSheet, setActiveSheet] = useState(null);
  const [preview, setPreview] = useState(null);
  const [avatarLoadErrors, setAvatarLoadErrors] = useState({});

  const currentRoot = rootDataFeed[activeRootIndex];
  const currentSectionKey = getActiveSectionKey(currentRoot, activeSectionKeyByRootId);
  const currentSection = currentRoot.sections[currentSectionKey];
  const currentSectionStateKey = makeSectionStateKey(currentRoot.id, currentSectionKey);
  const currentVideoIndex = getActiveVideoIndex(
    activeVideoIndexBySectionId,
    currentSectionStateKey,
    currentSection.videos.length
  );
  const currentVideo = currentSection.videos[currentVideoIndex] ?? currentSection.videos[0];
  const currentVisibleVideoKey = currentVideo
    ? makeVideoRefKey(currentRoot.id, currentSectionKey, currentVideo.id)
    : '';

  const currentComments = currentSection.comments;
  const selectedSectionLabel = sectionTabs.find((tab) => tab.key === currentSectionKey)?.label;
  const currentSectionHasEpisodes = currentSection.videos.length > 1;
  const isEpisodeSheetOpen = activeSheet === 'episode' && currentSectionHasEpisodes;
  const isCommentSheetOpen = activeSheet === 'comment';
  const hasActiveSheet = isEpisodeSheetOpen || isCommentSheetOpen;
  const previewRoot = preview
    ? rootDataFeed.find((root) => root.id === preview.rootId)
    : null;
  const previewSection = previewRoot?.sections[preview?.sectionKey];
  const previewVideoIndex = previewSection
    ? clamp(preview?.videoIndex ?? 0, 0, Math.max(previewSection.videos.length - 1, 0))
    : 0;

  const visibleSectionKeys = useMemo(
    () =>
      rootDataFeed.map((root) => ({
        rootId: root.id,
        sectionKey: getActiveSectionKey(root, activeSectionKeyByRootId),
      })),
    [activeSectionKeyByRootId]
  );

  useEffect(() => {
    if (consumedLocationKeyRef.current === location.key) {
      return;
    }

    consumedLocationKeyRef.current = location.key;
    const routeTarget = resolveRouteStateTarget(location.state);

    if (!routeTarget) {
      return;
    }

    const sectionStateKey = makeSectionStateKey(routeTarget.rootId, routeTarget.sectionKey);

    setActiveRootIndex(routeTarget.rootIndex);
    setActiveSectionKeyByRootId((prev) => ({
      ...prev,
      [routeTarget.rootId]: routeTarget.sectionKey,
    }));
    setActiveVideoIndexBySectionId((prev) => ({
      ...prev,
      [sectionStateKey]: routeTarget.videoIndex,
    }));
    setPausedStates((prev) => ({
      ...prev,
      [sectionStateKey]: false,
    }));
    setActiveSheet(null);
  }, [location.key, location.state]);

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([key, video]) => {
      if (!video) {
        return;
      }

      const shouldPlay =
        !preview &&
        key === currentVisibleVideoKey &&
        !pausedStates[currentSectionStateKey];

      if (shouldPlay) {
        video
          .play()
          .catch(() => {
            setPausedStates((prev) => ({ ...prev, [currentSectionStateKey]: true }));
          });
      } else {
        video.pause();
      }
    });
  }, [currentSectionStateKey, currentVisibleVideoKey, pausedStates, preview]);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    scroller.scrollTo({
      top: activeRootIndex * scroller.clientHeight,
      behavior: 'smooth',
    });
  }, [activeRootIndex]);

  useEffect(() => {
    visibleSectionKeys.forEach(({ rootId, sectionKey }) => {
      const scroller = sectionScrollerRefs.current[rootId];
      const sectionIndex = sectionTabs.findIndex((tab) => tab.key === sectionKey);

      if (scroller && sectionIndex >= 0) {
        scroller.scrollTo({
          left: sectionIndex * scroller.clientWidth,
          behavior: 'smooth',
        });
      }
    });
  }, [visibleSectionKeys]);

  useEffect(() => {
    return () => {
      if (rootScrollTimeoutRef.current) {
        window.clearTimeout(rootScrollTimeoutRef.current);
      }
      Object.values(sectionScrollTimeoutRefs.current).forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  const handleOpenSearch = () => {
    navigate('/', {
      state: {
        openSearch: true,
        openSearchSource: 'player',
      },
    });
  };

  const handleRootScroll = () => {
    if (!scrollerRef.current) {
      return;
    }

    if (rootScrollTimeoutRef.current) {
      window.clearTimeout(rootScrollTimeoutRef.current);
    }

    rootScrollTimeoutRef.current = window.setTimeout(() => {
      const container = scrollerRef.current;
      const nextIndex = Math.round(container.scrollTop / container.clientHeight);
      const safeIndex = clamp(nextIndex, 0, rootDataFeed.length - 1);
      const nextRoot = rootDataFeed[safeIndex];
      const nextSectionKey = getActiveSectionKey(nextRoot, activeSectionKeyByRootId);

      setActiveRootIndex(safeIndex);
      setPausedStates((prev) => ({
        ...prev,
        [makeSectionStateKey(nextRoot.id, nextSectionKey)]: false,
      }));
    }, 100);
  };

  const handleSectionScroll = (root) => {
    const scroller = sectionScrollerRefs.current[root.id];
    if (!scroller) {
      return;
    }

    if (sectionScrollTimeoutRefs.current[root.id]) {
      window.clearTimeout(sectionScrollTimeoutRefs.current[root.id]);
    }

    sectionScrollTimeoutRefs.current[root.id] = window.setTimeout(() => {
      const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
      const safeIndex = clamp(nextIndex, 0, sectionTabs.length - 1);
      const nextSectionKey = sectionTabs[safeIndex].key;

      setActiveSectionKeyByRootId((prev) => ({
        ...prev,
        [root.id]: nextSectionKey,
      }));
      setPausedStates((prev) => ({
        ...prev,
        [makeSectionStateKey(root.id, nextSectionKey)]: false,
      }));
    }, 80);
  };

  const setSection = (root, sectionKey) => {
    setActiveSectionKeyByRootId((prev) => ({ ...prev, [root.id]: sectionKey }));
    setPausedStates((prev) => ({
      ...prev,
      [makeSectionStateKey(root.id, sectionKey)]: false,
    }));
  };

  const togglePlayback = (root, sectionKey) => {
    const sectionStateKey = makeSectionStateKey(root.id, sectionKey);
    setActiveRootIndex(rootDataFeed.findIndex((item) => item.id === root.id));
    setActiveSectionKeyByRootId((prev) => ({ ...prev, [root.id]: sectionKey }));
    setPausedStates((prev) => ({ ...prev, [sectionStateKey]: !prev[sectionStateKey] }));
  };

  const toggleLike = () => {
    setLikedStates((prev) => ({
      ...prev,
      [currentSectionStateKey]: !prev[currentSectionStateKey],
    }));
  };

  const toggleFavorite = () => {
    setStarredStates((prev) => ({
      ...prev,
      [currentSectionStateKey]: !prev[currentSectionStateKey],
    }));
  };

  const selectVideo = (videoIndex) => {
    setActiveVideoIndexBySectionId((prev) => ({
      ...prev,
      [currentSectionStateKey]: videoIndex,
    }));
    setPausedStates((prev) => ({ ...prev, [currentSectionStateKey]: false }));
    setActiveSheet(null);
  };

  const openPreview = (root, sectionKey, videoIndex) => {
    setActiveSheet(null);
    setPausedStates((prev) => ({
      ...prev,
      [makeSectionStateKey(root.id, sectionKey)]: true,
    }));
    setPreview({ rootId: root.id, sectionKey, videoIndex });
  };

  const closePreview = () => {
    if (preview) {
      setPausedStates((prev) => ({
        ...prev,
        [makeSectionStateKey(preview.rootId, preview.sectionKey)]: false,
      }));
    }
    setPreview(null);
  };

  const handleAvatarError = (key) => {
    setAvatarLoadErrors((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="page-shell player-page-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <main className="app-container">
        <div
          className="player-titlebar"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <button
            aria-label="返回首页"
            className="player-route-back"
            onClick={handleBack}
            type="button"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="section-tabs">
            {sectionTabs.map((tab) => (
              <button
                className={`section-tab ${tab.key === currentSectionKey ? 'active' : ''}`}
                key={tab.key}
                onClick={() => setSection(currentRoot, tab.key)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            aria-label="打开搜索页"
            className="player-route-search"
            onClick={handleOpenSearch}
            type="button"
          >
            <Search size={18} />
          </button>
        </div>
        {/* <div className="root-count-pill">
          根数据 {activeRootIndex + 1} / {rootDataFeed.length}
        </div> */}

        <div
          className="video-scroller"
          onScroll={handleRootScroll}
          ref={scrollerRef}
        >
          {rootDataFeed.map((root, rootIndex) => {
            const activeSectionKey = getActiveSectionKey(root, activeSectionKeyByRootId);

            return (
              <section className="video-slide" key={root.id}>
                <div
                  className="section-scroller"
                  onScroll={() => handleSectionScroll(root)}
                  ref={(node) => {
                    if (node) {
                      sectionScrollerRefs.current[root.id] = node;
                    }
                  }}
                >
                  {sectionTabs.map((tab) => {
                    const section = root.sections[tab.key];
                    const sectionStateKey = makeSectionStateKey(root.id, tab.key);
                    const videoIndex = getActiveVideoIndex(
                      activeVideoIndexBySectionId,
                      sectionStateKey,
                      section.videos.length
                    );
                    const video = section.videos[videoIndex] ?? section.videos[0];
                    const videoRefKey = makeVideoRefKey(root.id, tab.key, video.id);
                    const isPaused =
                      rootIndex === activeRootIndex &&
                      tab.key === activeSectionKey &&
                      pausedStates[sectionStateKey];

                    return (
                      <article
                        className="section-panel"
                        key={tab.key}
                        onClick={() => togglePlayback(root, tab.key)}
                      >
                        <video
                          className="video-player"
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          ref={(node) => {
                            if (node) {
                              videoRefs.current[videoRefKey] = node;
                            } else {
                              delete videoRefs.current[videoRefKey];
                            }
                          }}
                          src={video.source}
                        />

                        <div className="v-overlay" />

                        <div className={`play-status-hint ${isPaused ? 'show' : ''}`}>
                          <Play size={28} fill="white" color="white" />
                        </div>

                        <div className="video-meta">
                          <button
                            className="title-link"
                            onClick={(event) => {
                              event.stopPropagation();
                              openPreview(root, tab.key, videoIndex);
                            }}
                            type="button"
                          >
                            <span>{section.title}</span>
                            <ChevronRight size={16} strokeWidth={2.5} />
                          </button>

                          <div className="creator-row">
                            <span className="creator-name">@{root.creator}</span>
                          </div>

                          <p className="root-title">{root.title}</p>

                          {section.comments[0] ? (
                            <div
                              className="root-comment-preview"
                              onClick={(event) => {
                                event.stopPropagation();
                                setActiveRootIndex(rootIndex);
                                setActiveSectionKeyByRootId((prev) => ({
                                  ...prev,
                                  [root.id]: tab.key,
                                }));
                                setActiveSheet('comment');
                              }}
                            >
                              {section.comments[0].author}：{section.comments[0].content}
                            </div>
                          ) : null}

                          {section.videos.length > 1 ? (
                            <div
                              className="episode-badge"
                              onClick={(event) => {
                                event.stopPropagation();
                                setActiveSheet('episode');
                              }}
                            >
                              第 {videoIndex + 1} 个视频 / 共 {section.videos.length} 个
                              <ChevronRight
                                size={12}
                                strokeWidth={3}
                                style={{ transform: 'rotate(90deg)' }}
                              />
                            </div>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>

              </section>
            );
          })}
        </div>

        <div
          className="side-actions"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div className="side-avatar-wrap">
            <Avatar
              alt={currentRoot.creator}
              fallback={currentRoot.avatar}
              imageUrl={currentRoot.avatarUrl}
              imageErrorKey={`creator-${currentRoot.id}`}
              loadErrors={avatarLoadErrors}
              onError={handleAvatarError}
              type="creator"
            />
          </div>

          <ActionButton
            active={likedStates[currentSectionStateKey]}
            label={currentSection.stats.likes}
            onClick={toggleLike}
            title="点赞"
          >
            <Heart
              fill={likedStates[currentSectionStateKey] ? 'currentColor' : 'none'}
              size={28}
            />
          </ActionButton>

          <ActionButton
            label={currentSection.stats.comments}
            onClick={() => setActiveSheet('comment')}
            title="评论"
          >
            <MessageCircle size={28} />
          </ActionButton>

          <ActionButton
            activeStar={starredStates[currentSectionStateKey]}
            label={currentSection.stats.favorites}
            onClick={toggleFavorite}
            title="收藏"
          >
            <Star
              fill={starredStates[currentSectionStateKey] ? 'currentColor' : 'none'}
              size={28}
            />
          </ActionButton>

          <ActionButton label={currentSection.stats.shares} onClick={() => {}} title="分享">
            <TiArrowForward size={30} />
          </ActionButton>
        </div>

        <button
          aria-hidden={!hasActiveSheet}
          className={`overlay-mask ${hasActiveSheet ? 'active' : ''}`}
          onClick={() => setActiveSheet(null)}
          type="button"
        />

        <BottomSheet
          open={isEpisodeSheetOpen}
          title={`${selectedSectionLabel}视频 (${currentSection.videos.length})`}
          onClose={() => setActiveSheet(null)}
        >
          <div className="episode-list">
            {currentSection.videos.map((video, index) => (
              <button
                className={`video-choice ${index === currentVideoIndex ? 'active' : ''}`}
                key={video.id}
                onClick={() => selectVideo(index)}
                type="button"
              >
                <span className="video-choice-index">{index + 1}</span>
                <span className="video-choice-title">{video.title}</span>
                <span className="video-choice-duration">{video.duration}</span>
              </button>
            ))}
          </div>
        </BottomSheet>

        <BottomSheet
          open={isCommentSheetOpen}
          title={`评论 (${currentSection.stats.comments})`}
          onClose={() => setActiveSheet(null)}
        >
          <div className="comment-scroll">
            {currentComments.map((comment) => (
              <article className="comment-item" key={comment.id}>
                <Avatar
                  alt={comment.author}
                  fallback={comment.avatar}
                  imageUrl={comment.avatarUrl}
                  imageErrorKey={`comment-${comment.id}`}
                  loadErrors={avatarLoadErrors}
                  onError={handleAvatarError}
                  type="comment"
                />
                <div className="comment-body">
                  <div className="comment-author">{comment.author}</div>
                  <div className="comment-content">{comment.content}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="comment-input-bar">
            <input className="comment-input" placeholder="发表评论..." type="text" />
          </div>
        </BottomSheet>

        {previewRoot && previewSection ? (
          <ContentPreviewPage
            onClose={closePreview}
            section={previewSection}
            sectionKey={preview.sectionKey}
            videoIndex={previewVideoIndex}
            showFloatingEdit={false}
          />
        ) : null}
      </main>
    </div>
  );
}

function getActiveSectionKey(root, activeSectionKeyByRootId) {
  return activeSectionKeyByRootId[root.id] ?? 'lecture';
}

function getActiveVideoIndex(activeVideoIndexBySectionId, sectionStateKey, total) {
  return clamp(activeVideoIndexBySectionId[sectionStateKey] ?? 0, 0, Math.max(total - 1, 0));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function Avatar({
  alt,
  fallback,
  imageErrorKey,
  imageUrl,
  loadErrors,
  onError,
  type,
}) {
  const className = type === 'comment' ? 'comment-avatar' : 'creator-avatar';
  const hasError = loadErrors[imageErrorKey];

  return (
    <div className={className}>
      <span className="avatar-fallback">{fallback}</span>
      {!hasError ? (
        <img
          alt={alt}
          className="avatar-image"
          onError={() => onError(imageErrorKey)}
          src={imageUrl}
        />
      ) : null}
    </div>
  );
}

function ActionButton({
  active = false,
  activeStar = false,
  children,
  label,
  onClick,
  title,
}) {
  return (
    <button
      aria-label={title}
      className={`action-item ${active ? 'active' : ''} ${activeStar ? 'active-star' : ''}`}
      onClick={onClick}
      type="button"
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

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
