
import { BackgroundBeamsWithCollisionDemo } from "@/components/demo/background-beams-demo";
import { AuthRedirect } from "@/components/auth/AuthRedirect";

export default function Index() {
  return (
    <>
      <AuthRedirect />
      <BackgroundBeamsWithCollisionDemo />
    </>
  );
}
