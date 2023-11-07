import FacesList from "@/components/faces-list";
import FaceRecognition from "../components/face-recognition";
import SunAndMoon from "@/components/sun-and-moon";
import NameForm from "@/components/name-form";

export default async function Home() {
  return (
    <main className="facial-recognition-container">
      <SunAndMoon />
      <FaceRecognition />
      <NameForm />
      <FacesList />
    </main>
  );
}
