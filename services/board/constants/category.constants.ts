export const CATEGORY_INFO = {
  planning: {
    title: "기획",
    subtitle: "아이디어를 현실로 만드는 첫 걸음",
    description: "서비스 기획, 프로덕트 전략, 사용자 리서치까지\n기획자들의 실무 노하우를 나누고 성장하세요",
    image: "/images/board/category_planning.png",
    gradient: "from-[#6886F8] to-[#6455EC]",
  },
  design: {
    title: "디자인",
    subtitle: "사용자 경험을 디자인하다",
    description: "UI/UX 디자인, 디자인 시스템, 프로토타이핑\n디자이너들의 크리에이티브한 인사이트를 공유하세요",
    image: "/images/board/category_design.png",
    gradient: "from-[#FF6B6B] to-[#FF8E53]",
  },
  development: {
    title: "개발",
    subtitle: "코드로 세상을 바꾸는 개발자들",
    description: "프론트엔드, 백엔드, 모바일, DevOps까지\n개발 노하우와 트러블슈팅 경험을 함께 나눠요",
    image: "/images/board/category_development.png",
    gradient: "from-[#667EEA] to-[#764BA2]",
  },
  community: {
    title: "커뮤니티",
    subtitle: "함께 성장하는 IT 커뮤니티",
    description: "스터디 모집, 네트워킹, 커리어 조언\nIT 종사자들의 따뜻한 커뮤니티에 참여하세요",
    image: "/images/board/category_community.png",
    gradient: "from-[#11998E] to-[#38EF7D]",
  },
  tip: {
    title: "Tip",
    subtitle: "알아두면 쓸모있는 IT 꿀팁",
    description: "생산성 도구, 업무 노하우, 트렌드 정보\n실무에 바로 적용할 수 있는 유용한 팁을 발견하세요",
    image: "/images/board/category_tip.png",
    gradient: "from-[#FC466B] to-[#3F5EFB]",
  },
} as const;

export type CategoryKey = keyof typeof CATEGORY_INFO;