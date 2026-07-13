import type { Movie } from "@/types/media"

const P = (name: string) => `/images/poster-${name}.png`
const B = (name: string) => `/images/backdrop-${name}.png`

/**
 * 8 部影片作为规范 mock 数据，覆盖不同的聚合状态与画质组合。
 * 同一部影片可出现在多个内容行中（推荐 / 最近入库 / 待补 4K 等）。
 */
export const MOVIES: Movie[] = [
  {
    id: 1,
    tmdbId: 693134,
    title: "星海拓荒",
    originalTitle: "Nebula Frontier",
    overview:
      "在人类跨越星门的时代，一支孤独的探测队深入未知星云，试图唤醒沉睡数百年的殖民舰。当信号从虚空深处传来，他们必须在真相与生存之间做出抉择。",
    posterUrl: P("nebula"),
    backdropUrl: B("nebula"),
    releaseYear: 2024,
    runtimeMinutes: 148,
    voteAverage: 8.6,
    genres: [
      { id: 878, name: "科幻" },
      { id: 12, name: "冒险" },
    ],
    status: "in_library",
    qualities: ["4k", "hdr", "dolby_vision"],
    favorited: true,
  },
  {
    id: 2,
    tmdbId: 545611,
    title: "霓虹雨夜",
    originalTitle: "Neon Rain",
    overview:
      "一名疲惫的私家侦探在永不停歇的雨夜城市里追查一桩失踪案，霓虹灯下的每一次转身都藏着谎言与救赎。",
    posterUrl: P("noir"),
    backdropUrl: B("noir"),
    releaseYear: 2023,
    runtimeMinutes: 121,
    voteAverage: 7.9,
    genres: [
      { id: 80, name: "犯罪" },
      { id: 53, name: "惊悚" },
    ],
    status: "downloading",
    qualities: ["1080p"],
    favorited: true,
  },
  {
    id: 3,
    tmdbId: 120,
    title: "群山之王",
    originalTitle: "Kingdom of Peaks",
    overview:
      "被放逐的王子踏上归乡之路，穿越雾气缭绕的群山，只为夺回属于自己的王座，也为唤醒一个沉睡已久的古老盟约。",
    posterUrl: P("fantasy"),
    backdropUrl: B("fantasy"),
    releaseYear: 2022,
    runtimeMinutes: 165,
    voteAverage: 8.2,
    genres: [
      { id: 14, name: "奇幻" },
      { id: 12, name: "冒险" },
    ],
    status: "in_library",
    qualities: ["4k", "hdr"],
    favorited: false,
  },
  {
    id: 4,
    tmdbId: 12444,
    title: "归乡家书",
    originalTitle: "The Last Letter",
    overview:
      "战火纷飞的年代，一封辗转数年的家书成为一名士兵与故乡之间唯一的联系。它承载的思念，能否跨越硝烟抵达彼岸。",
    posterUrl: P("drama"),
    backdropUrl: B("fantasy"),
    releaseYear: 2021,
    runtimeMinutes: 133,
    voteAverage: 7.6,
    genres: [
      { id: 18, name: "剧情" },
      { id: 10752, name: "战争" },
    ],
    status: "in_radarr",
    qualities: [],
    favorited: true,
  },
  {
    id: 5,
    tmdbId: 76600,
    title: "深蓝之息",
    originalTitle: "Breath of the Blue",
    overview:
      "跟随一头座头鲸横跨大洋的迁徙之旅，镜头潜入光影交错的深海，记录下这颗蓝色星球最壮丽也最脆弱的生命律动。",
    posterUrl: P("ocean"),
    backdropUrl: B("nebula"),
    releaseYear: 2024,
    runtimeMinutes: 98,
    voteAverage: 8.9,
    genres: [{ id: 99, name: "纪录片" }],
    status: "in_library",
    qualities: ["1080p"],
    favorited: false,
  },
  {
    id: 6,
    tmdbId: 27205,
    title: "长廊尽头",
    originalTitle: "End of the Corridor",
    overview:
      "一位记忆研究员被困在一栋没有出口的建筑里，每走过一条走廊，过去的真相就重组一次。她能否在崩溃前找到属于自己的门。",
    posterUrl: P("thriller"),
    backdropUrl: B("noir"),
    releaseYear: 2023,
    runtimeMinutes: 117,
    voteAverage: 7.4,
    genres: [
      { id: 53, name: "惊悚" },
      { id: 9648, name: "悬疑" },
    ],
    status: "searching",
    qualities: [],
    favorited: true,
  },
  {
    id: 7,
    tmdbId: 129,
    title: "提灯节",
    originalTitle: "Lantern Festival",
    overview:
      "在一年一度的提灯节前夜，一个走失的孩子与一台会做梦的旧机器人相遇，他们一起追逐漫天升起的灯火，寻找回家的方向。",
    posterUrl: P("animation"),
    backdropUrl: B("fantasy"),
    releaseYear: 2022,
    runtimeMinutes: 104,
    voteAverage: 8.4,
    genres: [
      { id: 16, name: "动画" },
      { id: 10751, name: "家庭" },
    ],
    status: "in_library",
    qualities: ["4k", "hdr", "dolby_vision"],
    favorited: false,
  },
  {
    id: 8,
    tmdbId: 9340,
    title: "极速海岸",
    originalTitle: "Coastal Rush",
    overview:
      "一名退役车手重返赛场，在蜿蜒的海岸赛道上与新生代对手展开终极对决，也与自己内心的恐惧正面交锋。",
    posterUrl: P("racing"),
    backdropUrl: B("noir"),
    releaseYear: 2024,
    runtimeMinutes: 126,
    voteAverage: 7.1,
    genres: [
      { id: 28, name: "动作" },
      { id: 18, name: "剧情" },
    ],
    status: "importing",
    qualities: [],
    favorited: false,
  },
]

export const MOVIES_BY_ID = new Map(MOVIES.map((m) => [m.id, m]))
