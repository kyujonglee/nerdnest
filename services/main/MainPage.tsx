import MainBoards from "@/services/main/components/MainBoards";
import Categories from "./components/Categories";
import MainSection from "./components/MainSection";
import NerdPick from "@/services/main/components/NerdPick";
import Recommendation from "@/services/main/components/Recommendation";

export default function MainPage() {
  return (
    <>
      <MainSection />
      <Categories />
      <MainBoards />
      <NerdPick />
      <Recommendation />
    </>
  );
}
