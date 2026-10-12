import { EXTRA_TOPICS } from './pathologyLessons'

export interface LearnCard {
  id: string
  title: string
  body: string
  points: string[]
  related: number[]
}

export interface LearnTopic {
  id: string
  title: string
  kicker: string
  summary: string
  cards: LearnCard[]
}

const CORE_TOPICS: LearnTopic[] = [
  {
    id: 'cell',
    title: '세포손상',
    kicker: '손상의 시작',
    summary: '세포가 스트레스를 받으면 처음에는 회복할 수 있다. 손상이 커지면 세포는 죽는다.',
    cards: [
      {
        id: 'reversible',
        title: '가역적 세포손상',
        body: '원인이 제거되면 세포가 되돌아올 수 있는 손상이다. 세포막과 에너지 생산이 아직 완전히 무너지지 않은 단계로 이해하면 된다.',
        points: ['원인 제거 시 회복 가능', '세포부종, 지방변화가 예시'],
        related: [6],
      },
      {
        id: 'irreversible',
        title: '비가역적 세포손상',
        body: '세포가 더 이상 회복하지 못하는 상태이다. 막이 파괴되거나 핵이 무너지면 세포는 죽음으로 진행한다.',
        points: ['회복 불가', '괴사 또는 세포자멸사로 이어짐'],
        related: [28],
      },
      {
        id: 'swelling',
        title: '세포부종',
        body: '세포가 이온 펌프를 제대로 돌리지 못하면 나트륨과 물이 세포 안에 남는다. 세포가 맑게 부풀어 보이는 초기 변화이다.',
        points: ['초기 손상에서 흔함', '가역적일 수 있음'],
        related: [1],
      },
      {
        id: 'fatty',
        title: '지방변화',
        body: '세포가 지방을 처리하지 못해 세포질 안에 지방 방울이 생긴다. 간세포에서 가장 자주 배운다.',
        points: ['간세포 내 지방 축적', '지방간의 기본 변화'],
        related: [6],
      },
      {
        id: 'necrosis',
        title: '괴사',
        body: '살아 있는 몸 안의 세포가 비가역적으로 죽어 막이 터지는 현상이다. 내용물이 밖으로 나오며 염증을 일으킨다.',
        points: ['염증을 동반하기 쉬움', '경색, 췌장염에서 중요'],
        related: [9, 28],
      },
      {
        id: 'apoptosis',
        title: '세포자멸사',
        body: '세포가 스스로 정리되며 죽는 방식이다. 조각난 세포는 주변 세포가 치우고, 괴사처럼 큰 염증을 잘 만들지 않는다.',
        points: ['계획된 세포 죽음', '강한 염증은 드묾'],
        related: [],
      },
    ],
  },
  {
    id: 'inflam',
    title: '염증',
    kicker: '방어 반응',
    summary: '염증은 손상을 가두기 위한 방어이다. 어떤 세포가 보이느냐로 급성인지 만성인지 가늠한다.',
    cards: [
      {
        id: 'acute',
        title: '급성 염증',
        body: '짧은 시간에 혈관이 확장되고 투과성이 높아진다. 액체와 호중구가 손상 부위로 나온다.',
        points: ['호중구가 주역', '발적·열감·종창·통증'],
        related: [1, 10, 11],
      },
      {
        id: 'chronic',
        title: '만성 염증',
        body: '자극이 남거나 급성 염증이 정리되지 않으면 오래 지속된다. 림프구와 대식세포가 보이고 조직이 섬유화될 수 있다.',
        points: ['림프구·대식세포', '섬유화 가능'],
        related: [7, 29],
      },
      {
        id: 'neutrophil',
        title: '호중구',
        body: '급성 염증의 대표 세포이다. 세균 감염과 급성 조직 손상에서 빠르게 모여든다.',
        points: ['분엽핵', '급성 충수염의 핵심 세포'],
        related: [10],
      },
      {
        id: 'lymphocyte',
        title: '림프구',
        body: '만성 염증과 면역 반응에서 중요하다. 바이러스 감염이나 자가면역에서도 함께 배운다.',
        points: ['둥근 핵', '만성 염증의 단서'],
        related: [29],
      },
      {
        id: 'macrophage',
        title: '대식세포',
        body: '찌꺼기를 삼키고 염증의 방향을 조절한다. 오래 가는 염증에서 수가 늘어난다.',
        points: ['포식', '육아종의 중심 세포'],
        related: [12],
      },
      {
        id: 'granuloma',
        title: '육아종',
        body: '없애기 어려운 원인 주위에 대식세포가 모여 작은 결절처럼 만든 만성 염증 구조이다. 결핵 학습의 중심 단어이다.',
        points: ['만성 염증의 특수 형태', '폐결핵과 연결'],
        related: [12],
      },
    ],
  },
  {
    id: 'hemo',
    title: '혈역학',
    kicker: '피와 체액',
    summary: '피가 너무 많이 고이거나, 반대로 막히면 조직은 붓거나 죽는다.',
    cards: [
      {
        id: 'edema',
        title: '부종',
        body: '혈관 밖 사이사이에 수분이 쌓인다. 압력이 높거나, 단백질이 빠져나가거나, 림프가 막힐 때 생길 수 있다.',
        points: ['간질 수분 증가', '신증후군·간경변과 연결'],
        related: [7, 22],
      },
      {
        id: 'hyperemia',
        title: '충혈',
        body: '동맥 혈류가 늘어 조직이 붉고 따뜻해진다. 염증 부위에서 흔히 함께 설명한다.',
        points: ['동맥 유입 증가', '발적의 혈역학'],
        related: [1],
      },
      {
        id: 'congestion',
        title: '울혈',
        body: '정맥 환류가 막혀 혈액이 장기 안에 남는다. 산소가 적은 혈액이 고여 조직이 어둡게 보일 수 있다.',
        points: ['정맥 유출 장애', '만성 울혈은 장기 손상을 남김'],
        related: [7],
      },
      {
        id: 'thrombus',
        title: '혈전',
        body: '혈관 안에서 피가 굳은 덩어리이다. 혈관 손상, 혈류 정체, 응고 성향이 혈전 형성의 고전적인 배경이다.',
        points: ['혈관 내 응고', '혈류를 좁힘'],
        related: [27, 28],
      },
      {
        id: 'embolus',
        title: '색전',
        body: '어딘가에서 생긴 덩어리가 떨어져 나와 다른 혈관을 막는다. 혈전 조각이 대표적이다.',
        points: ['이동 후 혈관 폐쇄', '경색의 원인'],
        related: [28],
      },
      {
        id: 'infarct',
        title: '경색',
        body: '혈류 차단으로 조직이 허혈에 빠지고 이어서 괴사한다. 심근경색이 가장 중요한 예이다.',
        points: ['허혈 다음 괴사', '심근경색'],
        related: [28],
      },
    ],
  },
  {
    id: 'tumor',
    title: '종양',
    kicker: '증식의 규칙',
    summary: '종양은 세포 증식의 조절이 깨진 상태이다. 양성과 악성은 성장 방식과 침윤으로 구분한다.',
    cards: [
      {
        id: 'benign',
        title: '양성 종양',
        body: '비교적 천천히 자라고 경계가 분명한 경우가 많다. 주변 조직을 밀 수는 있어도 파고들거나 멀리 퍼지지는 않는다.',
        points: ['경계가 비교적 분명', '전이하지 않음'],
        related: [4, 16, 18],
      },
      {
        id: 'malignant',
        title: '악성 종양',
        body: '비정상 세포가 조절 없이 증식하고 주변 조직으로 들어간다. 림프관이나 혈관을 통해 멀리 이동할 수 있다.',
        points: ['침윤', '전이 가능'],
        related: [3, 5, 17],
      },
      {
        id: 'dysplasia',
        title: '세포 이형성',
        body: '세포의 크기, 핵, 배열이 고르지 않은 변화이다. 상피에서 악성 종양으로 가는 길목으로 배운다.',
        points: ['핵과 배열의 이상', '자궁경부 학습과 연결'],
        related: [19],
      },
      {
        id: 'invasion',
        title: '침윤',
        body: '종양세포가 제자리에 머물지 않고 바닥의 막을 넘어 주변 조직으로 들어가는 것이다. 악성을 가늠하는 핵심 소견이다.',
        points: ['주변 조직으로 진입', '양성 종양과 구분'],
        related: [3, 5, 15],
      },
      {
        id: 'meta',
        title: '전이',
        body: '악성 세포가 원래 장기에서 떨어져 다른 장기에 새 종양을 만든다. 양성 종양에서는 일어나지 않는다.',
        points: ['원격 부위 종양', '악성의 특징'],
        related: [5, 8],
      },
      {
        id: 'naming',
        title: '종양 명명법',
        body: '양성 종양은 조직 이름 뒤에 종종 ‘-종’이 붙는다. 악성 종양은 상피에서 생기면 암종, 중간엽에서 생기면 육종으로 크게 구분한다. 백혈병은 혈액세포의 악성 질환으로 따로 배운다.',
        points: ['암종: 상피 악성', '육종: 중간엽 악성', '백혈병: 혈액'],
        related: [15, 26],
      },
    ],
  },
  {
    id: 'immune',
    title: '면역',
    kicker: '방어의 균형',
    summary: '면역은 몸을 지키지만, 과하거나 자신을 향하면 질병이 된다.',
    cards: [
      {
        id: 'hyper',
        title: '과민반응',
        body: '면역 반응이 너무 강하거나 잘못된 대상을 공격해 조직이 다친다. 기초 수준에서는 즉시형 알레르기, 세포를 향한 항체, 면역복합체, 지연형 T세포 반응의 네 갈래로만 구분한다.',
        points: ['과도한 면역', '조직 손상을 만듦', '천식은 기도의 과민과 연결해 이해'],
        related: [14],
      },
      {
        id: 'auto',
        title: '자가면역',
        body: '자신의 조직 성분을 적으로 오인해 지속적인 염증이 생긴다. 류마티스관절염에서 활막의 만성 염증으로 연결한다.',
        points: ['자기 조직 공격', '만성 염증'],
        related: [29],
      },
      {
        id: 'deficiency',
        title: '면역결핍',
        body: '방어 세포나 항체가 부족하면 감염이 잦고 깊어진다. 선천적인 경우와 나중에 생기는 경우를 구분하는 정도까지만 다룬다.',
        points: ['감염에 취약', '원인 감별은 전문 영역의 세부 검사로 이어짐'],
        related: [],
      },
    ],
  },
  {
    id: 'gene',
    title: '유전·선천',
    kicker: '기초 개념',
    summary: '유전자와 발달 과정의 이상이 질병과 연결될 수 있다. 여기서는 개념만 다룬다.',
    cards: [
      {
        id: 'mutation',
        title: '유전자 변이',
        body: 'DNA의 정보가 바뀌면 단백질의 기능이 달라질 수 있다. 모든 변이가 질병은 아니고, 세포 조절에 중요한 변이가 쌓이면 종양과도 연결된다.',
        points: ['DNA 정보 변화', '종양 발생의 배경 개념'],
        related: [3],
      },
      {
        id: 'congenital',
        title: '선천성 질환',
        body: '태어날 때부터 있는 구조나 기능의 이상이다. 발달 과정의 문제, 염색체 수나 구조의 이상, 단일 유전자 이상이 큰 갈래이다.',
        points: ['출생 시 이미 존재', '발달 과정과 연결'],
        related: [],
      },
      {
        id: 'chromosome',
        title: '염색체 수 이상',
        body: '염색체 개수가 다르면 발달에 영향이 생길 수 있다. 기초 예시로 21번 염색체가 하나 더 있는 다운증후군을 기억한다. 검사 방법의 세부 내용은 이번 앱에서 다루지 않는다.',
        points: ['염색체 개수의 변화', '다운증후군이 대표 예시'],
        related: [],
      },
    ],
  },
]

export const TOPICS: LearnTopic[] = [...CORE_TOPICS, ...EXTRA_TOPICS]

export const CELL_CARD_IDS = TOPICS.find((topic) => topic.id === 'cell')!.cards.map(
  (card) => `cell:${card.id}`,
)
