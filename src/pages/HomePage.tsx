import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          The Records of Amur Isondo
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          A magical artifact that possesses the combined knowledge of all mankind
        </p>
        <div className="bg-slate-800 rounded-lg p-6 max-w-2xl mx-auto mb-8">
          <p className="text-gray-200 mb-6">
            Welcome to the educational AI game where you'll learn about AI as simulators
            by summoning different spirits to help answer questions.
          </p>
          <button
            onClick={() => navigate('/persona')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            Begin Your Journey
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage