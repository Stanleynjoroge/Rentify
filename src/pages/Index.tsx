const Index = () => {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/landing-bg.png")' }}
    >
      <div className="text-center bg-white/90 p-10 rounded-2xl backdrop-blur-sm shadow-xl max-w-2xl mx-4">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Welcome to RenTify</h1>
        <p className="text-xl text-gray-600">Property management made simple for landlords and tenants.</p>
      </div>
    </div>
  );
};

export default Index;