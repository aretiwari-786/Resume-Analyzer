const Loader = ({ message = "Analyzing your resume..." }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 
      flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-10 text-center 
        shadow-2xl max-w-sm mx-4">
        
        {/* Spinning Circle */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-indigo-100 
            rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 
            rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center 
            justify-center text-2xl">
            🤖
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          AI is Working...
        </h3>
        <p className="text-gray-500 text-sm mb-4">{message}</p>

        {/* Progress Steps */}
        <div className="space-y-2 text-left">
          {[
            '📄 Extracting text from PDF',
            '🧠 Running NLP analysis',
            '📊 Calculating match score',
            '🎯 Predicting job role',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-indigo-400 rounded-full 
                animate-pulse"></div>
              <span className="text-gray-600">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loader