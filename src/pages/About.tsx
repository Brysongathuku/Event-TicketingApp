import {
  MdEventNote,
  MdTrendingUp,
  MdSecurity,
  MdSupport,
  MdSpeed,
  MdVerified,
} from "react-icons/md";
import { FaUsers, FaCalendarCheck, FaGlobe, FaAward } from "react-icons/fa";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
const About = () => {
  const stats = [
    { icon: <FaUsers size={24} />, number: "50K+", label: "Active Users" },
    {
      icon: <FaCalendarCheck size={24} />,
      number: "10K+",
      label: "Events Hosted",
    },
    { icon: <FaGlobe size={24} />, number: "25+", label: "Countries" },
    { icon: <FaAward size={24} />, number: "99.9%", label: "Uptime" },
  ];

  const features = [
    {
      icon: <MdEventNote size={32} className="text-indigo-500" />,
      title: "Easy Event Discovery",
      description:
        "Find the perfect events tailored to your interests with our advanced search and filtering system.",
      image:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
    },
    {
      icon: <MdSecurity size={32} className="text-indigo-500" />,
      title: "Secure Bookings",
      description:
        "Your transactions are protected with bank-level security and encrypted payment processing.",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    },
    {
      icon: <MdSupport size={32} className="text-indigo-500" />,
      title: "24/7 Support",
      description:
        "Our dedicated support team is always ready to help you with any questions or issues.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    },
    {
      icon: <MdSpeed size={32} className="text-indigo-500" />,
      title: "Lightning Fast",
      description:
        "Experience blazing fast performance with our optimized platform and global CDN.",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    },
  ];

  const teamMembers = [
    {
      name: "Bryson Wairimu",
      role: "CEO & Founder",
      description:
        "Visionary leader with extensive experience in event management and digital innovation, driving Eventixs towards global expansion.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face", // Replace this with your actual photo URL
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description:
        "Tech visionary who previously led engineering teams at major tech companies.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      description:
        "Award-winning designer focused on creating intuitive and beautiful user experiences.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
    },
    {
      name: "David Kim",
      role: "VP of Operations",
      description:
        "Operations expert ensuring smooth event experiences for millions of users worldwide.",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section with Background Image */}
        <section className="relative h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop')`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-indigo-900/40"></div>
          <div className="relative max-w-6xl mx-auto px-6 h-full flex items-center justify-center text-center">
            <div className="space-y-8">
              <div className="animate-fade-in">
                <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white bg-clip-text">
                  About Eventixs
                </h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90">
                  Revolutionizing how people discover, book, and experience
                  events worldwide. We're building the future of event
                  management.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white relative -mt-20 z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section with Image */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Our Story
                </h2>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    Founded in 2020, Eventixs emerged from a simple observation:
                    finding and booking great events shouldn't be complicated.
                    Our founders, experienced event organizers and tech
                    enthusiasts, saw an opportunity to bridge the gap between
                    event creators and attendees.
                  </p>
                  <p>
                    What started as a small startup has grown into a global
                    platform trusted by thousands of event organizers and
                    millions of event-goers. We've facilitated over 10,000
                    successful events, from intimate workshops to massive
                    festivals.
                  </p>
                  <p>
                    Today, we're proud to be at the forefront of event
                    technology, continuously innovating to make event discovery
                    and booking seamless for everyone.
                  </p>
                </div>
              </div>
              <div className="lg:order-first">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-2xl transform rotate-3"></div>
                  <img
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop"
                    alt="Team collaboration"
                    className="relative w-full h-80 object-cover rounded-2xl shadow-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 to-transparent rounded-2xl flex items-end">
                    <div className="p-6 text-white">
                      <MdTrendingUp size={48} className="mb-2" />
                      <h3 className="text-2xl font-bold mb-2">Growing Fast</h3>
                      <p className="opacity-90">
                        From 0 to 50K+ users in just 4 years
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Images */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Why Choose Eventixs?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We've built our platform with cutting-edge technology and
                user-centric design to deliver the best event experience
                possible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl border border-gray-200 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4 p-3 bg-white/90 rounded-full group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section with Photos */}
        <section className="py-20 bg-indigo-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Passionate professionals dedicated to revolutionizing the event
                industry through innovation and excellence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-indigo-600 font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section with Background Image */}
        <section className="py-20 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&h=600&fit=crop')`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-purple-900/50"></div>
          <div className="relative max-w-6xl mx-auto px-6 text-center text-white">
            <MdVerified size={80} className="mx-auto mb-8 drop-shadow-lg" />
            <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">
              Our Mission
            </h2>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed drop-shadow-md">
              To democratize event discovery and booking, making it easier for
              people to find meaningful experiences and for organizers to reach
              their perfect audience. We believe great events bring people
              together and create lasting memories.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Discover Amazing Events?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of event enthusiasts who trust Eventixs for their
              event discovery and booking needs.
            </p>
            <Link to="/register">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Get Started Today
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
