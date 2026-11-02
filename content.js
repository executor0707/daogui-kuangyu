/* 道诡异仙：诳语双界 — content
 * 场景 / 物件 / 知识 / NPC / 诳语 / 结局
 */
(function () {
  'use strict';

  // ---------- 物件 ----------
  // pair 表示跨界变形；crossing 时替换为另一形态。
  const items = {
    candy:      { name: '黑糖块',   real: 'candy',      pair: 'nail',   desc: '白灵淼塞给你的糖，还带着她手心的温度。', long: '在道诡它是一块甜得发苦的黑糖；带到现实，它就会变。' },
    nail:       { name: '锈铁钉',   cave: 'candy',      desc: '一根弯了的锈铁钉，是从糖块“变”过来的。', long: '现实里的铁钉，锁孔里能派上用场。' },
    jade:       { name: '圆玉佩',   pair: 'stone',      desc: '玄阳腰上的玉佩，云纹，凉。', long: '在道诡是上好的玉，在现实会变作一块灰扑扑的石头。' },
    stone:      { name: '灰石头',   pair: 'jade',       desc: '一块灰扑扑的石头，摸久了有点暖。', long: '收古董的说这是“老坑料”，出价四十万。' },
    yingshi:    { name: '荧石',     pair: 'shard',      desc: '碾碎的流光青石，发着冷青色的光。', long: '道诡的夜路全靠它；带到现实会变作镜片。' },
    shard:      { name: '镜片',     pair: 'yingshi',    desc: '一小片镜子的碎角，边缘磨得发亮。', long: '能反光，能照见不该照见的东西。' },
    heitai:     { name: '黑太岁肉', pair: 'pill',       desc: '一小团还在微微蠕动的黑色软肉。', long: '丹阳子用它压幻觉；带到现实会凝成一颗黑药丸。' },
    pill:       { name: '黑药丸',   pair: 'heitai',     desc: '一颗闻着腥甜的黑药丸。', long: '吃下去能压住幻觉，也会让你更离不开它。' },
    copper:     { name: '铜钱',     pair: null,         desc: '两枚磨得发亮的铜钱，玄阳藏私房钱的罐子里摸的。' },
    tianshu:    { name: '天书拓片', pair: null,         desc: '从石板上拓下来的一角经文，墨还没干透。', long: '丹阳子不识字，他认的是“天书”这两个字。' },
    note:       { name: '病历摘页', pair: null,         desc: '一张复印的病历：14 号床，第三次入院。' }
  };

  const knowledge = {
    sugar_paper:  { name: '糖纸上的字',   desc: '糖块在现实里化了，糖纸上留下一个不属于现实的压痕。' },
    record_third: { name: '第三次入院',   desc: '病历上写着：14 号床，第三次入院。前两家都没治好。' },
    dan_cannot_read: { name: '丹阳子不识字', desc: '他让人把天书念给他听。他认字，但只认“天书”两个字。' },
    tianshu_stolen: { name: '天书是抢来的', desc: '丹阳子自己说的：抢不过就搭伙，搭伙不过就下药。' },
    heitai_works: { name: '黑太岁压幻觉', desc: '每月初一吃一口黑太岁，幻觉就能压下去。' },
    recipe:       { name: '假丹方',       desc: '红丹、肉丹、黑丹各一颗，子时服下，可“成仙”。你自己编的。' },
    jade_worth:   { name: '玉佩值钱',     desc: '收古董的看了一眼，说“老坑料”，出价四十万。' },
    yang_wait:    { name: '杨娜在等',     desc: '她说：好好治病，我等你。' },
    xuanyang_fear: { name: '玄阳怕游老爷', desc: '玄阳说漏了嘴：丹阳子最怕游老爷，铜铃一响他就得让路。' },
    bailing_fear: { name: '白灵淼怕黑',   desc: '她怕黑，怕一个人被留在料房。' },
    director_fears: { name: '李医生在写论文', desc: '他反复问“幻觉的长度”，像在收集数据。' }
  };

  const npcs = {
    zhang:     { name: '张护士',  desc: '夜班，脾气不好，最怕交班出岔子。' },
    doctor:    { name: '李医生',  desc: '你的主治医师，说话温和，记录得很细。' },
    danyang:   { name: '丹阳子',  desc: '癞子头，清风观观主，要成仙。' },
    xuanyang:  { name: '玄阳',    desc: '记名弟子，穿洗白了的青道袍，腰上挂着玉佩。' },
    bailing:   { name: '白灵淼',  desc: '白化病少女，你救过她一次。' }
  };

  const locations = {
    ward:     { name: '14 号病房', world: 'real', art: 'ward', caption: '白墙、铁床、一盏没关的夜灯' },
    corridor: { name: '住院部走廊', world: 'real', art: 'corridor', caption: '消毒水味，护士站的灯还亮着' },
    utility:  { name: '杂物间', world: 'real', art: 'utility', caption: '拖把、旧病历、一台洗胃机' },
    liaofang: { name: '料房', world: 'cave', art: 'liaofang', caption: '捣药声，荧石的青光，大通铺上的鼾声' },
    danfang:  { name: '丹房外', world: 'cave', art: 'danfang', caption: '五层黑丹炉像一座金属小山' },
    xuanyang: { name: '玄阳住处', world: 'cave', art: 'xuanyang', caption: '单人石床，一件搭在石凳上的青道袍' },
    cave:     { name: '洞口', world: 'cave', art: 'cave', caption: '大年初一，第一缕晨光' }
  };

  // ---------- 工具 ----------
  const K = (g, id) => g.hasKnowledge(id);
  const addK = (g, id) => g.addKnowledge(id);
  const F = (g, k) => g.hasFlag(k);

  // ---------- 场景 ----------
  const scenes = {
    // ===== 第一幕 =====
    ward: {
      location: 'ward', act: 1, title: '熄灯之后',
      objective: '把玉佩藏好，赶在查房前回到床上。',
      text: `<p>熄灯已经半小时。走廊的灯从门缝里漏进来，把病房切成两半。</p>
        <p>你躺在床上，手心里还攥着白天那块糖化开后的黏。隔壁床在磨牙，监护仪的滴答声一下一下，像谁在敲木鱼。</p>
        <p>床头柜上放着你的饭盒。可你记得很清楚——刚才它还在溶洞里，是一只捣药罐。</p>`,
      actions: [
        { id: 'observe_ward', label: '借着走廊的灯，仔细看看这间病房', cost: { time: 1 }, effect: g => { addK(g, 'sugar_paper'); g.log('床头柜上有半张糖纸，压痕是新的。你记得自己没买过这种糖。', 'result'); }, result: { text: '糖纸上的压痕拼出一个歪歪扭扭的“淼”字。' } },
        { id: 'take_candy', label: '把手心里的糖块放进嘴里', effect: g => { g.addKnowledge('sugar_paper'); g.log('甜味在舌根化开，苦得发涩。你忽然想起白灵淼把手缩回去的样子。', 'result'); } },
        { id: 'under_bed', label: '摸一摸床底', effect: g => { g.addKnowledge('record_third'); g.log('床底粘着一张病历复印件：14 号床，第三次入院。', 'result'); } },
        { id: 'call_nurse', label: '按床头的红色按钮', cost: { time: 1 }, result: { text: '广播响了两声，脚步声由远及近。你赶紧把手缩回被子里。', suspicion: { zhang: 1 } } },
        { id: 'sleep', label: '闭上眼，回到那边', cost: {}, effect: g => { g.crossTo('liaofang'); } }
      ],
      exits: [
        { label: '下床，走到门口', to: 'corridor', cond: { noFlag: 'ward_locked' } }
      ]
    },

    corridor: {
      location: 'corridor', act: 1, title: '护士站的灯',
      objective: '拿到能开药柜的东西，别让张护士记住你的脸。',
      text: `<p>走廊很长，两侧病房的门都关着。护士站亮着一盏台灯，张护士背对着你，正在写交班记录。</p>
        <p>台灯旁边挂着一串钥匙，金属的反光一闪一闪。</p>
        <p>再往里，是杂物间和上锁的药柜。药柜上的锁是老的，锁孔很大。</p>`,
      actions: [
        { id: 'observe_zhang', label: '躲在拐角，观察张护士', cost: { time: 1 }, effect: g => { addK(g, 'director_fears'); g.log('她在本子上写：14 号床，夜间离床两次。', 'result'); } },
        { id: 'take_keys', label: '趁她低头，伸手去够钥匙串', cost: { time: 1 }, result: { text: '你的指尖刚碰到钥匙，她忽然咳嗽了一声。你缩回手，心跳得像打鼓。', suspicion: { zhang: 2 } }, cond: {} },
        { id: 'to_liaofang', label: '靠在墙上，闭上眼', effect: g => { g.crossTo('liaofang'); } },
        { label: '回病房', to: 'ward', exit: true }
      ],
      exits: [
        { label: '推开杂物间的门', to: 'utility' },
        { label: '回病房', to: 'ward' }
      ]
    },

    utility: {
      location: 'utility', act: 1, title: '杂物间',
      objective: '找到能撬开药柜锁的东西。',
      text: `<p>杂物间没有窗。拖把靠在墙角，旧病历堆在铁架子上，落了一层灰。</p>
        <p>一台洗胃机停在最里面，胶皮管盘在挂钩上，像一条睡着的蛇。</p>`,
      actions: [
        { id: 'take_tube', label: '剪一段胶皮管', effect: g => { g.addKnowledge('record_third'); g.log('你剪下一截胶皮管，顺手翻了翻旁边的旧病历。', 'result'); } },
        { id: 'read_records', label: '翻旧病历', cost: { time: 1 }, effect: g => { addK(g, 'record_third'); addK(g, 'director_fears'); g.log('一本本病历，同一个名字，三种笔迹。最后一页写着“建议会诊”。', 'result'); } },
        { id: 'nap', label: '靠着墙打个盹', effect: g => { g.crossTo('liaofang'); } }
      ],
      exits: [{ label: '回走廊', to: 'corridor' }]
    },

    liaofang: {
      location: 'liaofang', act: 1, title: '料房',
      objective: '弄清玉佩在哪，再想办法把它带回那边。',
      text: `<p>你睁开眼。溶洞的潮气扑在脸上，石壁上嵌着几块发青的荧石，把所有人的影子拉得很长。</p>
        <p>捣药声停了。大通铺上的人睡成一片，鼾声、磨牙声、有人在梦里哭。</p>
        <p>白灵淼缩在最里面，抱着一只空药罐。她没睡，看见你睁眼，眼睛亮了一下。</p>`,
      actions: [
        { id: 'take_yingshi', label: '从石壁上掰一块荧石', effect: g => { g.addItem('yingshi'); g.log('荧石在手里发着冷光。有了它，夜里才看得见路。', 'result'); } },
        { id: 'talk_bailing', label: '走过去，和白灵淼说话', cost: { time: 1 }, effect: g => { addK(g, 'bailing_fear'); g.log('“李师兄，你又要走吗？”她把药罐抱得更紧了。', 'result'); } },
        { id: 'ask_xuanyang', label: '问白灵淼：玄阳今晚在哪', cost: { time: 1 }, cond: {}, effect: g => { addK(g, 'xuanyang_fear'); g.log('“玄阳师兄被师傅叫去念天书了，一晚上都不在。”她顿了顿，“他腰上那块玉，值好多钱。”', 'result'); } },
        { id: 'wake_up', label: '睁眼，回到医院', effect: g => { g.crossTo('ward'); } }
      ],
      exits: [
        { label: '摸黑去玄阳住处', to: 'xuanyang', cond: { item: 'yingshi' } },
        { label: '往丹房那边走', to: 'danfang' }
      ]
    },

    xuanyang: {
      location: 'xuanyang', act: 1, title: '玄阳住处',
      objective: '把玉佩弄到手。',
      text: `<p>玄阳的住处比料房大得多，一张单人石床，石凳上搭着一件洗得发白的青道袍。</p>
        <p>道袍的腰带垂下来，玉佩就挂在那里。荧石的光一照，云纹里像有东西在动。</p>`,
      actions: [
        { id: 'take_jade', label: '解下玉佩，揣进怀里', effect: g => { g.addItem('jade'); g.log('玉佩入手冰凉。你听见自己的心跳。', 'result'); }, cond: { item: 'yingshi' } },
        { id: 'take_copper', label: '翻一翻石床底下', effect: g => { g.addItem('copper'); g.log('床底下有个小陶罐，里面是两枚铜钱。', 'result'); } },
        { id: 'observe_danfang', label: '贴着石壁，听丹房那边的动静', cost: { time: 1 }, effect: g => { addK(g, 'dan_cannot_read'); addK(g, 'tianshu_stolen'); g.log('丹阳子在骂人：“念！接着念！道爷我要是识得这些字，还用得着你们？”', 'result'); } },
        { id: 'back', label: '回料房', to: 'liaofang' }
      ],
      exits: [{ label: '回料房', to: 'liaofang' }]
    },

    danfang: {
      location: 'danfang', act: 1, title: '丹房外',
      objective: '听清楚丹阳子到底想要什么。',
      text: `<p>丹房里透出火光。五层黑丹炉像一座金属小山，炉口吐着暗红色的光。</p>
        <p>丹阳子蹲在炉边，用一把小刀刮自己的癞子头，一边刮一边嘀咕。</p>`,
      actions: [
        { id: 'listen', label: '贴着门缝听', cost: { time: 1 }, effect: g => { addK(g, 'dan_cannot_read'); addK(g, 'tianshu_stolen'); g.log('“天书……成仙……只差一个识字的。”他把刀在头皮上蹭了蹭。', 'result'); } },
        { id: 'look_hei', label: '看炉子旁边那口黑鼎', effect: g => { addK(g, 'heitai_works'); g.log('鼎里养着一团黑乎乎的东西，正一缩一缩地呼吸。是黑太岁。', 'result'); } },
        { id: 'back', label: '回料房', to: 'liaofang' }
      ],
      exits: [{ label: '回料房', to: 'liaofang' }]
    },

    // ===== 第二幕 =====
    act2_danfang: {
      location: 'danfang', act: 2, title: '丹房',
      objective: '让丹阳子相信你的“成仙功法”，别让白灵淼成为药引。',
      text: `<p>第二天。丹阳子把所有人都赶到了丹房，石桌上摆着三只碗：红丹、肉丹、黑丹。</p>
        <p>“娃啊，”他用指甲剔着牙，“道爷我识字不多。你念，念完了，道爷先吃。”</p>
        <p>白灵淼被两个道童按在角落里。她看着你，摇了摇头。</p>`,
      actions: [
        { id: 'read_tianshu', label: '看石桌上的天书拓片', cost: { time: 1 }, effect: g => { addK(g, 'recipe'); g.addItem('tianshu', true); g.log('拓片上的字你认得大半。那不是功法，是一段劝人向善的经文。你顺手把它折好，揣进袖子里。', 'result'); } },
        { id: 'look_wound', label: '看看白灵淼的胳膊', effect: g => { addK(g, 'bailing_fear'); g.log('她的胳膊上有一道新划的口子，血已经凝了。', 'result'); } },
        { id: 'talk_danyang', label: '开口，对丹阳子说', cond: {}, effect: g => { g.openKuangyu('danyang'); } },
        { id: 'take_heitai', label: '趁人不注意，割一块黑太岁肉', cond: { minTime: 1 }, cost: { time: 1, daoyun: 1 }, effect: g => { g.addItem('heitai'); }, result: { text: '黑太岁的肉在袖子里动了一下，你起了一身鸡皮疙瘩。' } },
        { id: 'eat_pill', label: '抓起红丹，自己吞下去', cost: {}, effect: g => { g.setFlag('ate_pill'); g.setEnding('end_coma'); }, result: { text: '丹药入口即化，一股铁锈味顺着喉咙烧下去。你听见丹阳子在很远的地方喊你的名字。' } }
      ],
      exits: [
        { label: '找白灵淼说话', to: 'act2_liaofang' },
        { label: '去玄阳住处', to: 'act2_xuanyang', cond: { noFlag: 'xuanyang_gone' } }
      ]
    },

    act2_liaofang: {
      location: 'liaofang', act: 2, title: '料房',
      objective: '决定要不要答应带白灵淼走。',
      text: `<p>料房空了大半。道童们都被叫去丹房，只剩白灵淼一个人坐在通铺边，手里攥着一小块糖。</p>
        <p>“李师兄，”她抬头看你，“你是不是又要走？”</p>`,
      actions: [
        { id: 'promise', label: '答应她：走的时候带上你', cost: { time: 1 }, effect: g => { g.setFlag('promise_bailingmiao'); g.log('她笑了一下，把糖掰成两半，塞给你一半。', 'result'); g.addKnowledge('bailing_fear'); } },
        { id: 'refuse', label: '摇头：我连自己都带不走', cost: { time: 1 }, result: { text: '她低下头，把糖收进袖子里，什么也没说。', suspicion: {} } },
        { id: 'ask_blood', label: '问她：丹阳子是不是要你的血', cost: { time: 1 }, effect: g => { addK(g, 'recipe'); g.log('“他说……药引的血最灵。”她的声音很轻。', 'result'); } },
        { id: 'back', label: '回丹房', to: 'act2_danfang' }
      ],
      exits: [{ label: '回丹房', to: 'act2_danfang' }]
    },

    act2_xuanyang: {
      location: 'xuanyang', act: 2, title: '玄阳住处',
      objective: '从玄阳嘴里撬出点东西。',
      text: `<p>玄阳正在收拾包袱。看见你进来，他手一抖，把一块碎银子掉在地上。</p>
        <p>“玄阳师兄，这是要走？”</p>
        <p>他盯着你，忽然压低声音：“你腰里那块玉，还我。不然我告诉师傅，你夜里出过料房。”</p>`,
      actions: [
        { id: 'bribe', label: '把铜钱拍在石床上', cost: { time: 1 }, cond: { item: 'copper' }, effect: g => { g.removeItem('copper'); addK(g, 'xuanyang_fear'); g.setFlag('xuanyang_bribed'); g.log('玄阳把铜钱拢进袖子，脸色缓了下来：“师傅最怕游老爷。铜铃一响，他连头都不敢抬。”', 'result'); } },
        { id: 'threaten', label: '告诉他：你偷玉佩的事，我也知道', cost: { time: 1 }, result: { text: '玄阳的脸白了。他退了一步，撞在石壁上。', suspicion: { xuanyang: 2 }, } },
        { id: 'back', label: '回丹房', to: 'act2_danfang' }
      ],
      exits: [{ label: '回丹房', to: 'act2_danfang' }]
    },

    // ===== 第三幕 =====
    act3_cave: {
      location: 'cave', act: 3, title: '大年初一',
      objective: '决定带谁、带什么，走出这个洞口。',
      text: `<p>天刚亮。洞口的风灌进来，带着雪和松针的味道。</p>
        <p>身后是烧了一夜的清风观，浓烟笔直地升上去。白灵淼站在你旁边，眼睛被晨光照得睁不开，用布条蒙着。</p>
        <p>你摸了摸怀里——只有一件东西的位置。</p>`,
      actions: [
        { id: 'count', label: '回头点一点人数', cost: { time: 1 }, effect: g => { g.log('活着出来的人，比进去的时候少了一半。', 'result'); } },
        { id: 'give_sugar', label: '把最后半块糖放进白灵淼手里', cond: { item: 'candy' }, effect: g => { g.removeItem('candy'); g.setFlag('gave_sugar'); g.log('她捏着糖，没吃，只是攥着。', 'result'); } },
        { id: 'take_tablet', label: '回丹房废墟，把天书石板背出来', cost: { time: 1, daoyun: 1 }, effect: g => { g.setFlag('tianshu_tablet'); g.addKnowledge('recipe'); g.log('石板很重。你把它背在背上，压得直不起腰。', 'result'); } },
        { id: 'bring_bailing', label: '牵起白灵淼的手', cost: { time: 1 }, effect: g => { g.setFlag('with_bailingmiao'); g.log('她的手很凉，但握得很紧。', 'result'); } },
        { id: 'close_eyes', label: '最后闭一次眼', effect: g => { g.crossTo('act3_real'); } }
      ],
      exits: [
        { label: '回清风观废墟看看', to: 'act3_ruins', cond: { minTime: 1 } }
      ]
    },

    act3_ruins: {
      location: 'danfang', act: 3, title: '丹房废墟',
      objective: '再拿一件能证明“那边”存在的东西。',
      text: `<p>丹房的顶塌了一半。黑丹炉歪在地上，炉膛里还有暗红的炭。</p>
        <p>地上散着丹阳子的碎骨头，和一枚被炸瘪的铜铃。</p>`,
      actions: [
        { id: 'take_bell', label: '捡起铜铃', effect: g => { g.addItem('copper'); g.setFlag('has_bell'); g.log('铜铃瘪了，摇起来只剩沙沙声。', 'result'); } },
        { id: 'take_tablet2', label: '用剑撬下巴掌大的一块天书', cost: { time: 1, daoyun: 1 }, effect: g => { g.setFlag('tianshu_tablet'); g.addKnowledge('recipe'); g.log('石片上的字在晨光里像活的。', 'result'); } },
        { id: 'back', label: '回洞口', to: 'act3_cave' }
      ],
      exits: [{ label: '回洞口', to: 'act3_cave' }]
    },

    act3_real: {
      location: 'ward', act: 3, title: '清晨的病房',
      objective: '说最后一句话。',
      text: `<p>你睁开眼。病房的窗帘被风吹起来一角，晨光斜斜地落在地板上。</p>
        <p>李医生站在床边，手里拿着记录板。杨娜坐在床尾，眼睛红着。</p>
        <p>“小李，”李医生说，“你这次睡了两天。你愿意跟我说说，你看见了什么吗？”</p>
        <p>你知道，接下来这句话，会被写进病历，会被记住很久。</p>`,
      actions: [
        { id: 'final_doctor', label: '对李医生说：那些都是幻觉', effect: g => { g.finalLie('doctor'); } },
        { id: 'final_bailing', label: '对白灵淼说：跟我走', cond: { flag: 'with_bailingmiao' }, effect: g => { g.finalLie('bailing'); } },
        { id: 'final_self', label: '对自己说：两边都有鬼', cond: { minDaoyun: 3 }, effect: g => { g.finalLie('self'); } },
        { id: 'final_yang', label: '对杨娜说：我没病', effect: g => { g.finalLie('yang'); } }
      ],
      exits: []
    }
  };

  // 场景别名：交界处与行动内跳转
  scenes.act2_liaofang.location = 'liaofang';
  scenes.act2_xuanyang.location = 'xuanyang';
  scenes.act3_ruins.location = 'danfang';

  // ---------- 跨界 ----------
  const pairs = { candy: 'nail', nail: 'candy', jade: 'stone', stone: 'jade', yingshi: 'shard', shard: 'yingshi', heitai: 'pill', pill: 'heitai' };

  // ---------- 诳语：张护士 ----------
  const kuangyu = {
    zhang: {
      target: 'zhang',
      line: '她把手电照在你脸上：“14 号床，这个点你不在床上，在走廊干什么？”',
      claims: [
        {
          id: 'toilet', intent: 'claim_innocence', label: '“我去厕所，走错了。”', weight: 1, likes: ['record_third'],
          outcomes: {
            believe: { text: '“厕所在那头。”她用手电指了指，又看了你一眼，“回去吧，下回按铃叫人。”', belief: 1 },
            half: { text: '“走错？”她哼了一声，“你上礼拜也说走错。回去。”', suspicion: 1 },
            reject: { text: '“厕所在那头，你已经走过去三回了。”她把手电往下压了压。', suspicion: 1 },
            caught: { text: '“你病历上写着呢，夜间离床三次。”她的声音冷下来。', suspicion: 2 }
          }
        },
        {
          id: 'sleepwalk', intent: 'claim_innocence', label: '“我睡着了，自己走出来的。”', weight: 1,
          outcomes: {
            believe: { text: '“梦游？”她嘟囔了一句，在本子上记了什么，“回去睡。”', belief: 1 },
            half: { text: '“梦游还能走到杂物间？”她半信半疑，但没再问。', suspicion: 1 },
            reject: { text: '“你骗谁呢。”她拿手电敲了敲门框。', suspicion: 1 },
            caught: { text: '“梦游的人不会躲着人走。”', suspicion: 2 }
          }
        },
        {
          id: 'looking_for_medicine', intent: 'claim_obedience', label: '“我睡不着，想找您要片药。”', weight: 1,
          outcomes: {
            believe: { text: '“明天再说。”她语气缓了些，“回去躺着。”', belief: 1 },
            half: { text: '“药不能乱吃。”她看了看你，还是让你回去了。', suspicion: 0 },
            reject: { text: '“你上次也是这么说的，转头就把药吐了。”', suspicion: 1 },
            caught: { text: '“你嘴里还含着东西呢。”她伸手来掰你的下巴。', suspicion: 2 }
          }
        },
        {
          id: 'showed_jade', intent: 'fabricate', label: '摊开手：“您看，我捡到一块玉。”', weight: 0, likes: ['jade', 'stone'],
          outcomes: {
            believe: { text: '她拿起玉佩翻来覆去地看，脸色变了：“这东西……哪来的？算了，明天交给护士长。”她把玉揣进兜里。', belief: 1, flag: { jade_lost: true } },
            half: { text: '“捡的？”她盯着你，“放我这儿，明天再说。”她把玉拿走了。', flag: { jade_lost: true }, suspicion: 1 },
            reject: { text: '“大半夜捡玉？”她伸手要夺，你往后一缩。', suspicion: 2 },
            caught: { text: '“14 号床，你手里拿的什么？张开。”', suspicion: 2 }
          },
          consume: 'jade'
        }
      ]
    },

    // ---------- 诳语：丹阳子 ----------
    danyang: {
      target: 'danyang',
      line: '丹阳子把三只碗推到你面前：“娃啊，你说，这丹该怎么吃？道爷我听着。”',
      claims: [
        {
          id: 'master_eats', intent: 'claim_obedience', label: '“师傅先吃。徒弟的命是师傅给的，师傅成了仙，徒弟才能跟着。”', weight: 3,
          outcomes: {
            believe: { text: '丹阳子咧开嘴，露出黄牙：“好娃，道爷没白疼你。”他抓起红丹，一口吞了。', belief: 1, flag: { danyang_ate: true } },
            half: { text: '他眯着眼看你：“你先吃一口，道爷看着。”', suspicion: 1 },
            reject: { text: '“你当道爷傻？”他把碗往你面前一推。', suspicion: 2 },
            caught: { text: '“你袖子里藏的什么？拿出来。”', suspicion: 2 }
          }
        },
        {
          id: 'scripture', intent: 'fabricate', label: '“天书上写的不是丹方，是经文。念错了，仙就接不走人。”', weight: 3, likes: ['tianshu'],
          outcomes: {
            believe: { text: '丹阳子愣住了。他看看天书，又看看你，忽然大笑：“难怪道爷总差一口气！”他把三颗丹都倒进嘴里。', belief: 2, flag: { danyang_ate: true } },
            half: { text: '“经文？”他挠了挠癞子头，“那你说，念到哪一句该吃？”', suspicion: 1 },
            reject: { text: '“放屁！道爷抢来的东西，能是经文？”', suspicion: 2 },
            caught: { text: '“你认得字，你当然这么说。”他的眼神冷下来。', suspicion: 2 }
          }
        },
        {
          id: 'black_tai', intent: 'fabricate', label: '“黑太岁是药引，得先喂给师傅，才能压住丹毒。”', weight: 2, likes: ['heitai', 'pill'],
          outcomes: {
            believe: { text: '丹阳子盯着那团黑肉，喉结动了动。他抓起来塞进嘴里，嚼得满嘴黑水。', belief: 1, flag: { danyang_ate: true }, daoyun: 1 },
            half: { text: '“你先尝一口。”他把黑太岁推过来。', suspicion: 1 },
            reject: { text: '“道爷吃了几十年，还用你教？”', suspicion: 2 },
            caught: { text: '“这东西你从哪儿弄来的？”他忽然问。', suspicion: 2 }
          },
          consume: 'heitai'
        },
        {
          id: 'bell', intent: 'deflect', label: '“师傅，您听——外头有铃铛响。”', weight: 1, likes: ['copper'],
          outcomes: {
            believe: { text: '丹阳子的手一抖，铜碗掉在地上。他猛地扭头去看门口。你趁机把红丹换成了黑丹。', belief: 1, flag: { swapped_pill: true } },
            half: { text: '他侧耳听了听，什么也没有，回头瞪你：“别耍花样。”', suspicion: 1 },
            reject: { text: '“游老爷？”他冷笑，“道爷就是游老爷的爷爷。”', suspicion: 1 },
            caught: { text: '“你手里的铜铃，是道爷的吧？”', suspicion: 2 }
          }
        }
      ]
    }
  };

  // ---------- 幕结算 ----------
  // 把诳语挂到对应场景
  const kuangyuScene = { zhang: 'corridor', danyang: 'act2_danfang' };
  Object.keys(kuangyu).forEach(t => {
    const sid = kuangyuScene[t];
    if (sid && scenes[sid]) {
      scenes[sid].kuangyu = scenes[sid].kuangyu || [];
      scenes[sid].kuangyu.push(kuangyu[t]);
    }
  });

  const actEnd = {
    1(g) {
      // 幕 1 结束：进入张护士对质（如果尚未发生）
      if (!g.hasFlag('zhang_confront')) {
        g.setFlag('zhang_confront');
        g.state.scene = 'corridor';
        g.state.time = 0;
        g.log('走廊尽头传来脚步声。张护士站在那儿，手电照在你脸上。', 'act');
        g.openKuangyu('zhang');
        return;
      }
      if (g.panel) return;
      if (!g.hasFlag('zhang_done')) return;
      g.gotoAct(2);
    },
    2(g) {
      if (g.hasFlag('danyang_ate')) {
        g.setFlag('danyang_dead');
        g.log('丹阳子的身体在三声大笑里裂开：三张血肉大嘴从裂开的脑袋里伸出来，羽毛像尖刺一样从皮下钻出。随后一声炸响，血肉溅满了丹炉。', 'act');
        g.gotoAct(3);
      } else {
        g.state.ending = { id: 'fail_yaoyin', kind: 'fail' };
        g.render();
      }
    },
    3(g) {
      g.resolveEnding();
    }
  };

  // ---------- 结局 ----------
  const endings = {
    end_cured: {
      title: '病好了',
      text: `<p>李医生在病历上写下：患者对幻觉内容有完整叙述，情绪稳定，建议继续观察。</p>
        <p>杨娜握住你的手，掌心是热的。窗外有公交进站的声音。你说你想喝粥。</p>
        <p>出院那天，你把那块灰石头留在了床头柜上。护士问这是什么，你说，路上捡的。</p>
        <p>你再也没有梦见溶洞。偶尔半夜醒来，会觉得自己忘了一个很重要的人，但想不起来是谁。</p>
        <p class="end-note">——你选择了这边。代价是那边从此不存在。</p>`
    },
    end_stayed: {
      title: '回不去了',
      text: `<p>你牵着白灵淼的手走出洞口。晨光很亮，她眯着眼，把布条往上拉了拉。</p>
        <p>身后清风观的浓烟一直升到天上。丹阳子死了，长明长仁死了，玄阳跑了，剩下的人各自散进林子。</p>
        <p>“李师兄，你家在哪？”她问。</p>
        <p>你张了张嘴，没说出话。你想不起医院的样子了，只记得一张很白的床，和一个在公交站台上回头笑的人。</p>
        <p>你们往山下走。雪化了，路很泥。</p>
        <p class="end-note">——你选择了这边。代价是那边再也回不去。</p>`
    },
    end_both: {
      title: '两边都有鬼',
      text: `<p>“都是真的。”你说。</p>
        <p>李医生的笔停了一下。他抬起头，看着你，像在判断这句话该写进哪一栏。</p>
        <p>病房的窗户上，映出洞口的天光。白灵淼的影子站在晨光里，杨娜的影子坐在床尾。两个影子都没有动。</p>
        <p>你忽然明白：它们不会为了你，变成同一个。</p>
        <p>“那你就得一直这样活着。”李医生最后说。</p>
        <p>“嗯。”你说，“我知道。”</p>
        <p class="end-note">——你谁也没有选。代价是你谁也不能完全属于。死者没有回来，但他们都还在。</p>`
    },
    end_delirium: {
      title: '谵妄',
      kind: 'fail',
      text: `<p>你分不清手心里是玉佩还是石头，分不清耳边是捣药声还是监护仪。</p>
        <p>你笑了一下，觉得这样也挺好——至少不用再选了。</p>
        <p>护士冲进来的时候，你正对着白墙喊“师傅”。</p>
        <p class="end-note">道韵满了。你被两边同时吞了进去。</p>`
    },
    end_coma: {
      title: '洗胃',
      text: `<p>你醒来的时候，喉咙里插着一根胶皮管。李医生站在床边，脸色很难看。</p>
        <p>“你胃里那些东西，我们化验不出成分。”他说，“小李，你到底吃了什么？”</p>
        <p>你想说“红丹、肉丹、黑丹”，但嘴里只有苦味。你忽然很想笑：丹阳子说得对，这药确实能让人“成仙”——成个躺在病床上的仙。</p>
        <p>窗外的天很白。你分不清那是医院的天，还是溶洞外的天。</p>
        <p class="end-note">你替师傅试了药。这一局，没有赢家。</p>`
    },
    fail_zhang: {
      title: '约束带',
      kind: 'fail',
      text: `<p>张护士按了铃。两个男护工进来，把你按在床上。</p>
        <p>“14 号床，夜间离床、拒绝服药、随身携带不明物品。”她一条一条念，像在念判决书。</p>
        <p>束缚带收紧的时候，你听见很远的地方有人在叫“李师兄”。</p>
        <p class="end-note">你被这边留住了。这一夜，只能到这儿。</p>`
    },
    fail_doctor: {
      title: '转院',
      kind: 'fail',
      text: `<p>李医生合上记录板：“小李，我们可能是时候换个地方了。”</p>
        <p>你被推进车里。车窗外，杨娜追着跑了几步，又被红灯拦下。</p>
        <p>第四家医院的白墙，和前三家一模一样。</p>
        <p class="end-note">你被这边送走了。这一夜，只能到这儿。</p>`
    },
    fail_yaoyin: {
      title: '药引',
      kind: 'fail',
      text: `<p>丹阳子把你按在丹炉边。他的指甲很长，掐进你的胳膊。</p>
        <p>“娃啊，你不是最会编吗？再编一个给道爷听听。”</p>
        <p>白灵淼在角落里哭。你想说点什么，但喉咙里只有血的味道。</p>
        <p class="end-note">你没能骗过他。这一夜，只能到这儿。</p>`
    }
  };

  // ---------- 导出 ----------
  window.CONTENT = {
    items, knowledge, npcs, locations, scenes, kuangyu, actEnd, endings, pairs,
    actStart: { 1: 'ward', 2: 'act2_danfang', 3: 'act3_cave' },
    actTitles: { 1: '糖', 2: '丹', 3: '年' },
    // 结局判定
    resolve(g) {
      const s = g.state;
      const fin = s.finalLie;
      const evidence = ['jade', 'stone', 'tianshu', 'tianshu_tablet', 'copper', 'shard', 'yingshi'].filter(id => g.hasItem(id) || g.hasFlag(id));
      const knowsBoth = g.hasKnowledge('sugar_paper') && g.hasKnowledge('recipe') && (g.hasItem('jade') || g.hasItem('stone') || g.hasFlag('tianshu_tablet'));
      if (fin === 'doctor') return 'end_cured';
      if (fin === 'bailing') return g.hasFlag('with_bailingmiao') ? 'end_stayed' : 'end_both';
      if (fin === 'self' && (knowsBoth || evidence.length >= 2)) return 'end_both';
      if (fin === 'self') return 'end_cured';
      if (fin === 'yang') {
        // “我没病”：根据是否握有跨界证物，走“两边”或“回不去”
        if (knowsBoth) return 'end_both';
        return 'end_stayed';
      }
      return 'end_cured';
    }
  };
})();

