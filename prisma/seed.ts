// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 这里放入原本在 museum-data.ts 里的数据
const MUSEUM_DATA = [
  {
    title: '关羽·关云长——华容道',
    category: '京剧',
    imageUrl: '/source/pictures/Peking/guan_huarongdao.png', 
    description: `【谱式】整脸 \n【色彩】红色（象征忠义、耿直、有血性）\n【人物判词】赤面秉赤心，骑赤兔追风，驰驱时无忘赤帝；青灯观青史，仗青龙偃月，隐微处不愧青天\n
    【面相特征】卧蚕眉（秀长弯曲，主忠义刚正）、丹凤眼（细长上翘、黑白分明，显威严明辨）、国字脸（方额阔腮，主胸怀坦荡、能担大任）、面如重枣（赤面映丹心）\n
    【脸谱设计】红脸铺陈全脸强化忠义内核，眉心黑纹凸显卧蚕眉神韵，夸张眉眼放大威严感，搭配长髯显仁厚气场\n【核心契合】面相细节与脸谱纹饰高度统一，将 “忠义、正直、威严” 凝练为经典视觉符号，是中国文化中忠义化身的缩影`,
  },
  {
    title: '曹操·孟德——群英会',
    category: '京剧',
    imageUrl: '/source/pictures/Peking/caocao_qunyinhui.png',
    description: `【谱式】水白脸（奸脸）\n【色彩】白色（象征奸诈、多疑、阴险）\n【人物判词】宁教我负天下人，休教天下人负我\n
    【面相特征】三角眼（眼型尖细、眼尾上挑，主多疑狡诈）、扫帚眉（眉形散乱、眉尾低垂，显阴险薄情）、窄额尖腮（脸型狭长，主心胸狭隘、寡恩负义）\n
    【脸谱设计】水白脸铺陈全脸强化奸诈内核，眉眼处勾勒细黑纹路放大阴鸷感，散乱线条呈现扫帚眉凸显阴险特质\n【核心契合】面相细节与脸谱设计高度呼应，将 “奸诈、多疑、阴险” 凝练为视觉符号，是京剧中奸角的经典代表`,
  },
  {
    title: '孙悟空·美猴王',
    category: '昆曲',
    imageUrl: '/masks/sunwukong.jpg',
    description: `【谱式】象形脸\n【色彩】金/红（象征神幻、活泼、正义）\n【人物判词】金猴奋起千钧棒，玉宇澄清万里埃...`,
  },
  {
    title: '包拯·包青天',
    category: '豫剧',
    imageUrl: '/masks/baozheng.jpg',
    description: `【谱式】整脸\n【色彩】黑色（象征刚正不阿、铁面无私）\n【人物判词】关节不到，有阎罗包老...`,
  },
  {
    title: '窦尔敦',
    category: '京剧',
    imageUrl: '/masks/douerdun.jpg',
    description: `【谱式】花三块瓦脸\n【色彩】蓝色（象征刚猛、桀骜不驯、有心计）...`,
  },
  {
    title: '程咬金',
    category: '川剧',
    imageUrl: '/masks/chengyaojin.jpg',
    description: `【谱式】花脸\n【色彩】绿色（象征暴躁、勇猛、莽撞）...`,
  }
];

async function main() {
  console.log('正在填充博物馆数据...');

  // 1. 先清空旧的展品表 (防止重复)
  await prisma.exhibit.deleteMany({});

  // 2. 插入新数据到 Exhibit 表
  for (const item of MUSEUM_DATA) {
    // [修改] 这里改成 prisma.exhibit
    const exhibit = await prisma.exhibit.create({

      data: item,
    });
    console.log(`✅ 已入库: ${exhibit.title}`);
  }
  
  console.log('✨ 博物馆建设完成！');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });