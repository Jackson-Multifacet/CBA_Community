import React from 'react';
import { Target, Users, BookOpen } from 'lucide-react';

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
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12 text-center">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Pastor 1 */}
            <div className="group">
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" 
                  alt="Senior Pastor" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Rev. Michael Thomas</h3>
              <p className="text-church-600 font-medium mb-2">Senior Pastor</p>
              <p className="text-gray-500 text-sm">
                Pastor Michael has served CBA for over 15 years with a passion for biblical teaching and community outreach.
              </p>
            </div>
            {/* Pastor 2 */}
            <div className="group">
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" 
                  alt="Associate Pastor" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pastor Sarah Jenkins</h3>
              <p className="text-church-600 font-medium mb-2">Associate Pastor</p>
              <p className="text-gray-500 text-sm">
                Pastor Sarah leads our discipleship and women's ministries, helping believers deepen their walk with God.
              </p>
            </div>
            {/* Pastor 3 */}
            <div className="group">
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80" 
                  alt="Youth Pastor" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">David Ross</h3>
              <p className="text-church-600 font-medium mb-2">Youth Pastor</p>
              <p className="text-gray-500 text-sm">
                David brings energy and truth to our youth programs, mentoring the next generation of church leaders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;