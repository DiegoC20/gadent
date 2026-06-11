import { getToothConfig, type ToothCrownType } from '../../data/toothConfig'

interface ToothSvgProps {
  number: number
  flipped?: boolean
}

const TOOTH_ASSETS: Record<ToothCrownType, string> = {
  'molar-upper': '/odontogram/teeth/molar-upper.svg',
  'molar-lower': '/odontogram/teeth/molar-lower.svg',
  'premolar-single': '/odontogram/teeth/premolar-single.svg',
  'premolar-double': '/odontogram/teeth/premolar-double.svg',
  anterior: '/odontogram/teeth/anterior.svg',
}

const TOOTH_ASSET_OVERRIDES: Partial<Record<number, string>> = {
  24: '/odontogram/teeth/premolar-double-24.svg',
}

function ToothSvg({ number, flipped = false }: ToothSvgProps) {
  const { crownType } = getToothConfig(number)
  const src = TOOTH_ASSET_OVERRIDES[number] ?? TOOTH_ASSETS[crownType]

  return (
    <img
      src={src}
      alt=""
      className="w-full h-auto pointer-events-none select-none aspect-[38/72]"
      style={flipped ? { transform: 'scaleY(-1)' } : undefined}
      draggable={false}
      aria-hidden
    />
  )
}

export default ToothSvg
