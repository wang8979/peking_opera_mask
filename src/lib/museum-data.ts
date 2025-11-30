
export const MUSEUM_WORKS = [
  {
    id: 'mask-001',
    title: '关羽·关云长',
    category: '京剧',
    // 假设你把图片放在了 public/masks/guanyu.jpg
    // 如果没有图片，可以用颜色块代替，或者去网上找图填入 URL
    imageUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop', 
    createdAt: new Date('2023-01-01'),
    description: `
      【谱式】整脸
      【色彩】红色（象征忠义、耿直、有血性）
      【人物判词】赤面秉赤心，骑赤兔追风，驰驱时无忘赤帝；青灯观青史，仗青龙偃月，隐微处不愧青天。
      
      关羽的脸谱是京剧中最经典的“红脸”代表。勾勒时要在眉心画一道黑纹，称为“卧蚕眉”，丹凤眼要画得长而威严。
      在这个脸谱中，红色不仅仅是肤色，更是“忠义千秋”的道德符号。
    `
  },
  {
    id: 'mask-002',
    title: '曹操·孟德',
    category: '京剧',
    imageUrl: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date('2023-02-15'),
    description: `
      【谱式】水白脸（奸脸）
      【色彩】白色（象征奸诈、多疑、阴险）
      【人物判词】宁教我负天下人，休教天下人负我。
      
      曹操的脸谱全脸涂白，只有眼圈、眉毛、鼻窝勾黑。这种极简的黑白对比，突出了人物性格中的冷酷与复杂。
      细看眉间，往往还会勾画淡淡的纹路，表现其生性多疑、眉头紧锁的神态。
    `
  },
  {
    id: 'mask-003',
    title: '孙悟空·美猴王',
    category: '昆曲',
    imageUrl: 'https://images.unsplash.com/photo-1599696874839-49774659b9a6?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date('2023-03-10'),
    description: `
      【谱式】象形脸
      【色彩】金/红（象征神幻、活泼、正义）
      【人物判词】金猴奋起千钧棒，玉宇澄清万里埃。
      
      孙悟空的脸谱是典型的“象形脸”，模仿猴子的面部特征。
      额头勾画“寿”字纹或桃形，眼圈用金色勾勒，名为“火眼金睛”。嘴部突出，展现猴子雷公嘴的特点，整体色彩绚丽，充满神话色彩。
    `
  },
  {
    id: 'mask-004',
    title: '包拯·包青天',
    category: '豫剧',
    imageUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84965d?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date('2023-04-05'),
    description: `
      【谱式】整脸
      【色彩】黑色（象征刚正不阿、铁面无私）
      【人物判词】关节不到，有阎罗包老。
      
      包拯是“黑脸”的代名词。黑色在戏曲中代表性格严肃、不苟言笑、刚直不阿。
      其额头正中通常画有“月牙”形，象征着他能够“日断阳，夜断阴”，拥有通神的断案能力。
    `
  },
  {
    id: 'mask-005',
    title: '窦尔敦',
    category: '京剧',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1661962360699-2321287b9247?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date('2023-05-20'),
    description: `
      【谱式】花三块瓦脸
      【色彩】蓝色（象征刚猛、桀骜不驯、有心计）
      
      窦尔敦的蓝脸非常著名。蓝色在京剧中通常赋予那些性格刚烈、武艺高强但又有些鲁莽或心计的草莽英雄。
      他的眉毛勾画得极具特色，双眉之间挂着兵器钩，暗示他善使双钩。
    `
  },
  {
    id: 'mask-006',
    title: '程咬金',
    category: '川剧',
    imageUrl: 'https://images.unsplash.com/photo-1603775020644-3d3f06e06aa7?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date('2023-06-01'),
    description: `
      【谱式】花脸
      【色彩】绿色（象征暴躁、勇猛、莽撞）
      
      绿脸在戏曲中并不多见，通常用于形容像程咬金这样性格暴躁、行事鲁莽但又有些可爱的绿林好汉。
      川剧中的变脸也常涉及绿色，代表情绪的剧烈波动或妖魔化的形象。
    `
  }
];