import Navbar from "../components/Navbar.tsx";
import Hero from "../components/Hero.tsx";
import Footer from "../components/footer.tsx";
import Events from "../dashboard/UserDashboard/Events/Events.tsx";
const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Events />
      <Footer />
    </div>
  );
};

export default LandingPage;
