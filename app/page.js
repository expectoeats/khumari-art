import Navbar         from "../components/Navbar";
import HeroSlider     from "../components/HeroSlider";
import NewArrivals    from "../components/NewArrivals";
import Collections    from "../components/Collections";
import Paintings      from "../components/Paintings";
import TopPicks       from "../components/TopPicks";
import ColorPicker    from "../components/ColorPicker";
import StoryOfTheDay  from "../components/StoryOfTheDay";
import AboutArtist    from "../components/AboutArtist";
import Footer         from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <Navbar />
      <HeroSlider />
      <NewArrivals />
      <Collections />
      <Paintings />
      <TopPicks />
      <ColorPicker />
      <StoryOfTheDay />
      <AboutArtist />
      <Footer />
    </main>
  );
}
