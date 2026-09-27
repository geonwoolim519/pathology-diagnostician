import type { SlideTheme } from '../types'

export interface OrganCompare {
  id: string
  name: string
  normal: string
  pathology: string
  normalTheme: SlideTheme
  pathTheme: SlideTheme
  pathTitle: string
  caseId: number
}

export const ORGANS: OrganCompare[] = [
  {
    id: 'stomach',
    name: '위',
    normal: '표면이 고른 점막으로 덮여 있고, 분비샘이 일정한 간격으로 배열된다.',
    pathology: '점막이 손상되고 염증세포가 들어오거나, 더 깊이 파이거나, 비정상 세포가 구조를 대체한다.',
    normalTheme: 'normal-mucosa',
    pathTheme: 'mucosa-acute',
    pathTitle: '점막의 급성 염증',
    caseId: 1,
  },
  {
    id: 'liver',
    name: '간',
    normal: '간세포가 판 모양으로 질서 있게 배열되고, 사이에 굴모양 혈관이 있다.',
    pathology: '세포 안 지방, 섬유화와 재생결절, 또는 종양성 증식으로 정상 판 구조가 흐트러진다.',
    normalTheme: 'normal-liver',
    pathTheme: 'cirrhosis',
    pathTitle: '섬유화와 결절',
    caseId: 7,
  },
  {
    id: 'lung',
    name: '폐',
    normal: '얇은 폐포벽 사이로 공기가 드나드는 넓은 공간이 있다.',
    pathology: '폐포가 염증 삼출로 채워지거나, 벽이 파괴되어 비정상적으로 넓어지거나, 육아종이 생긴다.',
    normalTheme: 'normal-lung',
    pathTheme: 'alveoli-exudate',
    pathTitle: '폐포 안 삼출',
    caseId: 11,
  },
  {
    id: 'kidney',
    name: '신장',
    normal: '사구체는 보우만주머니 안의 모세혈관 덩어리이고, 세뇨관이 주변을 질서 있게 감싼다.',
    pathology: '사구체에 염증세포가 늘거나 여과장벽이 손상되고, 종양에서는 비정상 상피세포가 증식한다.',
    normalTheme: 'normal-kidney',
    pathTheme: 'glomerulus',
    pathTitle: '사구체의 염증',
    caseId: 21,
  },
  {
    id: 'heart',
    name: '심장',
    normal: '심근세포가 가지를 치며 벽돌처럼 연결되어 있고, 핵은 세포 중앙에 있다.',
    pathology: '혈류가 끊기면 심근세포가 허혈로 손상되고 괴사한다.',
    normalTheme: 'normal-heart',
    pathTheme: 'myocyte',
    pathTitle: '심근 괴사',
    caseId: 28,
  },
  {
    id: 'colon',
    name: '대장',
    normal: '점막의 샘이 가지런하고, 술잔세포가 점액을 만든다.',
    pathology: '샘 상피가 비정상적으로 증식해 용종을 만들거나, 악성 세포가 벽을 침윤한다.',
    normalTheme: 'normal-colon',
    pathTheme: 'benign-glands',
    pathTitle: '샘 구조의 증식',
    caseId: 4,
  },
  {
    id: 'breast',
    name: '유방',
    normal: '유관과 소엽이 섬유지방 조직 사이에 흩어져 있다.',
    pathology: '상피와 기질이 함께 양성 증식하거나, 비정상 상피가 주변으로 침윤한다.',
    normalTheme: 'normal-breast',
    pathTheme: 'fibroadenoma',
    pathTitle: '양성 이상엽 증식',
    caseId: 16,
  },
  {
    id: 'uterus',
    name: '자궁',
    normal: '두꺼운 평활근 벽과, 주기에 따라 변하는 내막이 있다.',
    pathology: '평활근이 양성 증식하거나, 내막과 비슷한 조직이 자궁 밖에서 발견된다.',
    normalTheme: 'normal-uterus',
    pathTheme: 'smooth-muscle',
    pathTitle: '평활근 증식',
    caseId: 18,
  },
  {
    id: 'blood',
    name: '혈액',
    normal: '적혈구는 크기와 색이 고르고, 가운데가 옅다. 백혈구는 적혈구보다 훨씬 적다.',
    pathology: '적혈구가 작고 창백해지거나, 미성숙한 큰 백혈병 세포가 늘어난다.',
    normalTheme: 'normal-blood',
    pathTheme: 'rbc-micro',
    pathTitle: '소구성 저색소 적혈구',
    caseId: 25,
  },
  {
    id: 'vessel',
    name: '혈관',
    normal: '동맥 내막은 얇고 매끈하여 피가 지나갈 공간이 충분히 남는다.',
    pathology: '내막에 지방과 섬유 성분이 쌓여 죽상판이 되고 내강이 좁아진다.',
    normalTheme: 'normal-vessel',
    pathTheme: 'atheroma',
    pathTitle: '죽상판',
    caseId: 27,
  },
]
