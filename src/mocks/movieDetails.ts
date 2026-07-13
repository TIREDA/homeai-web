import type {
  CastMember,
  MediaFileInfo,
  MovieDetail,
  QualityProfile,
  ReleaseResource,
} from "@/types/media"
import { MOVIES_BY_ID } from "./movies"

/** Radarr 质量配置档（下载确认弹窗用） */
export const QUALITY_PROFILES: QualityProfile[] = [
  { id: "uhd", name: "Ultra-HD (2160p)", cutoff: "2160p Remux / WEB-DL" },
  { id: "hd", name: "HD-1080p", cutoff: "1080p BluRay / WEB-DL" },
  { id: "any", name: "Any", cutoff: "任意可用画质" },
]

export const DEFAULT_ROOT_FOLDER = "/media/movies"

/** 通用主创阵容（不同影片复用，保持 mock 简洁） */
function makeCast(seed: string): CastMember[] {
  const cast: CastMember[] = [
    { id: 1, name: "林" + seed, role: "饰 主角", kind: "cast" },
    { id: 2, name: "陈晓" + seed, role: "饰 女主角", kind: "cast" },
    { id: 3, name: "王梓" + seed, role: "饰 反派", kind: "cast" },
    { id: 4, name: "David " + seed, role: "饰 队长", kind: "cast" },
    { id: 5, name: "Sara " + seed, role: "饰 科学家", kind: "cast" },
    { id: 6, name: "赵一" + seed, role: "饰 少年", kind: "cast" },
    { id: 101, name: "诺兰" + seed, role: "导演", kind: "crew" },
    { id: 102, name: "汉斯" + seed, role: "配乐", kind: "crew" },
  ]
  return cast
}

/** 本地文件信息（仅已入库影片有值） */
const MEDIA_FILES: Record<number, MediaFileInfo> = {
  // 星海拓荒 tmdb 693134 已入库 4K DV
  693134: {
    quality: "Ultra-HD (2160p)",
    resolution: "2160p",
    videoCodec: "HEVC",
    hdrFormat: "Dolby Vision",
    audioFormat: "TrueHD 7.1 Atmos",
    sizeBytes: 64_800_000_000,
    filePath: "/media/movies/星海拓荒 (2024)/Nebula.Frontier.2024.2160p.BluRay.REMUX.mkv",
    runtimeMinutes: 148,
  },
  // 群山之王 tmdb 120 已入库 4K HDR
  120: {
    quality: "Ultra-HD (2160p)",
    resolution: "2160p",
    videoCodec: "HEVC",
    hdrFormat: "HDR10",
    audioFormat: "DTS-HD MA 5.1",
    sizeBytes: 48_200_000_000,
    filePath: "/media/movies/群山之王 (2022)/Kingdom.of.Peaks.2022.2160p.WEB-DL.mkv",
    runtimeMinutes: 165,
  },
  // 深蓝之息 tmdb 76600 已入库 1080p（可升级 4K）
  76600: {
    quality: "HD-1080p",
    resolution: "1080p",
    videoCodec: "H264",
    hdrFormat: "SDR",
    audioFormat: "AC3 5.1",
    sizeBytes: 12_400_000_000,
    filePath: "/media/movies/深蓝之息 (2024)/Breath.of.the.Blue.2024.1080p.WEB-DL.mkv",
    runtimeMinutes: 98,
  },
  // 提灯节 tmdb 129 已入库 4K DV
  129: {
    quality: "Ultra-HD (2160p)",
    resolution: "2160p",
    videoCodec: "HEVC",
    hdrFormat: "Dolby Vision",
    audioFormat: "TrueHD 7.1 Atmos",
    sizeBytes: 41_600_000_000,
    filePath: "/media/movies/提灯节 (2022)/Lantern.Festival.2022.2160p.BluRay.mkv",
    runtimeMinutes: 104,
  },
}

/** 根据影片状态生成聚合详情 */
export function buildMovieDetail(tmdbId: number): MovieDetail | undefined {
  const base = [...MOVIES_BY_ID.values()].find((m) => m.tmdbId === tmdbId)
  if (!base) return undefined

  const mediaFile = MEDIA_FILES[tmdbId] ?? null
  const inEmby = base.status === "in_library"
  const inRadarr = base.status !== "not_collected"
  const monitored = inRadarr

  const taglines: Record<number, string> = {
    693134: "在虚空深处，回响着人类最后的信号。",
    545611: "霓虹熄灭之前，真相不会安睡。",
    120: "王座易主，盟约永存。",
    12444: "一封家书，跨越整个时代。",
    76600: "潜入蓝色星球最深的呼吸。",
    27205: "每一条走廊，都是一次重来。",
    129: "追逐灯火，就是追逐回家的路。",
    9340: "极速之上，只有勇者不回头。",
  }

  return {
    ...base,
    tagline: taglines[tmdbId],
    inEmby,
    inRadarr,
    monitored,
    mediaFile,
    rootFolder: DEFAULT_ROOT_FOLDER,
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    cast: makeCast(String(base.id)),
    activeDownloadId: base.status === "downloading" ? `dl-${base.id}` : undefined,
    downloadProgress: base.status === "downloading" ? 63 : undefined,
  }
}

/** 生成一部影片的可用资源列表（模拟 Prowlarr 搜索结果） */
export function buildReleases(tmdbId: number): ReleaseResource[] {
  const base = [...MOVIES_BY_ID.values()].find((m) => m.tmdbId === tmdbId)
  const t = base ? base.originalTitle.replace(/\s+/g, ".") : "Movie"
  const y = base?.releaseYear ?? 2024

  return [
    {
      id: `${tmdbId}-r1`,
      title: `${t}.${y}.2160p.BluRay.REMUX.HEVC.DoVi.TrueHD.7.1.Atmos-FraMeSToR`,
      resolution: "2160p",
      source: "Remux",
      videoCodec: "HEVC",
      hdrFormat: "Dolby Vision",
      audioFormat: "TrueHD 7.1 Atmos",
      sizeBytes: 68_500_000_000,
      seeders: 42,
      leechers: 6,
      indexer: "HDBits",
      customFormatScore: 175,
      rejected: false,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: `${tmdbId}-r2`,
      title: `${t}.${y}.2160p.WEB-DL.DDP5.1.HDR.HEVC-FLUX`,
      resolution: "2160p",
      source: "WEB-DL",
      videoCodec: "HEVC",
      hdrFormat: "HDR10",
      audioFormat: "DDP 5.1",
      sizeBytes: 24_300_000_000,
      seeders: 128,
      leechers: 14,
      indexer: "BeyondHD",
      customFormatScore: 130,
      rejected: false,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: `${tmdbId}-r3`,
      title: `${t}.${y}.2160p.WEB-DL.DDP5.1.HDR10Plus.HEVC-GROUP`,
      resolution: "2160p",
      source: "WEB-DL",
      videoCodec: "HEVC",
      hdrFormat: "HDR10+",
      audioFormat: "DDP 5.1",
      sizeBytes: 22_100_000_000,
      seeders: 63,
      leechers: 9,
      indexer: "BeyondHD",
      customFormatScore: 95,
      rejected: true,
      rejectionReasons: ["音轨不含中文", "发布组不在偏好列表"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    },
    {
      id: `${tmdbId}-r4`,
      title: `${t}.${y}.1080p.BluRay.x264.DTS-HD.MA.5.1-CtrlHD`,
      resolution: "1080p",
      source: "BluRay",
      videoCodec: "H264",
      hdrFormat: "SDR",
      audioFormat: "DTS-HD MA 5.1",
      sizeBytes: 16_800_000_000,
      seeders: 210,
      leechers: 22,
      indexer: "PassThePopcorn",
      customFormatScore: 60,
      rejected: false,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    },
    {
      id: `${tmdbId}-r5`,
      title: `${t}.${y}.1080p.WEBRip.AV1.Opus.5.1-TINY`,
      resolution: "1080p",
      source: "WEBRip",
      videoCodec: "AV1",
      hdrFormat: "SDR",
      audioFormat: "Opus 5.1",
      sizeBytes: 4_200_000_000,
      seeders: 8,
      leechers: 3,
      indexer: "TorrentLeech",
      customFormatScore: -20,
      rejected: true,
      rejectionReasons: ["画质低于质量配置下限", "Custom Format 评分过低"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    },
  ]
}
