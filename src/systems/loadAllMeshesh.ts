import { generateEntity } from '@arekrado/canvas-engine'
import { getStore } from '../utils/store'
import { createTransformNode } from '../babylonSystems/transformNode/transformNode.crud'
import { createMesh } from '../babylonSystems/mesh/mesh.crud'

export const loadAllMeshesh = () => {
  ;[
    'KayKit_City_Builder_Bits_1.0_FREE/obj/base.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/bench.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/box_A.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/box_B.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_A_withoutBase.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_A.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_B_withoutBase.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_B.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_C_withoutBase.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_C.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_D_withoutBase.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_D.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_E_withoutBase.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_E.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_F_withoutBase.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_F.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_G_withoutBase.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_G.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_H_withoutBase.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/building_H.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/bush.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/car_hatchback.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/car_police.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/car_sedan.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/car_stationwagon.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/car_taxi.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/dumpster.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/firehydrant.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/road_corner_curved.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/road_corner.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/road_junction.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/road_straight_crossing.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/road_straight.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/road_tsplit.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/streetlight.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/trafficlight_A.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/trafficlight_B.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/trafficlight_C.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/trash_A.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/trash_B.obj',
    'KayKit_City_Builder_Bits_1.0_FREE/obj/watertower.obj',
  ].forEach((url, i) => {
    const entity = generateEntity()
    getStore().createEntity(entity)

    const position = { x: i * 2, y: 0, z: 0 }
    createTransformNode(entity, { position })

    createMesh(
      entity,
      {
        name: entity,
        url,
      },
        {
          onLoad: () => {
            // createPhysicsBody(entity, {
            //   physicsMotionType: PhysicsMotionType.DYNAMIC,
            //   startsAsleep: false,
            // })
            // createPhysicsShape(entity, { type: 'ConvexHull' })
          },
        }
    )
  })
}
