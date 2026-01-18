import { permanentRedirect } from "next/navigation"

export default function AboutIndexRedirect() {
  permanentRedirect("/intro/greeting")
}
