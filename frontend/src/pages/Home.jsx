const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-green-100 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-green-600 font-semibold">ChildNest</p>
        <h1 className="text-4xl font-bold text-gray-900 mt-3">Welcome to ChildNest</h1>
        <p className="text-gray-600 mt-4 text-lg">
          Your login was successful. You are now on the ChildNest home page.
        </p>
      </div>
    </div>
  );
};

export default Home;