
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';
import Home from './pages/Home';
import About from './pages/About';
import Sermons from './pages/Sermons';
import Events from './pages/Events';
import Contact from './pages/Contact';
import MemberPortal from './pages/MemberPortal';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SchoolOfTheWord from './pages/SchoolOfTheWord';
import BibleInstitute from './pages/BibleInstitute';
import Library from './pages/Library';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import StudyMode from './pages/StudyMode';
import OTChallenge from './pages/OTChallenge';
import BibleTrivia from './pages/BibleTrivia';
import Gallery from './pages/Gallery';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isStudyPage = location.pathname === '/study';
  const isChallengePage = location.pathname === '/ot-challenge';
  const isTriviaPage = location.pathname === '/bible-trivia';

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/portal" element={<MemberPortal />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/school-of-word" element={<SchoolOfTheWord />} />
          <Route path="/bible-institute" element={<BibleInstitute />} />
          <Route path="/library" element={<Library />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/study" element={<StudyMode />} />
          <Route path="/ot-challenge" element={<OTChallenge />} />
          <Route path="/bible-trivia" element={<BibleTrivia />} />
        </Routes>
      </main>
      {(!isStudyPage && !isChallengePage && !isTriviaPage) && <ChatAssistant />}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
