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

/** The road we check the map colouring with: map index 219 == road fid 5646.
 *  Its grades span four colours — gw 3.79 yellow, twofs 1.86 light-green,
 *  twrio 4.61 red, twgeb/tweben 1 blue — the most any road has, since in the
 *  data twsub always equals gw and twgeb/tweben are always 1. */
export const ROAD_FOR_COLOURING = { mapIndex: 219, fid: 5646 } as const;

/** The road we use for the "several Todos" flow: map index 0 == road fid 1306,
 *  which ships with two seed Todos (ids 2 and 7). */
export const ROAD_WITH_SEVERAL_TODOS = { mapIndex: 0, fid: 1306, seedTodos: 2 } as const;
