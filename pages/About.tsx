import React, { useState } from 'react';
import { Target, Users, BookOpen, ChevronDown, ChevronUp, Globe, Award, Heart, Briefcase } from 'lucide-react';

interface Minister {
  id: string;
  name: string;
  title: string;
  role: string;
  photo: string;
  shortBio: string;
  highlights: { icon: React.ReactNode; label: string; value: string }[];
  fullBio: {
    section: string;
    content: string;
    items?: string[];
  }[];
}

const ministers: Minister[] = [
  {
    id: 'rev-peace-goodey',
    name: 'Rev. (Mrs.) Peace Goodey',
    title: 'Founder & General Overseer',
    role: 'Christ Believers Healing Ministry',
    photo: '/ministers/rev-peace-goodey.jpg',
    shortBio: 'A visionary spiritual leader, distinguished medical professional, and compassionate humanitarian. As an ordained minister of the Gospel, she is the Founder and General Overseer of Christ Believers Healing Ministry and its church arm, Christ Believers Assembly, headquartered in Victoria Island, Lagos, Nigeria.',
    highlights: [
      { icon: <Award size={16} />, label: 'Founded Ministry', value: '2000' },
      { icon: <Globe size={16} />, label: 'Headquarters', value: 'Victoria Island, Lagos' },
      { icon: <BookOpen size={16} />, label: 'Education', value: 'Theology & Leadership, RCCG Bible Institute' },
      { icon: <Heart size={16} />, label: 'Calling', value: 'Divine call to ministry since 1994' },
    ],
    fullBio: [
      {
        section: 'Early Life & Professional Excellence',
        content: 'Hailing from Edo State, Rev. Goodey\'s journey began in the sciences. A graduate of the University of Benin, she established a successful career as a full-time practicing optometrist in the Ikoyi area of Lagos. Her leadership qualities were evident early, leading her to serve as Vice President and Acting President of the Nigerian Optometric Association. In 1994, she transitioned from medical practice to answer a divine call to ministry, eventually founding Christ Believers Healing Ministry and its church arm in 2000.',
      },
      {
        section: 'Ministry Arms & Initiatives',
        content: 'Rev. Goodey\'s ministry is coordinated through several specialized arms:',
        items: [
          'Singles Initiative Project — A fast-growing mentoring and guidance project for single individuals.',
          'The Elijah Network — A platform for spiritual connection and growth.',
          'Beyond The Sound Of Music — An initiative focused on deeper dimensions of worship.',
          'The Alabaster Jar Foundation — Reaching the community by catering to the less privileged and the medically challenged.',
        ],
      },
      {
        section: 'Global Impact & Institutional Service',
        content: 'Rev. Goodey holds various executive roles in international Christian bodies:',
        items: [
          'Pentecostal Fellowship of Nigeria (PFN) — Former Treasurer and Executive Member, Lagos State branch.',
          'International Prayer Bodies — Member of the Global Day of Prayer and the South Africa-based International Prayer Council.',
          'Fellowship Covenant Ministries International — Member of the U.S.-based international affiliate.',
        ],
      },
    ],
  },
  {
    id: 'pastor-udom',
    name: 'Pastor (Dr.) Udom Udom',
    title: 'Chief Operating Officer (COO)',
    role: 'Christ Believers Assembly',
    photo: '/ministers/pastor-udom.jpg',
    shortBio: 'A distinguished legal luminary, anointed minister of the Gospel, and visionary administrator. With over 20 years of dedicated service, Dr. Udom was elevated in 2025 to serve as the Chief Operating Officer of Christ Believers Assembly, driving the ministry\'s global expansion and operational governance.',
    highlights: [
      { icon: <Award size={16} />, label: 'Elevated to COO', value: '2025' },
      { icon: <Briefcase size={16} />, label: 'Profession', value: 'Doctor of Law (Ph.D.)' },
      { icon: <Globe size={16} />, label: 'Focus', value: 'Global Church Expansion' },
      { icon: <Heart size={16} />, label: 'Years of Service', value: '20+ Years' },
    ],
    fullBio: [
      {
        section: 'Educational & Professional Foundation',
        content: 'Dr. Udom\'s leadership is grounded in a formidable academic and professional foundation. A lawyer by profession, he holds a Ph.D. in Law — a testament to his intellectual rigor and passion for justice. His legal expertise provides a unique perspective to his ministerial work, blending divine wisdom with structured, ethical governance.',
      },
      {
        section: 'A Legacy of Service',
        content: 'Dr. Udom\'s journey in Christ Believers Assembly is a story of faithful service in the little things. For over 20 years, he served in various capacities, laboring in the trenches of ministry long before attaining executive leadership. His transition into senior leadership began as the Senior Pastor of Unlimited Favour Parish, where his ministry was marked by spiritual growth, community impact, and a profound manifestation of God\'s grace. His pastoral success and administrative prowess led to his landmark ordination in 2025 as COO.',
      },
      {
        section: 'Current Responsibilities as COO',
        content: 'Since his elevation, Dr. Udom has been the engine room of the ministry\'s operations:',
        items: [
          'Global Expansion — Leading the charge in planting and opening new church branches across various continents.',
          'Administrative Governance — Overhauling internal structures for efficiency, transparency, and modern operational standards.',
          'Policy Development — Drafting and implementing constitutional guidelines governing the conduct of clergy and staff.',
          'Legal & Compliance — Leveraging his doctoral expertise to handle legal interests, property acquisitions, and international regulatory compliance.',
          'Human Capital Management — Overseeing the welfare, training, and deployment of ministers and workers in the global network.',
        ],
      },
    ],
  },
];

const MinisterCard: React.FC<{ minister: Minister }> = ({ minister }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300">
      {/* Photo + Header */}
      <div className="relative">
        <div className="h-80 overflow-hidden">
          <img
            src={minister.photo}
            alt={minister.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-church-900/90 via-church-900/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <p className="text-gold-400 text-xs font-black uppercase tracking-widest mb-1">{minister.title}</p>
          <h3 className="text-2xl font-serif font-bold leading-tight">{minister.name}</h3>
          <p className="text-church-200 text-sm mt-0.5">{minister.role}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Short Bio */}
        <p className="text-gray-600 leading-relaxed mb-6 text-[15px]">{minister.shortBio}</p>

        {/* Highlights */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {minister.highlights.map((h, i) => (
            <div key={i} className="bg-church-50 rounded-2xl p-3 flex items-start gap-3">
              <div className="text-church-600 mt-0.5 flex-shrink-0">{h.icon}</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-church-400">{h.label}</p>
                <p className="text-xs font-bold text-gray-800 leading-tight mt-0.5">{h.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-church-100 text-church-600 font-bold text-sm hover:bg-church-50 transition"
        >
          {expanded ? <><ChevronUp size={18} /> Hide Full Biography</> : <><ChevronDown size={18} /> Read Full Biography</>}
        </button>

        {/* Full Bio */}
        {expanded && (
          <div className="mt-8 space-y-6 animate-fade-in border-t border-gray-100 pt-6">
            {minister.fullBio.map((section, i) => (
              <div key={i}>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-1 h-5 bg-church-600 rounded-full inline-block" />
                  {section.section}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-2">{section.content}</p>
                {section.items && (
                  <ul className="space-y-1.5 ml-3">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const About: React.FC = () => {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">About Our Church</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Knowing Christ and making Him known through worship, community, and service.
          </p>
        </div>
      </div>

      {/* Mission Vision Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="bg-church-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-church-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To lead people into a growing relationship with Jesus Christ by creating an environment where people are encouraged and equipped.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="bg-church-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-church-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Community</h3>
            <p className="text-gray-600">
              We are a diverse family of believers united by faith. We value authenticity, hospitality, and carrying one another's burdens.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="bg-church-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-church-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Beliefs</h3>
            <p className="text-gray-600">
              We stand firm on the Bible as the inspired Word of God, the Trinity, salvation through grace, and the hope of eternal life.
            </p>
          </div>
        </div>
      </div>

      {/* Leadership Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-church-600 font-black uppercase tracking-widest text-xs mb-3">Meet the Servants</p>
            <h2 className="text-4xl font-serif font-bold text-gray-900">Our Leadership</h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-4">
              Anointed, equipped, and wholly dedicated to the mission of Christ Believers Assembly.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {ministers.map(minister => (
              <MinisterCard key={minister.id} minister={minister} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
