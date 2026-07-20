import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Users, 
  Shield, 
  Skull, 
  Zap, 
  Search, 
  ArrowDown, 
  Sparkles, 
  Crosshair, 
  Award,
  AlertTriangle,
  Building2,
  Sword,
  Info
} from 'lucide-react';

interface Character {
  id: string;
  name: string;
  type: 'mage' | 'magician' | 'other';
  circleOrGrade: string; 
  gender: '여' | '남';
  personality: string[];
  speech: string[];
  features: string[];
  imageUrl: string;
}

const WORLDVIEW = {
  era: "그레이트홀이 열리고 한번 멸망한 문명. 잔존 인류가 관리국을 세워 그레이트홀 주변을 통제하며 마물을 퇴치 중이다. 전체적인 배경은 재건되는 폐허 도시이며, 21세기 수준의 문명을 이룩하고 있다.",
  history: "그레이트홀이 터진 지 현재 20년이 흐른 상황. 그레이트홀이 열리고 그로부터 흘러나온 마력으로 인해 일부 사람들이 마법사로 각성해 싸우기 시작했다. 마법사들은 극히 귀했고 화력에만 치중되어 놓치는 마물이 많았기에, 이를 보완하고자 탄생한 이들이 바로 마술사들이다.",
  greatHall: {
    title: "그레이트홀 (Great Hall)",
    desc: "바다 한가운데에 뚫린 거대한 검은 구멍. 이 안으로 들어간 이들 중 지금까지 단 한 명도 생환하지 못했다. 마물을 주기적으로 토해내며 세상을 멸망시킨 원흉이다."
  },
  monster: {
    title: "마물 (Monsters)",
    desc: "그레이트홀에서 나오는 괴물들로, 종류는 DND(Dungeons & Dragons) 시리즈의 몬스터 구성을 따른다. 처치 시 마석을 떨어뜨리며, 이 마석은 장비나 다양한 기술들의 핵심 소재로 유용하게 쓰인다."
  },
  bureau: {
    title: "관리국 (Bureau of Control)",
    desc: "마법사와 마술사를 총괄적으로 관리하고, 마물로부터 획득한 소재를 효율적으로 분배하는 기관. 과거에는 마법사 우대 정책을 펼쳤으나, 마술사를 지원 및 우대하는 쪽의 성과가 더 확실함이 증명되면서 현재는 평등한 정책을 고수하고 있다.",
    details: [
      "매년 신규 기수를 소집해 마술사와 마법사 지원을 받음.",
      "마력 검사에서 양성이 뜨면 마법사로, 음성이 뜨면 마술사로 갈지 선택이 가능하다. (마술사 과정은 훈련이 매우 혹독하여 음성이 떠도 자원하지 않는 이들이 많음)",
      "현 관리국장은 9서클 시간 마법사이기에, 전사자의 시체만 신속히 들고 오면 즉각 부활이 가능하다. 이 때문에 내부에서는 죽음을 임무 실패 정도로 여기며 가볍게 인식하는 경향이 있다.",
      "매주 일요일마다 정기 성과 보고 회의를 개최한다."
    ]
  }
};

const CLASSES_INFO = {
  magician: {
    title: "마술사 (Magician)",
    sub: "인류의 수호자이자 전술가",
    characteristics: [
      { label: "정의", val: "마법사가 아닌 순수한 인간으로, 마력석으로 만든 장비와 혹독한 전술 훈련을 통해 마물에 맞서는 자들." },
      { label: "전투 역량", val: "마법사 수준의 압도적인 파괴력은 없으나, 극도로 섬세한 임무 수행 능력과 일대일 대인전에서 압도적인 역량을 발휘함." },
      { label: "대중적 인식", val: "주로 민간인 보호 및 인명 구출의 최전선에 서기 때문에 대중들 사이에서 평판이 매우 좋음." },
      { label: "사망률 & 지원", val: "훈련 과정이 상상을 초월할 정도로 혹독하며, 실전 임무 중 사망 비율이 마법사에 비해 압도적으로 높아 지원자 수가 현저히 적음." },
      { label: "제식 복장", val: "검은색 정장을 기본 제식 복장으로 채택하고 있으나, 개인의 기호에 따른 커스텀이 폭넓게 허용되는 사실상의 자유 복장." },
      { label: "등급 체계", val: "하급, 중급, 상급으로 구분됨. 상급은 극소수에 불과하며, 대다수는 중급이다. 하급은 교육 중인 신입 단계이며 중급만 되어도 단독 임무 수행 가능." },
      { label: "거주 환경", val: "자유분방하고 투박한 분위기의 거처. 주로 창고를 개조하여 실용적으로 다듬은 건물로, 유용한 전술 정보가 곳곳에 기록되어 있음." },
      { label: "마법사에 대한 인식", val: "자신들에게 직접적인 피해나 마찰만 주지 않는다면 딱히 신경 쓰거나 관여하지 않는 방관적 인식이 주류를 이룸." }
    ]
  },
  mage: {
    title: "마법사 (Mage)",
    sub: "걸어다니는 인간 전략 병기",
    characteristics: [
      { label: "정의", val: "마력과 감응할 수 있는 특이 체질인 자들이 그레이트홀의 마력 영향으로 각성한 이들. '서클'로 수준을 엄격히 구분함." },
      { label: "전투 역량", val: "평균 3서클 수준. 3서클만 되어도 미사일급 화력을 뿜어내는 인간 전략 병기이다. 1서클은 희귀하며 기본 화력은 권총 한 발 수준." },
      { label: "대중적 인식", val: "마법의 정밀함이 떨어져 민간인 피해를 자주 내며, 대중들에게 직접 와닿는 일을 하지 않아 대외적 평판 및 인식이 나쁨." },
      { label: "집단 성향", val: "내부적으로는 매우 돈독하고 화목하나 외부인에게는 얼음처럼 차가운, 극도로 폐쇄적이고 오만한 선민사상 집단." },
      { label: "제식 복장", val: "품위와 권위를 상징하는 검은색 로브를 착용. 실전성보다는 허례허식과 시각적 권위를 극도로 중시함." },
      { label: "상성 (천적)", val: "마법의 규모가 클수록 캐스팅(시전) 시간이 기하급수적으로 길어진다. 빈틈을 단숨에 찌르는 마술사들에게 절대 이길 수 없는 상성 관계." },
      { label: "마술사에 대한 인식", val: "자신들의 캐스팅 빈틈을 완벽하게 간파하고 제압할 수 있는 마술사들을 본능적으로 두려워하며, 공포의 대상으로 인식함." },
      { label: "거주 환경", val: "학술적이고 엄격한 위계질서가 지배하는 탑 형태의 거대 건축물, 일명 '마탑'에서 모여 생활함." },
      { label: "마력 제어", val: "마력은 출력이 약할수록 섬세하게 제어하기 쉬우나, 대부분의 마법사들이 강한 출력과 거대한 화력만을 숭상하여 이 사실을 철저히 무시함." }
    ]
  }
};

const CHARACTERS: Character[] = [
  {
    id: "chelsea",
    name: "첼시",
    type: "mage",
    circleOrGrade: "5서클마법사",
    gender: "여",
    personality: ["나른", "졸림", "호기심"],
    speech: ["나른한 단답형 말투", "응석받이"],
    features: ["환영마법사", "마법천재"],
    imageUrl: "https://mul3.uk/mg/a/1.webp"
  },
  {
    id: "selby",
    name: "셀비",
    type: "mage",
    circleOrGrade: "3서클마법사",
    gender: "여",
    personality: ["까칠", "질투", "겁쟁이"],
    speech: ["고압적이고 까칠한 말투", "자기혐오"],
    features: ["불꽃마법사", "자신이 평범하다는 거 인정 못함"],
    imageUrl: "https://mul3.uk/mg/b/1.webp"
  },
  {
    id: "main",
    name: "메인",
    type: "mage",
    circleOrGrade: "6서클마법사",
    gender: "여",
    personality: ["중2병", "4차원", "소심"],
    speech: ["중2병 말투", "화력덕후"],
    features: ["폭발마법사", "한번 화력에 모든 거 쏟아부음", "인간전략병기"],
    imageUrl: "https://mul3.uk/mg/c/1.webp"
  },
  {
    id: "fina",
    name: "피나",
    type: "mage",
    circleOrGrade: "6서클마법사",
    gender: "여",
    personality: ["소심", "음침", "대인기피"],
    speech: ["더듬는 소심한 말투", "자기비하"],
    features: ["어둠마법사", "천재", "소심"],
    imageUrl: "https://mul3.uk/mg/d/1.webp"
  },
  {
    id: "ave",
    name: "에이브",
    type: "mage",
    circleOrGrade: "8서클마법사",
    gender: "남",
    personality: ["엄격", "근엄", "진지"],
    speech: ["고풍스럽지만 꼰대말투", "마법사들을 골칫덩이로 여김"],
    features: ["공간마법사", "능력있는 꼰대"],
    imageUrl: "https://mul3.uk/mg/e/1.webp"
  },
  {
    id: "nera",
    name: "네라",
    type: "mage",
    circleOrGrade: "5서클마법사",
    gender: "여",
    personality: ["장난기", "악동", "메스가키"],
    speech: ["메스가키 말투", "강약약강"],
    features: ["바람마법사", "강약약강", "마술사 공포증"],
    imageUrl: "https://mul3.uk/mg/f/1.webp"
  },
  {
    id: "matique",
    name: "마티크",
    type: "mage",
    circleOrGrade: "4서클마법사",
    gender: "남",
    personality: ["무뚝뚝", "계산적", "기계적"],
    speech: ["기계적이고 분석적인 말투", "무뚝뚝"],
    features: ["강철마법사", "민간인 피해 제로"],
    imageUrl: "https://mul3.uk/mg/g/1.webp"
  },
  {
    id: "arus",
    name: "아르스",
    type: "mage",
    circleOrGrade: "4서클마법사",
    gender: "남",
    personality: ["광기", "기품", "예술"],
    speech: ["과장된 오페라 말투", "예술찬미"],
    features: ["물마법사", "마술사 찬양가"],
    imageUrl: "https://mul3.uk/mg/h/1.webp"
  },
  {
    id: "z",
    name: "제트",
    type: "magician",
    circleOrGrade: "상급마술사",
    gender: "남",
    personality: ["유쾌", "능글", "신비주의"],
    speech: ["능글맞고 친근한 말투", "최강의 마술사"],
    features: ["주무기와이어", "신비주의"],
    imageUrl: "https://mul3.uk/mg/i/1.webp"
  },
  {
    id: "rain",
    name: "레인",
    type: "magician",
    circleOrGrade: "중급마술사",
    gender: "여",
    personality: ["무뚝뚝", "까칠", "애정결핍"],
    speech: ["무뚝뚝하고 가시돋친 말투", "마법사 혐오"],
    features: ["주무기드론", "마법사에게 동생 잃음"],
    imageUrl: "https://mul3.uk/mg/j/1.webp"
  },
  {
    id: "haru",
    name: "하루",
    type: "magician",
    circleOrGrade: "중급마술사",
    gender: "여",
    personality: ["소심", "멘헤라", "자기비하"],
    speech: ["소심한 멘헤라 말투", "자신을 3인칭으로 칭함"],
    features: ["주무기너클", "힘이 셈"],
    imageUrl: "https://mul3.uk/mg/k/1.webp"
  },
  {
    id: "paya",
    name: "파야",
    type: "magician",
    circleOrGrade: "중급마술사",
    gender: "여",
    personality: ["시니컬", "마이페이스", "장난기"],
    speech: ["용건만 말하는 시니컬한 말투", "장난꾸러기"],
    features: ["주무기카타나", "파에의 언니", "동생 아낌"],
    imageUrl: "https://mul3.uk/mg/l/1.webp"
  },
  {
    id: "pae",
    name: "파에",
    type: "magician",
    circleOrGrade: "중급마술사",
    gender: "여",
    personality: ["시니컬", "마이페이스", "장난기"],
    speech: ["용건만 말하는 시니컬한 말투", "장난꾸러기"],
    features: ["주무기저격소총", "파야의 동생", "언니 아낌"],
    imageUrl: "https://mul3.uk/mg/m/1.webp"
  },
  {
    id: "jiki",
    name: "지키",
    type: "magician",
    circleOrGrade: "중급마술사",
    gender: "여",
    personality: ["소심", "이중인격", "광기"],
    speech: ["소심하고 주눅든 말투", "인격 변하면 광기에 찬 말투"],
    features: ["주무기는 맨손무투파", "소심한 인격과 흉포한 인격 공존"],
    imageUrl: "https://mul3.uk/mg/m/1.webp"
  },
  {
    id: "ethan",
    name: "에단",
    type: "magician",
    circleOrGrade: "중급마술사",
    gender: "남",
    personality: ["정중함", "친절", "온화"],
    speech: ["친절하지만 뭔가 수상한 말투", "착한 사람 맞는데 오해받는 것"],
    features: ["주무기는 저격소총", "여러모로 수상한 분위기", "착한 사람 맞음"],
    imageUrl: "https://mul3.uk/mg/o/1.webp"
  },
  {
    id: "habeck",
    name: "하벡",
    type: "magician",
    circleOrGrade: "상급마술사",
    gender: "남",
    personality: ["능글", "귀차니즘", "나른"],
    speech: ["나른하고 귀차니즘 가득한 말투", "일할 때는 함"],
    features: ["주무기롱소드", "귀차니즘 가득해도 일할 때는 함"],
    imageUrl: "https://mul3.uk/mg/p/1.webp"
  },
  {
    id: "setsuna",
    name: "세츠나",
    type: "other",
    circleOrGrade: "9서클마법사",
    gender: "여",
    personality: ["정중", "온화", "스트레스"],
    speech: ["정중하고 격식있는 말투", "마법사와 마술사들 싸우는 게 스트레스"],
    features: ["최강의 마법사", "관리국장"],
    imageUrl: "https://mul3.uk/mg/q/1.webp"
  },
  {
    id: "towa",
    name: "토와",
    type: "other",
    circleOrGrade: "상급마술사",
    gender: "여",
    personality: ["무뚝뚝", "격식", "오타쿠"],
    speech: ["무뚝뚝하고 정중한 말투", "속내는 엄청난 세츠나 덕후"],
    features: ["모든 무기 잘 다룸", "국장의 열혈팬", "국장 비서"],
    imageUrl: "https://mul3.uk/mg/r/1.webp"
  }
];

export default function App() {
  const [activeSection, setActiveSection] = useState('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'mage' | 'magician' | 'other'>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 300;
      const sections = ['intro', 'worldview', 'classes', 'characters'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredCharacters = CHARACTERS.filter(char => {
    const matchesType = selectedType === 'all' || char.type === selectedType;
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          char.circleOrGrade.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          char.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          char.personality.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-blue-900 selection:text-white">
      {/* Background Grid Accent */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#080815_1px,transparent_1px),linear-gradient(to_bottom,#080815_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      
      {/* Floating Top Header */}
      <header className="sticky top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-blue-950/50 py-3 px-4 md:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-950 border border-blue-800 flex items-center justify-center shadow-[0_0_10px_rgba(30,58,138,0.5)] shrink-0">
            <span className="font-display font-extrabold text-blue-400 text-sm">G.H</span>
          </div>
          <div>
            <h1 className="text-sm font-display font-bold tracking-widest text-zinc-100">GREAT HOLE CONTROL BUREAU</h1>
            <p className="text-[10px] font-mono text-blue-500/80 tracking-tight uppercase">Database Directory v1.0.26</p>
          </div>
        </div>

        {/* Fully Responsive Premium Navigation Menu */}
        <nav className="flex items-center gap-1 bg-zinc-950/80 border border-blue-950/60 p-1 rounded-lg w-full sm:w-auto overflow-x-auto scrollbar-none justify-between sm:justify-start">
          {[
            { id: 'intro', label: 'INDEX', icon: Sparkles },
            { id: 'worldview', label: 'WORLD', icon: Compass },
            { id: 'classes', label: 'CLASSES', icon: Shield },
            { id: 'characters', label: 'CHARACTERS', icon: Users }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all duration-300 text-[11px] font-display font-bold tracking-wider shrink-0 ${
                  isActive 
                    ? 'bg-blue-950/50 text-blue-400 border border-blue-900/40 shadow-[0_0_10px_rgba(30,58,138,0.2)]' 
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </header>

      {/* Main Content Space */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-24">
        
        {/* SECTION 0: INTRO HERO */}
        <section id="intro" className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 md:py-20 border-b border-blue-950/30">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/30 border border-blue-900/40 text-blue-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              보안 등급 2급 // 기밀 해제 아카이브
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-400 leading-tight">
              그레이트홀 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">관리국 아카이브</span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg max-w-3xl leading-relaxed font-sans">
              바다 한가운데 뚫린 거대한 검은 구멍, <span className="text-blue-400 font-medium">그레이트홀</span>. 
              그리고 그로부터 촉발된 인류 문명의 붕괴와 재건. 
              관리국의 정식 승인을 거친 마법사와 마술사의 세부 정보 및 통합 세계관 자료실입니다.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href="#worldview" 
                className="px-6 py-3 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-800/80 rounded-lg text-sm font-display tracking-widest text-blue-300 transition-all duration-300 hover:shadow-[0_0_15px_rgba(30,58,138,0.4)] flex items-center gap-2 group"
              >
                세계관 기록소 
                <ArrowDown className="w-4 h-4 text-blue-400 group-hover:translate-y-1 transition-transform" />
              </a>
              <a 
                href="#characters" 
                className="px-6 py-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-display tracking-widest text-zinc-300 transition-all duration-300 hover:border-blue-950 flex items-center gap-2"
              >
                소속 인물 도감
              </a>
            </div>
          </motion.div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl pt-8 border-t border-blue-950/40">
            <div className="p-4 rounded-lg bg-zinc-950/40 border border-blue-950/40">
              <div className="text-xs font-mono text-blue-500 uppercase">Current Era</div>
              <div className="text-xl font-display font-bold text-zinc-100 mt-1">G.H. Year 20</div>
            </div>
            <div className="p-4 rounded-lg bg-zinc-950/40 border border-blue-950/40">
              <div className="text-xs font-mono text-blue-500 uppercase">Mages Limit</div>
              <div className="text-xl font-display font-bold text-zinc-100 mt-1">9 Circles Max</div>
            </div>
            <div className="p-4 rounded-lg bg-zinc-950/40 border border-blue-950/40">
              <div className="text-xs font-mono text-blue-500 uppercase">Magician Gear</div>
              <div className="text-xl font-display font-bold text-zinc-100 mt-1">Mana Core Steel</div>
            </div>
            <div className="p-4 rounded-lg bg-zinc-950/40 border border-blue-950/40">
              <div className="text-xs font-mono text-blue-500 uppercase">Director Status</div>
              <div className="text-xl font-display font-bold text-zinc-100 mt-1">9 Circle Time</div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WORLDVIEW */}
        <section id="worldview" className="py-24 border-b border-blue-950/30 scroll-mt-12">
          <div className="flex items-center gap-3 mb-4">
            <Compass className="w-6 h-6 text-blue-500" />
            <span className="text-sm font-display font-bold tracking-widest text-blue-500 uppercase">SECTION 01</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-zinc-100 mb-8 border-b border-blue-950/40 pb-4">
            통합 세계관 기록소 <span className="text-blue-500 font-mono text-lg">/ Worldview Archive</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-xl bg-zinc-950/80 border border-blue-950 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-blue-900/60 transition-all duration-300">
                <h3 className="text-lg font-display font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-500">시대상</span>
                  재건되는 폐허 도시의 문명
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed font-sans">{WORLDVIEW.era}</p>
              </div>

              <div className="p-6 rounded-xl bg-zinc-950/80 border border-blue-950 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-blue-900/60 transition-all duration-300">
                <h3 className="text-lg font-display font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-500">역사</span>
                  재난 20년의 전말과 각성
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed font-sans">{WORLDVIEW.history}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-zinc-950/90 border border-blue-950 hover:border-red-950/60 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-display font-bold text-zinc-200 text-sm tracking-wider flex items-center gap-2">
                      <Skull className="w-4 h-4 text-zinc-500 group-hover:text-red-500 transition-colors" />
                      {WORLDVIEW.greatHall.title}
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">{WORLDVIEW.greatHall.desc}</p>
                </div>

                <div className="p-5 rounded-xl bg-zinc-950/90 border border-blue-950 hover:border-blue-900/60 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-display font-bold text-zinc-200 text-sm tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-blue-600" />
                      {WORLDVIEW.monster.title}
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">{WORLDVIEW.monster.desc}</p>
                </div>
              </div>
            </div>

            {/* Bureau of Control */}
            <div className="lg:col-span-5">
              <div className="h-full p-6 rounded-xl bg-zinc-950/90 border border-blue-900/40 shadow-[0_0_20px_rgba(30,58,138,0.1)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-display font-black text-blue-300 tracking-wider">{WORLDVIEW.bureau.title}</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">{WORLDVIEW.bureau.desc}</p>

                  <div className="space-y-4">
                    {WORLDVIEW.bureau.details.map((detail, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <span className="font-mono text-xs text-blue-500 mt-0.5">0{index + 1}</span>
                        <p className="text-xs text-zinc-300 leading-relaxed font-sans">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-blue-950/50 flex items-center justify-between text-[11px] font-mono text-blue-500">
                  <span>OFFICIAL BUREAU LOG</span>
                  <span>SYSTEM_LIVE_ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: CLASSES */}
        <section id="classes" className="py-24 border-b border-blue-950/30 scroll-mt-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-500" />
            <span className="text-sm font-display font-bold tracking-widest text-blue-500 uppercase">SECTION 02</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-zinc-100 mb-3 border-b border-blue-950/40 pb-4">
            클래스 분석 체계 <span className="text-blue-500 font-mono text-lg">/ Class Comparison</span>
          </h2>
          <p className="text-zinc-400 text-sm mb-12 max-w-3xl">
            그레이트홀 폭발 이후 두 갈래로 나뉜 인류의 생존 투사들. 
            극단적인 화력의 마법사들과 그 빈틈을 메우는 전술적인 마술사들의 성질을 대조 정리한 군사 기밀 문서입니다.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-black border border-blue-900 shadow-[0_0_15px_rgba(30,58,138,0.4)] z-20 font-display font-bold text-xs tracking-widest text-blue-400">
              VS
            </div>

            {/* Class Magician */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-blue-950/80 hover:border-blue-900 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-display font-extrabold text-blue-400 tracking-wider">{CLASSES_INFO.magician.title}</h3>
                  <p className="text-xs text-zinc-500 font-sans mt-0.5">{CLASSES_INFO.magician.sub}</p>
                </div>
                <Sword className="w-8 h-8 text-blue-900/60" />
              </div>

              <div className="divide-y divide-blue-950/40">
                {CLASSES_INFO.magician.characteristics.map((item, idx) => (
                  <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="w-full sm:w-28 text-xs font-display text-blue-500 font-semibold tracking-wide shrink-0">[{item.label}]</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Mage */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-blue-950/80 hover:border-blue-900 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-display font-extrabold text-zinc-200 tracking-wider">{CLASSES_INFO.mage.title}</h3>
                  <p className="text-xs text-zinc-500 font-sans mt-0.5">{CLASSES_INFO.mage.sub}</p>
                </div>
                <Zap className="w-8 h-8 text-blue-900/60" />
              </div>

              <div className="divide-y divide-blue-950/40">
                {CLASSES_INFO.mage.characteristics.map((item, idx) => (
                  <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="w-full sm:w-28 text-xs font-display text-zinc-400 font-semibold tracking-wide shrink-0">[{item.label}]</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 p-5 rounded-xl bg-blue-950/10 border border-blue-900/40 shadow-[0_0_15px_rgba(30,58,138,0.05)]">
            <h4 className="text-sm font-display font-bold text-blue-400 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              핵심 전술 극상성 분석 (Operational Superiority)
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              마법은 강력하지만 시전 규모가 커질수록 긴 캐스팅 시간이 필요하다. 
              마술사들은 마법사들이 가진 바로 이 치명적인 빈틈을 빠르게 찌를 수 있도록 철저히 훈련되었기에, 
              <strong> 1대1 대인전 상황에서는 마법사들이 마술사들을 절대로 이길 수 없다.</strong> 
              이러한 압도적인 한계로 인해 대외적으로 기품을 떠는 마법사 집단 내부에서도 마술사들은 직관적인 공포의 대상으로 통한다.
            </p>
          </div>
        </section>

        {/* SECTION 3: CHARACTERS */}
        <section id="characters" className="py-24 scroll-mt-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-500" />
            <span className="text-sm font-display font-bold tracking-widest text-blue-500 uppercase">SECTION 03</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-zinc-100 mb-3 border-b border-blue-950/40 pb-4">
            관리국 등록 소속 인물 도감 <span className="text-blue-500 font-mono text-lg">/ Personnel Database</span>
          </h2>
          <p className="text-zinc-400 text-sm mb-12 max-w-3xl">
            현재 그레이트홀 통제구역 내에서 활약 중인 인원들의 공인 프로필 정보 리스트입니다.
          </p>

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 p-4 bg-zinc-950/80 rounded-xl border border-blue-950/60">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {[
                { type: 'all', label: '전체' },
                { type: 'mage', label: '마법사' },
                { type: 'magician', label: '마술사' },
                { type: 'other', label: '기타' }
              ].map((tab) => (
                <button
                  key={tab.type}
                  onClick={() => {
                    setSelectedType(tab.type as any);
                    setSelectedCharacter(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-display tracking-wider transition-all duration-300 border ${
                    selectedType === tab.type 
                      ? 'bg-blue-950/60 text-blue-400 border-blue-900 shadow-[0_0_10px_rgba(30,58,138,0.2)]'
                      : 'bg-zinc-900/40 text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-900" />
              <input 
                type="text" 
                placeholder="인물명, 능력, 성격 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/40 border border-blue-950/50 rounded-lg py-2 pl-9 pr-4 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCharacters.map((char) => {
                const isSelected = selectedCharacter?.id === char.id;
                return (
                  <motion.div
                    key={char.id}
                    layoutId={`card-${char.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedCharacter(char)}
                    className={`rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden group border flex flex-col ${
                      isSelected 
                        ? 'bg-zinc-950 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                        : 'bg-zinc-950/90 border-blue-950 hover:border-blue-900/60'
                    }`}
                  >
                    {/* Character Dossier Portrait */}
                    <div className="relative h-44 w-full bg-zinc-950 overflow-hidden border-b border-blue-950/60">
                      {/* Scanline pattern, noise, and crosshairs */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10 opacity-30" />
                      <div className="absolute top-2 left-2 text-[8px] font-mono text-blue-400/80 tracking-wider bg-black/80 px-1.5 py-0.5 rounded border border-blue-950/60 z-10">
                        SYS.REC // {char.id.toUpperCase()}
                      </div>
                      <div className="absolute top-2 right-2 text-[8px] font-mono text-zinc-500 bg-black/80 px-1.5 py-0.5 rounded border border-zinc-900 z-10 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        ACTIVE
                      </div>
                      <img 
                        src={char.imageUrl} 
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent pointer-events-none z-10" />
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-display font-black text-zinc-100 tracking-wide">{char.name}</h3>
                              <span className="text-[10px] text-zinc-500">[{char.gender}]</span>
                            </div>
                            
                            <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/40 border border-blue-900/30 text-blue-400 text-[10px] font-mono">
                              {char.type === 'mage' && <Sparkles className="w-3 h-3 text-purple-400" />}
                              {char.type === 'magician' && <Crosshair className="w-3 h-3 text-blue-400" />}
                              {char.type === 'other' && <Award className="w-3 h-3 text-yellow-400" />}
                              {char.circleOrGrade}
                            </div>
                          </div>

                          <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded border ${
                            char.type === 'mage' 
                              ? 'border-purple-950/60 text-purple-400' 
                              : char.type === 'magician' 
                                ? 'border-blue-950 text-blue-400' 
                                : 'border-yellow-950 text-yellow-400'
                          }`}>
                            {char.type === 'mage' ? 'Mage' : char.type === 'magician' ? 'Tactical' : 'Bureau'}
                          </span>
                        </div>

                        <div className="space-y-3 pt-2">
                          <div>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">성격 설정</span>
                            <div className="flex flex-wrap gap-1.5">
                              {char.personality.map((p, idx) => (
                                <span key={idx} className="px-2 py-0.5 text-[10px] rounded bg-zinc-900 border border-blue-950 text-zinc-300 font-sans">{p}</span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">말투 & 인물 특징</span>
                            <div className="flex flex-wrap gap-1.5">
                              {char.speech.map((s, idx) => (
                                <span key={idx} className="px-2 py-0.5 text-[10px] rounded bg-zinc-900/60 border border-blue-950/40 text-blue-300/90 font-sans">{s}</span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-blue-950/30">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">분야 / 주무기 / 고유 특성</span>
                            <div className="flex flex-wrap gap-1">
                              {char.features.map((f, idx) => (
                                <span key={idx} className="text-xs font-medium text-zinc-200">■ {f}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-blue-950/30 flex justify-end">
                        <span className="text-[9px] font-mono text-blue-600 tracking-widest uppercase group-hover:text-blue-400 transition-colors">
                          Click to view file // ▶
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Details Modal */}
          <AnimatePresence>
            {selectedCharacter && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-zinc-950 border border-blue-900 rounded-xl max-w-2xl w-full p-6 shadow-[0_0_30px_rgba(30,58,138,0.3)] relative"
                >
                  <button 
                    onClick={() => setSelectedCharacter(null)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100 font-mono text-lg p-1 z-10"
                  >
                    ✕
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Column: Portrait */}
                    <div className="md:col-span-5 flex flex-col gap-3">
                      <div className="relative aspect-[3/4] w-full bg-zinc-950 rounded-lg overflow-hidden border border-blue-900/40 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        {/* Technical lines & crosshairs on image */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10 opacity-30" />
                        <div className="absolute bottom-2 left-2 text-[8px] font-mono text-blue-400/80 tracking-wider bg-black/80 px-1.5 py-0.5 rounded border border-blue-950/60 z-10">
                          FILE_CODE: {selectedCharacter.id.toUpperCase()}
                        </div>
                        <img 
                          src={selectedCharacter.imageUrl} 
                          alt={selectedCharacter.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-900/60 border border-blue-950/40 text-[10px] font-mono text-zinc-400 leading-relaxed">
                        <span className="text-blue-400 block mb-1">■ BIOMETRIC DATA</span>
                        GENDER: {selectedCharacter.gender === '여' ? 'FEMALE' : 'MALE'}<br />
                        CLEARANCE: LEVEL_02_RESTRICTED<br />
                        REGISTRY: GREAT_HOLE_REG_{selectedCharacter.id.toUpperCase()}
                      </div>
                    </div>

                    {/* Right Column: Profile Info */}
                    <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                            selectedCharacter.type === 'mage' 
                              ? 'border-purple-950 bg-purple-950/30 text-purple-400' 
                              : selectedCharacter.type === 'magician' 
                                ? 'border-blue-950 bg-blue-950/30 text-blue-400' 
                                : 'border-yellow-950 bg-yellow-950/30 text-yellow-400'
                          }`}>
                            {selectedCharacter.type === 'mage' ? '마법사' : selectedCharacter.type === 'magician' ? '마술사' : '관리국'}
                          </span>
                          <span className="text-xs text-zinc-600 font-mono">Profile Code: #{selectedCharacter.id.toUpperCase()}</span>
                        </div>

                        <h3 className="text-3xl font-display font-black text-zinc-100 mb-4 border-b border-blue-950/50 pb-2">
                          {selectedCharacter.name}
                          <span className="text-sm text-zinc-400 font-mono font-normal ml-3">({selectedCharacter.gender})</span>
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">소속 및 능력 서클/등급</span>
                            <div className="text-sm font-semibold text-blue-400 font-sans">{selectedCharacter.circleOrGrade}</div>
                          </div>

                          <div>
                            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">정신 감정 상태 [성격]</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedCharacter.personality.map((p, idx) => (
                                <span key={idx} className="px-2.5 py-1 text-xs rounded bg-zinc-900 border border-blue-950 text-zinc-300">{p}</span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">행동 양식 및 주요 말투</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedCharacter.speech.map((s, idx) => (
                                <span key={idx} className="px-2.5 py-1 text-xs rounded bg-blue-950/30 border border-blue-900/30 text-blue-300">{s}</span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-blue-950/40">
                            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">주요 기술 특성 / 전술 무기</span>
                            <div className="space-y-1">
                              {selectedCharacter.features.map((f, idx) => (
                                <div key={idx} className="text-sm font-medium text-zinc-100 flex items-start gap-2">
                                  <span className="text-blue-500">■</span>
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-blue-950/50 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-zinc-600">STATE: CONFIRMED</span>
                        <button 
                          onClick={() => setSelectedCharacter(null)}
                          className="px-4 py-2 rounded bg-blue-950 text-blue-300 text-xs font-display hover:bg-blue-900 hover:text-white transition-colors border border-blue-900/60"
                        >
                          프로필 닫기
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer className="w-full bg-black py-12 px-6 lg:pl-32 border-t border-blue-950/50 relative z-10">
        <div className="max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span className="text-xs font-display font-bold tracking-widest text-zinc-400">GREAT HOLE MONITORING SYSTEM</span>
            </div>
            <p className="text-[10px] font-mono text-zinc-600 max-w-md">
              본 시스템은 그레이트홀 내부 관측 자료와 관리국의 정식 자료를 토대로 실시간 동기화됩니다. 임의 정보 복제 및 외부 유출을 엄금합니다.
            </p>
          </div>
          <div className="text-right text-[10px] font-mono text-blue-900">
            <p>DESIGN THEME: BLACK & DEEP BLUE BORDERS</p>
            <p className="mt-1">© 2026 GREAT HOLE BUREAU. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
