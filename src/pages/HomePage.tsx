import Form from "../components/Form";

function HomePage() {
  return (
    <div className="grid grid-rows-[1fr_2fr]">
      <div className="flex items-end justify-center">
        <h1 className="text-4xl py-2.5">Kí ni mo lè ṣe fún ẹ?</h1>
      </div>
      <div className="">
        <Form />
      </div>
    </div>
  );
}

export default HomePage;
