import FaceRecognition from "../components/face-recognition";
import SunAndMoon from "@/components/sun-and-moon";

export default async function Home() {
  return (
    <main>
      <SunAndMoon />
      <FaceRecognition />
    </main>
  );
}
