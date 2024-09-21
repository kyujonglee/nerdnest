import MainBoards from "@/services/main/components/MainBoards";
import Categories from "./components/Categories";
import MainSection from "./components/MainSection";

export default function MainPage() {
  return (
    <>
      <MainSection />
      <Categories />
      <MainBoards />
    </>
  );
}
