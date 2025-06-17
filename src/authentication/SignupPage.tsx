import SignupForm from "./SignupForm";

function SignupPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="form-container">
        <h1 className="text-3xl font-bold text-center mb-6 text-yoruba-indigo">
          Get Started
        </h1>
        <SignupForm />
      </div>
    </div>
  );
}

export default SignupPage;
