import type { ImgHTMLAttributes } from "react"

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean
  priority?: boolean
  sizes?: string
}

export default function Image({ fill, priority, sizes, ...props }: ImageProps) {
  return <img {...props} loading={priority ? "eager" : "lazy"} style={fill ? { ...props.style, objectFit: "cover", position: "absolute", inset: 0, width: "100%", height: "100%" } : props.style} />
}
