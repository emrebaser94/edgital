export interface RoadProperties {
  fid: number;
  name: string | null;
  evnk: string;
  ennk: string;
  eemi_grade: Record<string, number>;
}

/** The road we exercise for the "add Todo" flow: map index 1 == road fid 1307,
 *  which ships without a seed Todo, so clicking it creates a fresh one. */
export const ROAD_WITHOUT_TODO = { mapIndex: 1, fid: 1307 } as const;

/** The road we hover: map index 5 == road fid 1317. Its gw (1.79) and twofs
 *  (3.3) grades fall into different colour buckets, so a road coloured by the
 *  wrong evaluation is detectable. */
export const ROAD_FOR_HOVER = { mapIndex: 5, fid: 1317 } as const;
