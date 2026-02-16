function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Hagere Hiwot Labs Task Platform
        </h1>
        <p className="text-gray-600 mb-8">
          Professional task management system - Frontend is running!
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">
            Backend API: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code>
          </p>
          <p className="text-gray-700 mt-2">
            API Documentation: <code className="bg-gray-100 px-2 py-1 rounded">/api/docs</code>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
