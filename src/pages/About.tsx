import {
  MdEventNote,
  MdPeople,
  MdTrendingUp,
  MdSecurity,
  MdSupport,
  MdSpeed,
  MdVerified,
} from "react-icons/md";
import { FaUsers, FaCalendarCheck, FaGlobe, FaAward } from "react-icons/fa";

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
    },
    {
      icon: <MdSecurity size={32} className="text-indigo-500" />,
      title: "Secure Bookings",
      description:
        "Your transactions are protected with bank-level security and encrypted payment processing.",
    },
    {
      icon: <MdSupport size={32} className="text-indigo-500" />,
      title: "24/7 Support",
      description:
        "Our dedicated support team is always ready to help you with any questions or issues.",
    },
    {
      icon: <MdSpeed size={32} className="text-indigo-500" />,
      title: "Lightning Fast",
      description:
        "Experience blazing fast performance with our optimized platform and global CDN.",
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      description:
        "Former event industry executive with 15+ years of experience in digital transformation.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description:
        "Tech visionary who previously led engineering teams at major tech companies.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      description:
        "Award-winning designer focused on creating intuitive and beautiful user experiences.",
    },
    {
      name: "David Kim",
      role: "VP of Operations",
      description:
        "Operations expert ensuring smooth event experiences for millions of users worldwide.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            About Eventixs
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90">
            Revolutionizing how people discover, book, and experience events
            worldwide. We're building the future of event management.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
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

      {/* Story Section */}
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
                  finding and booking great events shouldn't be complicated. Our
                  founders, experienced event organizers and tech enthusiasts,
                  saw an opportunity to bridge the gap between event creators
                  and attendees.
                </p>
                <p>
                  What started as a small startup has grown into a global
                  platform trusted by thousands of event organizers and millions
                  of event-goers. We've facilitated over 10,000 successful
                  events, from intimate workshops to massive festivals.
                </p>
                <p>
                  Today, we're proud to be at the forefront of event technology,
                  continuously innovating to make event discovery and booking
                  seamless for everyone.
                </p>
              </div>
            </div>
            <div className="lg:order-first">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                  <div className="text-center">
                    <MdTrendingUp
                      size={64}
                      className="text-indigo-600 mx-auto mb-4"
                    />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Growing Fast
                    </h3>
                    <p className="text-gray-600">
                      From 0 to 50K+ users in just 4 years, we're scaling
                      rapidly while maintaining our commitment to quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose Eventixs?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built our platform with cutting-edge technology and
              user-centric design to deliver the best event experience possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-xl border border-gray-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-20 h-20 bg-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <MdPeople size={32} className="text-white" />
                  </div>
                  <div className="text-center">
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

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <MdVerified size={80} className="mx-auto mb-8 opacity-90" />
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90">
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
          <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
