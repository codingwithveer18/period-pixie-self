// import styles from "./Home.module.css";
import About from "./About";
function Home() {
  const stats = [
    { id: 1, name: "Transactions every 24 hours", value: "44 million" },
    { id: 2, name: "Assets under holding", value: "$119 trillion" },
    { id: 3, name: "New users annually", value: "46,000" },
  ];
  return (
    <>
      <main>
        <div className=" flex flex-col items-center m-8 md:flex-row">
          <div className=" flex flex-col ">
            <h1 className="text-3xl font-bold py-4 tracking-wide md:text-4xl ">
              Embrace her cycle, Celebrate her resilience !
            </h1>
            <p className="text-lg font-normal pb-6">
              We offer healthcare solutions tailored to women's needs,
              addressing topics such as reproductive health and vaginal hygiene
              through our blog content. Our web application ensures effective
              menstrual hygiene management, aiming to minimize school dropout
              rates and enhance women's empowerment
            </p>
            <button className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 drop-shadow-xl p-3 rounded-lg text-white text-lg">
              Get Started
            </button>
          </div>
          <div className="flex justify-center">
            <img
              className="w-10/12"
              src="https://storage.googleapis.com/project-hackdata/main.jpg"
              alt="Home"
            />
          </div>
        </div>
        <div className="bg-slate-100 py-10 sm:py-12 my-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="mx-auto flex max-w-xs flex-col gap-y-4"
                >
                  <dt className="text-base leading-7 text-gray-600">
                    {stat.name}
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <About />
      </main>
    </>
  );
}

export default Home;
