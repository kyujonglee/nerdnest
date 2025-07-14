import MainBoards from "@/services/main/components/MainBoards";
import Categories from "./components/Categories";
import MainSection from "./components/MainSection";
import NerdKick from "@/services/main/components/NerdKick";
import Recommendation from "@/services/main/components/Recommendation";

export default function MainPage() {
  return (
    <>
      <MainSection />
      <Categories />
      <MainBoards />
      <NerdKick />
      <Recommendation />
    </>
  );
}
