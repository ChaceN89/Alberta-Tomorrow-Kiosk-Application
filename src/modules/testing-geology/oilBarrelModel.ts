/**
  File: oilBarrelModel.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Define the geology module's oil barrel model and preview assets.

  Usage:
  - Used by the geology activity and its journal viewer entry.

  Notes:
  - Texture URL keys match filenames referenced by the MTL file.
 */
import oilBarrelModelUrl from './assets/oil-barrel/OilBarrel.obj?url'
import oilBarrelMaterialUrl from './assets/oil-barrel/OilBarrel.mtl?url'
import oilBarrelTextureUrl from './assets/oil-barrel/Oil.png'
import oilBarrelActivityPreviewUrl from './assets/oil-barrel/OilBarrelPreview.png'

export const oilBarrelTexturePreviewUrl = oilBarrelTextureUrl
export { oilBarrelActivityPreviewUrl }

export const oilBarrelModelAssets = {
  format: 'obj',
  src: oilBarrelModelUrl,
  mtlUrl: oilBarrelMaterialUrl,
  textureUrls: {
    'Oil.png': oilBarrelTextureUrl,
  },
} as const
