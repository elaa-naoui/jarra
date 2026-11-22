import { redirect } from "next/navigation";

// Redirect /3d to homepage – this route is reserved for future 3D viewer
export default function Page3D() {
  redirect("/");
}
