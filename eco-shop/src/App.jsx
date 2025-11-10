import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 via-white to-slate-100 text-slate-900 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/40 dark:text-slate-50">
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}

export default App
