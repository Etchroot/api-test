// 월별 식재료 목록 (공공데이터포털 foodList 를 2026-10-21 에 받아 고정한 것).
// 목록은 자주 바뀌지 않아 미리 정해 두고, 식재료 상세와 레시피만 API 로 실시간 조회한다.
// 목록을 새로 받으려면 foodList 를 월별로 호출해 아래를 갱신한다.
window.FOOD_DATA = {
  fixedAt: "2026-10-21", // 목록을 받은 기준 날짜 (화면에 함께 보여 준다)
  months: {
    1: [
      { sn: "95", name: "들깨" },
      { sn: "42", name: "돼지고기(수제 소시지)" },
      { sn: "23", name: "요거트" },
      { sn: "13", name: "한라봉" },
      { sn: "11", name: "찹쌀" },
      { sn: "10", name: "장아찌" },
      { sn: "8", name: "오곡" },
      { sn: "6", name: "만두" },
      { sn: "3", name: "더덕" },
      { sn: "1", name: "곶감" },
    ],
    2: [
      { sn: "25", name: "조" },
      { sn: "24", name: "우엉" },
      { sn: "22", name: "시래기" },
      { sn: "21", name: "봄동" },
      { sn: "20", name: "딸기" },
      { sn: "19", name: "대두" },
      { sn: "18", name: "깻잎" },
      { sn: "17", name: "고사리" },
      { sn: "16", name: "건대추" },
      { sn: "15", name: "건과일" },
      { sn: "14", name: "가래떡" },
    ],
    3: [
      { sn: "54", name: "두부" },
      { sn: "37", name: "풋마늘" },
      { sn: "36", name: "움파" },
      { sn: "35", name: "양배추" },
      { sn: "34", name: "새싹" },
      { sn: "32", name: "방울토마토" },
      { sn: "31", name: "묵은나물" },
      { sn: "30", name: "목이버섯" },
      { sn: "27", name: "냉이" },
      { sn: "26", name: "견과류" },
    ],
    4: [
      { sn: "136", name: "돼지고기" },
      { sn: "49", name: "흑미" },
      { sn: "47", name: "쑥" },
      { sn: "46", name: "식용꽃" },
      { sn: "45", name: "발효생햄" },
      { sn: "44", name: "미나리" },
      { sn: "43", name: "머위순" },
      { sn: "40", name: "달래" },
      { sn: "29", name: "당면(전분식품)" },
    ],
    5: [
      { sn: "76", name: "오리고기" },
      { sn: "64", name: "토마토" },
      { sn: "62", name: "죽순" },
      { sn: "61", name: "오이" },
      { sn: "58", name: "스트링치즈" },
      { sn: "56", name: "상추" },
      { sn: "55", name: "마늘" },
      { sn: "53", name: "두릅" },
      { sn: "50", name: "귀리" },
      { sn: "9", name: "우리밀 " },
    ],
    6: [
      { sn: "112", name: "율무" },
      { sn: "75", name: "오디" },
      { sn: "74", name: "양파" },
      { sn: "73", name: "산딸기" },
      { sn: "71", name: "리코타치즈" },
      { sn: "69", name: "달걀" },
      { sn: "68", name: "곤드레" },
      { sn: "67", name: "강낭콩" },
      { sn: "66", name: "감자" },
      { sn: "65", name: "가지" },
    ],
    7: [
      { sn: "121", name: "도라지" },
      { sn: "113", name: "자두" },
      { sn: "88", name: "인삼(수삼)" },
      { sn: "87", name: "우유" },
      { sn: "84", name: "열무" },
      { sn: "83", name: "애호박" },
      { sn: "82", name: "수박" },
      { sn: "80", name: "보리쌀" },
      { sn: "70", name: "닭고기" },
      { sn: "63", name: "참외" },
      { sn: "33", name: "보리" },
    ],
    8: [
      { sn: "134", name: "단호박" },
      { sn: "103", name: "풋콩" },
      { sn: "102", name: "포도" },
      { sn: "101", name: "참나물" },
      { sn: "99", name: "블루베리" },
      { sn: "97", name: "멜론" },
      { sn: "93", name: "닭가슴살/닭안심" },
      { sn: "92", name: "고추" },
      { sn: "91", name: "고구마순" },
      { sn: "85", name: "옥수수" },
      { sn: "81", name: "복숭아" },
    ],
    9: [
      { sn: "130", name: "현미" },
      { sn: "117", name: "표고버섯" },
      { sn: "115", name: "팽이버섯" },
      { sn: "114", name: "토란" },
      { sn: "109", name: "소고기" },
      { sn: "106", name: "무화과" },
      { sn: "104", name: "기장" },
      { sn: "90", name: "콩나물" },
      { sn: "57", name: "수수" },
      { sn: "12", name: "토란대" },
    ],
    10: [
      { sn: "151", name: "생강" },
      { sn: "131", name: "호박" },
      { sn: "128", name: "파김치" },
      { sn: "127", name: "참다래" },
      { sn: "124", name: "새송이" },
      { sn: "119", name: "고춧잎" },
      { sn: "118", name: "검은콩" },
      { sn: "107", name: "배" },
      { sn: "100", name: "연근" },
      { sn: "39", name: "녹두" },
    ],
    11: [
      { sn: "142", name: "잣" },
      { sn: "141", name: "유자" },
      { sn: "139", name: "배추" },
      { sn: "138", name: "무" },
      { sn: "137", name: "메밀" },
      { sn: "135", name: "대추" },
      { sn: "133", name: "늙은 호박" },
      { sn: "132", name: "감" },
      { sn: "125", name: "쌀" },
      { sn: "123", name: "사과" },
    ],
    12: [
      { sn: "156", name: "팥" },
      { sn: "152", name: "석류" },
      { sn: "150", name: "브로콜리" },
      { sn: "149", name: "밤" },
      { sn: "148", name: "모과" },
      { sn: "147", name: "동치미" },
      { sn: "146", name: "동부" },
      { sn: "145", name: "도토리" },
      { sn: "144", name: "귤" },
      { sn: "143", name: "고구마" },
      { sn: "59", name: "시금치" },
    ],
  },
};
// 식재료별 Unsplash 사진 (일련번호 → { id: 사진 id, by: 촬영자, page: 사진 페이지, approx: 비슷한 사진이면 true }). 모두 Unsplash 무료 라이선스.
// 정확한 사진이 없는 식재료는 같은 종류의 비슷한 사진(approx)으로 대신했다 (예: 곤드레→잎채소, 도라지→도라지꽃).
window.FOOD_PHOTOS = {
  "95": { id: "1778048840964-d221d23b86ee", by: "Manoj Poosam", page: "https://unsplash.com/photos/a-close-up-view-of-many-toasted-sesame-seeds-n_nV3xvU4JU", approx: true }, // 들깨
  "42": { id: "1766589152630-e07d1b09d8ea", by: "Diego Arenas de Rodrigo", page: "https://unsplash.com/photos/three-browned-sausages-on-a-wooden-board-with-rosemary-3QJiX_KMj5c", approx: true }, // 돼지고기(수제 소시지)
  "23": { id: "1571212515416-fef01fc43637", by: "micheile henderson", page: "https://unsplash.com/photos/a-bowl-of-yogurt-with-a-spoon-in-it-NFHeBysjCTI" }, // 요거트
  "13": { id: "1648989976792-5a58bdd3ad05", by: "Eugene Golovesov", page: "https://unsplash.com/photos/a-pile-of-oranges-sitting-next-to-each-other-VEQu7a2yN6E", approx: true }, // 한라봉
  "11": { id: "1686820740687-426a7b9b2043", by: "Kseniya Nekrasova", page: "https://unsplash.com/photos/a-pile-of-white-rice-sitting-on-top-of-a-table-M5hX7319EBA", approx: true }, // 찹쌀
  "10": { id: "1627861446476-42fd9925e151", by: "Townsend Walton", page: "https://unsplash.com/photos/white-garlic-and-green-vegetable-in-clear-glass-jar-Cac5P_x4jaI", approx: true }, // 장아찌
  "8": { id: "1763368403529-0b8d9108cf9c", by: "Zoshua Colah", page: "https://unsplash.com/photos/bowls-of-assorted-dried-beans-and-legumes-okSEa77XTS4", approx: true }, // 오곡
  "6": { id: "1534422298391-e4f8c172dddb", by: "Abhishek Sanwa Limbu", page: "https://unsplash.com/photos/dumpling-dishes-LR559Dcst70" }, // 만두
  "3": { id: "1695798790639-c3c4294373ab", by: "本草圈", page: "https://unsplash.com/photos/a-close-up-of-a-plant-with-roots-JhOuD2wEiJs", approx: true }, // 더덕
  "1": { id: "1762980623026-c22d28494369", by: "Madeline Liu", page: "https://unsplash.com/photos/many-persimmons-hanging-on-strings-to-dry-zyIVA-DSiC4" }, // 곶감
  "25": { id: "1789865504636-95a551d48809", by: "Shu Xiao", page: "https://unsplash.com/photos/foxtail-millet-in-green-field-qDA4JYxEiO8" }, // 조
  "24": { id: "1749558160084-ea13df8b76e2", by: "Oleh Korzh", page: "https://unsplash.com/photos/burrs-and-a-purple-flower-on-a-leafy-plant-zPwfpgFpGo8", approx: true }, // 우엉
  "22": { id: "1789735100920-dcaccf16b127", by: "Doğan Alpaslan DEMİR", page: "https://unsplash.com/photos/dried-vegetables-and-party-shop-decorations-QtRmK6-cD00", approx: true }, // 시래기
  "21": { id: "1790339816996-87ad45c56b12", by: "YuJie Li", page: "https://unsplash.com/photos/napa-cabbage-leaves-with-ruffled-edges-tcrDTo-1zH8", approx: true }, // 봄동
  "20": { id: "1759686762997-64cd99f76846", by: "Ioana Cristiana", page: "https://unsplash.com/photos/a-pile-of-fresh-ripe-strawberries-with-green-leaves-Ztd6qEfqrZ0" }, // 딸기
  "19": { id: "1601993488142-d3050a16478d", by: "Thomas Kinto", page: "https://unsplash.com/photos/yellow-beans-on-white-surface-y-hLxayf194" }, // 대두
  "18": { id: "1790029410324-417ac3868a00", by: "Peter Muniz", page: "https://unsplash.com/photos/perilla-leaves-with-cucumber-and-noodles-WPYk5K_6tsw" }, // 깻잎
  "17": { id: "1779317179536-c10f8bc9d096", by: "eli hirtzel", page: "https://unsplash.com/photos/a-green-fern-frond-unfurling-in-a-spiral-shape-_J2_9rJRPak" }, // 고사리
  "16": { id: "1537201872643-ff006e1f016f", by: "Mona Mok", page: "https://unsplash.com/photos/wx4A5w85Sm8" }, // 건대추
  "15": { id: "1710857397974-f0617001c39e", by: "Hasmik Ghazaryan Olson", page: "https://unsplash.com/photos/a-display-of-dried-fruits-and-nuts-for-sale-SsGogfrak64" }, // 건과일
  "14": { id: "1747228469541-f0e7f56e7ec7", by: "lee seunghyub", page: "https://unsplash.com/photos/korean-tteokbokki-simmers-in-a-spicy-sauce-Uf2O1CnIpkY", approx: true }, // 가래떡
  "54": { id: "1765295138774-5e1ae99b2103", by: "Leongsan", page: "https://unsplash.com/photos/a-block-of-tofu-topped-with-sliced-green-onions-nYfkdPFWxtg" }, // 두부
  "37": { id: "1559836833-2a2c99b1f54f", by: "Laura Mitulla", page: "https://unsplash.com/photos/green-spring-onions-CQOm4U4E71M", approx: true }, // 풋마늘
  "36": { id: "1602769515559-e15133a7e992", by: "Christopher Previte", page: "https://unsplash.com/photos/green-and-white-vegetable-on-brown-wooden-table-7CcXR5wIhEY" }, // 움파
  "35": { id: "1772102501296-f50ad1be8d30", by: "Everest Louis", page: "https://unsplash.com/photos/a-large-green-cabbage-growing-in-the-soil-AS3M6jI1fP0" }, // 양배추
  "34": { id: "1774887248684-64162fde322b", by: "Mia Brzeskot", page: "https://unsplash.com/photos/a-pile-of-fresh-green-pea-shoots-V23L6hd52Ns" }, // 새싹
  "32": { id: "1524593166156-312f362cada0", by: "Tom Hermans", page: "https://unsplash.com/photos/red-cherry-tomatoes-nM6qrtnVKn8" }, // 방울토마토
  "31": { id: "1718777791239-c473e9ce7376", by: "Maria Klichik", page: "https://unsplash.com/photos/a-bowl-of-food-with-carrots-cucumbers-and-other-vegetables-q-M8nQqBJvU", approx: true }, // 묵은나물
  "30": { id: "1787098613408-2502ca5045d5", by: "Joann Martinez", page: "https://unsplash.com/photos/JEsd-eg9yDU" }, // 목이버섯
  "27": { id: "1551772413-6c1b7dc18548", by: "Angèle Kamp", page: "https://unsplash.com/photos/six-leafy-vegetables-kcvRHtAyuig", approx: true }, // 냉이
  "26": { id: "1543158181-1274e5362710", by: "Maksim Shutov", page: "https://unsplash.com/photos/mix-of-nuts-and-dried-cranberries-pUa1On18Jno" }, // 견과류
  "136": { id: "1623047437095-27418540c288", by: "KG Baek", page: "https://unsplash.com/photos/aeE-Y7SVVR4" }, // 돼지고기
  "49": { id: "1623691307892-d6de6dfb2a8a", by: "Sanjoy Sadhukhan", page: "https://unsplash.com/photos/black-and-brown-round-seeds-on-brown-wooden-tray-BGtUBzQE4Rc" }, // 흑미
  "47": { id: "1714365308205-343e38aa34f7", by: "Wyxina Tresse", page: "https://unsplash.com/photos/a-close-up-of-a-green-leafy-plant-VYEJUQbQxyA" }, // 쑥
  "46": { id: "1511489172414-fe504405d571", by: "Carol Lima", page: "https://unsplash.com/photos/assorted-type-of-flowers-in-white-surface-9_AA6O0L_-8" }, // 식용꽃
  "45": { id: "1609478721752-5511e4000252", by: "Antonella Vilardo", page: "https://unsplash.com/photos/person-slicing-meat-on-table-yCEuLaeUkfw" }, // 발효생햄
  "44": { id: "1617027090002-39148f0f6d03", by: "Karolina Kołodziejczak", page: "https://unsplash.com/photos/green-plant-on-clear-glass-bowl-CNhsp0UcrDc", approx: true }, // 미나리
  "43": { id: "1781026082857-cd964fae2466", by: "Jevgeņijs Grigorjevs", page: "https://unsplash.com/photos/green-fiddlehead-ferns-unfurling-in-a-natural-setting-Lpc1ouaz2QM", approx: true }, // 머위순
  "40": { id: "1751843984284-9b811a1a4a1e", by: "David Trinks", page: "https://unsplash.com/photos/garlic-scapes-overflowing-in-a-woven-basket-gMRa84I-1k8", approx: true }, // 달래
  "29": { id: "1774717530911-2ceb99449f7a", by: "Andrii Solok", page: "https://unsplash.com/photos/glass-noodles-with-chicken-and-vegetables-in-a-bowl-96jPnoBCMGg" }, // 당면
  "76": { id: "1765743691388-6a5608004b9c", by: "Ruslan Valeev", page: "https://unsplash.com/photos/chef-carves-roasted-duck-in-a-kitchen-xo-mqz2Be34" }, // 오리고기
  "64": { id: "1582284540020-8acbe03f4924", by: "engin akyurt", page: "https://unsplash.com/photos/red-tomatoes-on-brown-wooden-table-eb26eV-ys_k" }, // 토마토
  "62": { id: "1438755582627-221038b62986", by: "kazuend", page: "https://unsplash.com/photos/green-bamboo-shoots-LVdiXyu2eTc", approx: true }, // 죽순
  "61": { id: "1587411768638-ec71f8e33b78", by: "Mockup Graphics", page: "https://unsplash.com/photos/green-cucumber-on-white-surface-UrLT3x0x9sA" }, // 오이
  "58": { id: "1778449665117-2c607bbc7415", by: "Shoeib Abolhassani", page: "https://unsplash.com/photos/several-breaded-mozzarella-sticks-with-melted-cheese-pTwN-C1w1Vc" }, // 스트링치즈
  "56": { id: "1693667660375-653320dbebb4", by: "I Baihaqi", page: "https://unsplash.com/photos/a-pile-of-green-lettuce-sitting-on-top-of-a-table-Dthu0rFIp9s" }, // 상추
  "55": { id: "1625229466998-42ee9c597290", by: "Towfiqu barbhuiya", page: "https://unsplash.com/photos/garlic-on-brown-wooden-bowl-BQqNSRPWcRA" }, // 마늘
  "53": { id: "1780595678262-cd5d0bcb8a51", by: "Vitalii Abakumov", page: "https://unsplash.com/photos/fresh-green-asparagus-spears-on-a-light-green-background-dkIq5mXR9YA", approx: true }, // 두릅
  "50": { id: "1788241252385-f54ea4b31b05", by: "antonio massara", page: "https://unsplash.com/photos/pale-oat-grass-on-dark-background-TGMu-3atwo4", approx: true }, // 귀리
  "9": { id: "1529511582893-2d7e684dd128", by: "Polina Rytova", page: "https://unsplash.com/photos/wheat-field-1dGMs4hhcVA" }, // 우리밀
  "112": { id: "1584353781226-579f0ab7c770", by: "Lutz Wernitz", page: "https://unsplash.com/photos/brown-and-white-rice-grains-pcW5bR7gSJ4", approx: true }, // 율무
  "75": { id: "1771370040134-b59d3a0aa8e5", by: "Amy Vo", page: "https://unsplash.com/photos/ripe-mulberries-on-a-branch-with-green-leaves-gZ-7Cn3lHR8" }, // 오디
  "74": { id: "1757813027601-49030d3162ae", by: "Jim Petkiewicz", page: "https://unsplash.com/photos/a-pile-of-fresh-yellow-and-white-onions-r1ju831CZ8M" }, // 양파
  "73": { id: "1577069861033-55d04cec4ef5", by: "Zach Inglis", page: "https://unsplash.com/photos/macro-photography-of-raspberry-fruits-t0A2NCMhXRQ" }, // 산딸기
  "71": { id: "1635407862451-58962c048a76", by: "Aleksey Melkomukov", page: "https://unsplash.com/photos/0mN0iv7QdIo", approx: true }, // 리코타치즈
  "69": { id: "1498654077810-12c21d4d6dc3", by: "Jakub Kapusnak", page: "https://unsplash.com/photos/shallow-focus-photography-of-brown-eggs-Hj53USePB1E" }, // 달걀
  "68": { id: "1784801119330-64d7eaded9f2", by: "Tatyana Rubleva", page: "https://unsplash.com/photos/a-vibrant-mix-of-fresh-green-leafy-vegetables-mre9UNcaYzE", approx: true }, // 곤드레
  "67": { id: "1763368397625-32c8f75fed44", by: "Zoshua Colah", page: "https://unsplash.com/photos/QTGbQFlTvb8" }, // 강낭콩
  "66": { id: "1518977676601-b53f82aba655", by: "Lars Blankers", page: "https://unsplash.com/photos/brown-potato-lot-B0s3Xndk6tw" }, // 감자
  "65": { id: "1722501561648-b28829d2f289", by: "nilufar nattaq", page: "https://unsplash.com/photos/a-group-of-purple-eggplant-sitting-on-top-of-a-tiled-floor-cZOM9Hk5hfM" }, // 가지
  "121": { id: "1786370160815-13aa7ced3b72", by: "Anthony Aird", page: "https://unsplash.com/photos/purple-balloon-flower-and-bud-MXR5xnLGVDE", approx: true }, // 도라지
  "113": { id: "1646341501659-63d67d851773", by: "Kamala Bright", page: "https://unsplash.com/photos/a-basket-full-of-plums-sitting-on-the-ground-VyInLBjJzOM" }, // 자두
  "88": { id: "1695798790639-c3c4294373ab", by: "本草圈 (bencaoquan)", page: "https://unsplash.com/photos/a-close-up-of-a-plant-with-roots-JhOuD2wEiJs" }, // 인삼(수삼)
  "87": { id: "1550583724-b2692b85b150", by: "Eiliv Aceron", page: "https://unsplash.com/photos/person-pours-milk-into-glass-_8bnn1GqX70" }, // 우유
  "84": { id: "1791425643434-febd7aff46b9", by: "DL314 Lin", page: "https://unsplash.com/photos/white-radishes-washing-in-water-SqSEqTYezyc" }, // 열무
  "83": { id: "1768405741410-71317eceb565", by: "Elly M", page: "https://unsplash.com/photos/A5i6R0hcFL4" }, // 애호박
  "82": { id: "1767747484833-8e9d4f88fe69", by: "Dina Makhmutova", page: "https://unsplash.com/photos/KvS5nnqHwVI" }, // 수박
  "80": { id: "1574323347407-f5e1ad6d020b", by: "Avinash Kumar", page: "https://unsplash.com/photos/brown-grains-OvUAL6Vx3uY", approx: true }, // 보리쌀
  "70": { id: "1587593810167-a84920ea0781", by: "JK Sloan", page: "https://unsplash.com/photos/raw-chicken-meat-on-brown-wooden-chopping-board-9zLa37VNL38" }, // 닭고기
  "63": { id: "1756837657076-4c5f0f76672c", by: "Raúl Mermans García", page: "https://unsplash.com/photos/yellow-melons-with-red-markings-displayed-at-a-market-M11jS-4YJQs", approx: true }, // 참외
  "33": { id: "1415381850596-1d29bce989f8", by: "Emma Van Sant", page: "https://unsplash.com/photos/shallow-focus-photo-of-brown-wheat-JkfNpgk8oNw", approx: true }, // 보리
  "134": { id: "1782973048178-9b00a78cdcea", by: "Tho Nguyen Huu", page: "https://unsplash.com/photos/1n458_A9hzw", approx: true }, // 단호박
  "103": { id: "1649257171206-37625b1f3b2f", by: "Filipp Romanovski", page: "https://unsplash.com/photos/0jBxjLCTVVQ" }, // 풋콩
  "102": { id: "1596363505729-4190a9506133", by: "Andrey Haimin", page: "https://unsplash.com/photos/bunch-of-dark-purple-grapes-qtwlKiu6VHg" }, // 포도
  "101": { id: "1708436476465-0938f4e28836", by: "Monika Borys", page: "https://unsplash.com/photos/a-bunch-of-celery-sitting-on-top-of-a-table-xcuPfiSVoSI", approx: true }, // 참나물
  "99": { id: "1594002348772-bc0cb57ade8b", by: "Melissa Belanger", page: "https://unsplash.com/photos/closeup-of-fresh-blueberries-usE0kpV_yLo" }, // 블루베리
  "97": { id: "1571575173700-afb9492e6a50", by: "Oriol Portell", page: "https://unsplash.com/photos/cantaloupe-slices-on-green-surface-AbwqpFnBDms" }, // 멜론
  "93": { id: "1633096013004-e2cb4023b560", by: "Philippe Zuber", page: "https://unsplash.com/photos/two-raw-chicken-breasts-in-a-black-bowl-9ZrWR8R961U" }, // 닭가슴살/닭안심
  "92": { id: "1546860255-95536c19724e", by: "Shane Kong", page: "https://unsplash.com/photos/bunch-of-chili-dDI3pSF-yK4" }, // 고추
  "91": { id: "1574316071802-0d684efa7bf5", by: "Shutter Sphere Collective", page: "https://unsplash.com/photos/fresh-green-spinach-leaves-6AAptb2kBak", approx: true }, // 고구마순
  "85": { id: "1691525504400-21faa66cd7b2", by: "Ahmet RÜZGAR", page: "https://unsplash.com/photos/a-close-up-of-a-stalk-of-corn-on-the-cob-lm6kLTgYokk" }, // 옥수수
  "81": { id: "1779738192898-f7ca5f08f15e", by: "Jason Leung", page: "https://unsplash.com/photos/a-large-pile-of-fresh-ripe-peaches-D2yXUewNiJ0" }, // 복숭아
  "130": { id: "1519204272527-33a25eaccc7c", by: "Nathalie Jolie", page: "https://unsplash.com/photos/brown-rice-grain-on-white-textile-NQm9tLO2Kzg" }, // 현미
  "117": { id: "1510442437064-523bec01a056", by: "Thom Milkovic", page: "https://unsplash.com/photos/uX-8hmrUIwk" }, // 표고버섯
  "115": { id: "1769195045391-a970e273e07f", by: "Nowbelov", page: "https://unsplash.com/photos/cluster-of-enoki-mushrooms-on-a-dark-background-YEgBek-h564" }, // 팽이버섯
  "114": { id: "1757283961544-e161ac41b201", by: "Daniel Dan", page: "https://unsplash.com/photos/a-pile-of-freshly-harvested-taro-roots-y6jpoFEGNrA" }, // 토란
  "109": { id: "1772285466464-8ccda2c3be92", by: "Magnus Jonasson", page: "https://unsplash.com/photos/two-raw-ribeye-steaks-seasoned-with-salt-on-a-rack-E5GBbE74cLc" }, // 소고기
  "106": { id: "1760752942160-dea6a93eae24", by: "kaori kubota", page: "https://unsplash.com/photos/fresh-figs-whole-and-halved-on-a-wooden-surface-6ppRLOUu-I4" }, // 무화과
  "104": { id: "1789865504636-95a551d48809", by: "Shu Xiao", page: "https://unsplash.com/photos/foxtail-millet-in-green-field-qDA4JYxEiO8" }, // 기장
  "90": { id: "1758701925687-1449ab265c2e", by: "David Clode", page: "https://unsplash.com/photos/sprouted-mung-beans-close-up-Ywu0vcSMEYY", approx: true }, // 콩나물
  "57": { id: "1758356860542-a2df92aad294", by: "南北 猫 (xurui000)", page: "https://unsplash.com/photos/field-of-ripe-red-sorghum-plants-tnmVtjNjV-E" }, // 수수
  "12": { id: "1757283961544-e161ac41b201", by: "Daniel Dan", page: "https://unsplash.com/photos/a-pile-of-freshly-harvested-taro-roots-y6jpoFEGNrA", approx: true }, // 토란대
  "151": { id: "1758055660285-d32b7b3b1e77", by: "engin akyurt", page: "https://unsplash.com/photos/pile-of-fresh-ginger-roots-close-up-m_mIEhLkppE" }, // 생강
  "131": { id: "1698421223077-8c474e6f6557", by: "Shelley Johnson", page: "https://unsplash.com/photos/a-pile-of-pumpkins-sitting-next-to-each-other-vmRxDqMJpGY" }, // 호박
  "128": { id: "1540162621994-4b096ef8523b", by: "charlesdeluvio", page: "https://unsplash.com/photos/kimchi-food-jdMEMbsWd70", approx: true }, // 파김치
  "127": { id: "1679065103638-7360cb935fac", by: "Max Böhme", page: "https://unsplash.com/photos/a-close-up-of-a-kiwi-fruit-sliced-in-half-p5Ljx_H2F8o" }, // 참다래
  "124": { id: "1760108273033-0d789ef53d70", by: "Anastasiya Badun", page: "https://unsplash.com/photos/a-close-up-view-of-many-king-oyster-mushrooms-4neQmf4qvxc" }, // 새송이
  "119": { id: "1761669411746-8f401c29e9a6", by: "Amandine VEYRON", page: "https://unsplash.com/photos/red-and-black-chili-peppers-growing-on-a-plant-HmpIY5MJ2KE", approx: true }, // 고춧잎
  "118": { id: "1709229851054-a09c8f7bd7e3", by: "Junior Bazzo", page: "https://unsplash.com/photos/a-pile-of-black-beans-sitting-on-top-of-a-table-8sBDLt02quo", approx: true }, // 검은콩
  "107": { id: "1615484477778-ca3b77940c25", by: "Mockup Graphics", page: "https://unsplash.com/photos/pear-with-yellow-and-red-skin-haSJEJYzl5A", approx: true }, // 배
  "100": { id: "1791321829210-d94ccbc63b8f", by: "Zoshua Colah", page: "https://unsplash.com/photos/lotus-root-dish-with-chopsticks-6tkZ_SwjPuA" }, // 연근
  "39": { id: "1543831113-c823c4a606b6", by: "Nishant Dwivedi", page: "https://unsplash.com/photos/photo-of-mung-beans-ZAKBHmlINmE" }, // 녹두
  "142": { id: "1543208541-0961a29a8c3d", by: "Peter F", page: "https://unsplash.com/photos/assorted-seed-lot-fZ7-IAReeSo", approx: true }, // 잣
  "141": { id: "1604132720695-3603377f8dcc", by: "Jinomono Media", page: "https://unsplash.com/photos/yellow-fruit-tree-during-daytime-1NehFfpnUJY", approx: true }, // 유자
  "139": { id: "1779738192854-92a3daec9b45", by: "Jason Leung", page: "https://unsplash.com/photos/several-heads-of-fresh-napa-cabbage-lined-up-BCXgdJJ5nPY" }, // 배추
  "138": { id: "1762710526515-b5c1f45d69ef", by: "liam matthews", page: "https://unsplash.com/photos/white-radishes-and-bitter-melons-in-a-crate-0BCwHPrs9hM" }, // 무
  "137": { id: "1719060038791-012d4a471d91", by: "Sonia", page: "https://unsplash.com/photos/a-pile-of-seeds-sitting-on-top-of-a-table-ttZcUhcEElw" }, // 메밀
  "135": { id: "1537201872643-ff006e1f016f", by: "Mona Mok", page: "https://unsplash.com/photos/wx4A5w85Sm8" }, // 대추
  "133": { id: "1634977961336-0a9237b8a064", by: "Bruno Kelzer", page: "https://unsplash.com/photos/a-large-orange-pumpkin-on-a-white-background-884PkTk0rhY" }, // 늙은 호박
  "132": { id: "1616543746017-e155fdc45935", by: "Robert Chen", page: "https://unsplash.com/photos/TW4QVEQadHk" }, // 감
  "125": { id: "1586201375761-83865001e31c", by: "Pierre Bamin", page: "https://unsplash.com/photos/-LdilhDx3sk" }, // 쌀
  "123": { id: "1474564862106-1f23d10b9d72", by: "Krishnam Moosaddee", page: "https://unsplash.com/photos/bunch-of-red-apples-jf6EbeBE8UQ" }, // 사과
  "156": { id: "1763368397625-32c8f75fed44", by: "Zoshua Colah", page: "https://unsplash.com/photos/a-pile-of-dried-red-kidney-beans-QTGbQFlTvb8", approx: true }, // 팥
  "152": { id: "1564849333528-83d97e370857", by: "Arielle Allouche", page: "https://unsplash.com/photos/pomegranate-NUg9nKMb__Q" }, // 석류
  "150": { id: "1615485290382-441e4d049cb5", by: "Mockup Graphics", page: "https://unsplash.com/photos/green-broccoli-on-white-background-q7BJL1qZ1Bw" }, // 브로콜리
  "149": { id: "1601275875269-c48cd2c46546", by: "Tijana Drndarski", page: "https://unsplash.com/photos/2-brown-round-fruit-on-white-textile-xfbuF-LL8VY" }, // 밤
  "148": { id: "1566983574152-e89b92b6a634", by: "Alexander Schimmeck", page: "https://unsplash.com/photos/sliced-round-yellow-fruit-T7VnJsoIwoE" }, // 모과
  "147": { id: "1540162621994-4b096ef8523b", by: "charlesdeluvio", page: "https://unsplash.com/photos/kimchi-food-jdMEMbsWd70", approx: true }, // 동치미
  "146": { id: "1690200276987-dee911d1732b", by: "Cosmin Ursea", page: "https://unsplash.com/photos/a-close-up-of-a-bowl-of-beans-Efvl6l1RkA4", approx: true }, // 동부
  "145": { id: "1758562253567-3238de6e389e", by: "James Wainscoat", page: "https://unsplash.com/photos/acorns-on-an-oak-tree-branch-with-leaves-Wuu0VE4-rkk" }, // 도토리
  "144": { id: "1570916517188-ab7edf943064", by: "Michele Blackwell", page: "https://unsplash.com/photos/selective-focus-photography-of-orange-tangerine-fruits-1vR-eLR7InM" }, // 귤
  "143": { id: "1730815048561-45df6f7f331d", by: "Glen Hayoge", page: "https://unsplash.com/photos/a-pile-of-pink-and-yellow-sweet-potatoes-k0MigzUz-vI" }, // 고구마
  "59": { id: "1683536905403-ea18a3176d29", by: "engin akyurt", page: "https://unsplash.com/photos/a-pile-of-green-leafy-vegetables-sitting-on-top-of-a-table-Y2xyssByhdc" }, // 시금치
};
