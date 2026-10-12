import { EXTRA_TERMS } from './pathologyTerms'

export interface GlossaryEntry {
  term: string
  body: string
}

const CORE_TERMS: GlossaryEntry[] = [
  {
    term: '가역적 세포손상',
    body: '원인이 사라지면 세포가 다시 회복할 수 있는 손상이다. 세포부종이나 지방변화가 대표적이다.',
  },
  {
    term: '비가역적 세포손상',
    body: '세포가 더 이상 회복하지 못하는 손상이다. 괴사와 세포자멸사가 여기에 해당한다.',
  },
  {
    term: '세포자멸사',
    body: '세포가 프로그램된 방식으로 죽는 현상이다. 주변 조직에 강한 염증을 잘 일으키지 않는 편이 특징이다.',
  },
  {
    term: '세포부종',
    body: '세포가 수분과 나트륨을 제대로 빼내지 못해 부풀어 오르는 변화이다. 초기 세포손상에서 볼 수 있다.',
  },
  {
    term: '지방변화',
    body: '세포 안에 지방이 비정상적으로 쌓이는 변화이다. 간세포에서 자주 설명된다.',
  },
  {
    term: '괴사',
    body: '살아 있는 조직의 세포가 비가역적으로 손상되어 죽는 현상이다. 막이 무너지며 염증을 유발할 수 있다.',
  },
  {
    term: '염증',
    body: '조직 손상이나 감염 등에 대한 생체의 방어 반응이다. 발적, 열감, 종창, 통증과 연결될 수 있다.',
  },
  {
    term: '급성 염증',
    body: '비교적 짧은 시간에 나타나는 염증이다. 호중구가 주요 세포이고, 혈관 확장과 삼출이 함께 나타난다.',
  },
  {
    term: '만성 염증',
    body: '오래 지속되는 염증이다. 림프구, 형질세포, 대식세포가 주로 보이며 섬유화가 동반될 수 있다.',
  },
  {
    term: '호중구',
    body: '급성 염증에서 가장 먼저 손상 부위로 이동하는 백혈구이다. 핵이 여러 엽으로 나뉜 모습이 특징이다.',
  },
  {
    term: '림프구',
    body: '만성 염증과 면역 반응에서 중요한 백혈구이다. 핵이 둥글고 세포질이 적은 작은 세포로 보인다.',
  },
  {
    term: '대식세포',
    body: '조직의 찌꺼기와 병원체를 잡아먹는 세포이다. 만성 염증과 육아종에서 중요한 역할을 한다.',
  },
  {
    term: '육아종',
    body: '특정 원인에 대한 만성 염증에서 대식세포 등이 모여 만드는 구조이다. 결핵을 배울 때 함께 등장한다.',
  },
  {
    term: '삼출',
    body: '염증으로 혈관 투과성이 높아지면서 액체와 단백질, 세포가 조직이나 공간으로 나오는 현상이다.',
  },
  {
    term: '침윤',
    body: '염증세포나 비정상 세포가 주변 조직 안으로 들어가는 현상이다. 악성 종양에서는 중요한 소견이다.',
  },
  {
    term: '이형성',
    body: '세포의 크기와 핵, 배열이 비정상적으로 달라진 상태이다. 악성 종양으로 진행할 수 있는 변화로 배운다.',
  },
  {
    term: '전이',
    body: '악성 종양세포가 원래 위치에서 다른 부위로 이동해 새 종양을 만드는 현상이다.',
  },
  {
    term: '섬유화',
    body: '손상된 자리를 콜라겐 같은 결합조직이 채우는 과정이다. 반복된 손상 뒤에 장기의 구조가 딱딱해질 수 있다.',
  },
  {
    term: '재생결절',
    body: '손상된 간에서 간세포가 덩어리처럼 다시 증식한 구조이다. 섬유화와 함께 간경변의 특징이다.',
  },
  {
    term: '부종',
    body: '혈관 밖 조직 사이사이에 체액이 과도하게 쌓이는 상태이다.',
  },
  {
    term: '충혈',
    body: '동맥을 통해 조직으로 들어오는 혈류가 늘어난 상태이다. 염증 부위의 발적과 관련된다.',
  },
  {
    term: '울혈',
    body: '정맥으로 피가 빠져나가지 못해 조직에 혈액이 고이는 상태이다.',
  },
  {
    term: '혈전',
    body: '혈관 안에서 혈액이 굳어 만들어진 덩어리이다. 혈류를 방해할 수 있다.',
  },
  {
    term: '색전',
    body: '혈전이나 다른 물질이 혈류를 타고 이동한 뒤, 더 가는 혈관을 막는 현상이다.',
  },
  {
    term: '경색',
    body: '혈류가 차단되어 조직이 허혈 상태에 빠지고, 이어서 괴사에 이르는 변화이다.',
  },
  {
    term: '허혈',
    body: '조직으로 가는 혈류가 줄어 산소와 영양이 부족한 상태이다.',
  },
  {
    term: '양성 종양',
    body: '비교적 천천히 자라고 경계가 분명한 경우가 많으며, 주변으로 침윤하거나 전이하지 않는 종양이다.',
  },
  {
    term: '악성 종양',
    body: '비정상 세포가 증식하고 주변 조직을 침윤하며, 다른 부위로 전이할 수 있는 종양이다.',
  },
  {
    term: '과민반응',
    body: '면역 반응이 과도하거나 부적절한 대상을 향해 일어나 조직 손상을 만드는 반응이다.',
  },
  {
    term: '자가면역',
    body: '면역체계가 자신의 조직을 외부 물질처럼 인식해 공격하는 상태이다.',
  },
]

export const GLOSSARY: GlossaryEntry[] = [...CORE_TERMS, ...EXTRA_TERMS]

const byLength = [...GLOSSARY].sort((a, b) => b.term.length - a.term.length)

export function findGlossary(term: string) {
  return GLOSSARY.find((item) => item.term === term)
}

export function splitGlossary(text: string): { text: string; term?: string }[] {
  const parts: { text: string; term?: string }[] = []
  let index = 0
  while (index < text.length) {
    const match = byLength.find((item) => text.startsWith(item.term, index))
    if (match) {
      parts.push({ text: match.term, term: match.term })
      index += match.term.length
      continue
    }
    const nexts = byLength
      .map((item) => text.indexOf(item.term, index))
      .filter((pos) => pos > index)
    const next = nexts.length ? Math.min(...nexts) : text.length
    parts.push({ text: text.slice(index, next) })
    index = next
  }
  return parts
}
