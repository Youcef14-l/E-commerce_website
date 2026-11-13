import type { AnchorHTMLAttributes } from "react"
import { Link as RouterLink } from "react-router-dom"

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export default function Link({ href, children, ...props }: LinkProps) {
  return <RouterLink to={href} {...props}>{children}</RouterLink>
}
