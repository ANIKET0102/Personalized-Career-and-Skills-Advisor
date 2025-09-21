import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import mockApiService from "./components/mockApiService.jsx";
import {
  Briefcase,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Target,
  ClipboardList,
  BrainCircuit,
  Bot,
  Loader,
  X,
} from "lucide-react";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.brand}>
          <BrainCircuit size={28} />
          <h1>CareerCraft AI</h1>
        </div>
        <a
          href="https://github.com/your-repo"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}

function TagInput({ tags, setTags, placeholder }) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (
        !tags.find(
          (tag) => tag.toLowerCase() === inputValue.trim().toLowerCase()
        )
      ) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={styles.tagBox}>
      {tags.map((tag, index) => (
        <div key={index} className={styles.tag}>
          {tag}
          <button onClick={() => removeTag(tag)}>
            <X size={14} />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}

function UserInputForm({ setUserInput, setIsLoading, setHasResults }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [goals, setGoals] = useState("");
  const [error, setError] = useState("");

  const nextStep = () => {
    if (step === 1 && name.trim() === "") {
      setError("Please enter your name.");
      return;
    }
    if (step === 2 && skills.length === 0) {
      setError("Please add at least one skill.");
      return;
    }
    if (step === 3 && interests.length === 0) {
      setError("Please add at least one interest.");
      return;
    }
    setError("");
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goals.trim().length < 20) {
      setError("Please describe your goals in more detail.");
      return;
    }
    setError("");
    setIsLoading(true);
    setHasResults(false);
    setUserInput({ name, skills, interests, goals });
  };

  return (
    <section className={styles.formSection}>
      <h2>Unlock Your Career Potential</h2>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        {step === 1 && (
          <>
            <label>What’s your name?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex Doe"
            />
          </>
        )}
        {step === 2 && (
          <>
            <label>What are your current skills?</label>
            <TagInput
              tags={skills}
              setTags={setSkills}
              placeholder="Add a skill..."
            />
          </>
        )}
        {step === 3 && (
          <>
            <label>What are your interests?</label>
            <TagInput
              tags={interests}
              setTags={setInterests}
              placeholder="Add an interest..."
            />
          </>
        )}
        {step === 4 && (
          <>
            <label>What are your career goals?</label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="e.g., I want to work on innovative projects..."
            />
          </>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttonRow}>
          <button type="button" onClick={prevStep} disabled={step === 1}>
            Back
          </button>
          {step < 4 && (
            <button type="button" onClick={nextStep}>
              Next <ArrowRight size={16} />
            </button>
          )}
          {step === 4 && (
            <button type="submit">
              Get Advice <Bot size={16} />
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

function ResultsDisplay({ results, userInput, onReset }) {
  if (!results) return null;
  return (
    <section className={styles.results}>
      <h2>Your Personalized Roadmap, {userInput.name}!</h2>
      <button onClick={onReset}>Start a New Plan</button>
    </section>
  );
}

function LoadingState() {
  return (
    <div className={styles.loading}>
      <Loader className={styles.spin} size={64} />
      <p>Analyzing Your Profile...</p>
    </div>
  );
}

export default function App() {
  const [userInput, setUserInput] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  useEffect(() => {
    const getRecommendations = async () => {
      if (userInput && isLoading) {
        const result = await mockApiService.generateRecommendations(userInput);
        setRecommendations(result);
        setHasResults(true);
        setIsLoading(false);
      }
    };
    getRecommendations();
  }, [userInput, isLoading]);

  return (
    <div className={styles.app}>
      <Header />
      <main>
        {!hasResults && !isLoading && (
          <UserInputForm
            setUserInput={setUserInput}
            setIsLoading={setIsLoading}
            setHasResults={setHasResults}
          />
        )}
        {isLoading && <LoadingState />}
        {hasResults && recommendations && (
          <ResultsDisplay
            results={recommendations}
            userInput={userInput}
            onReset={() => {
              setUserInput(null);
              setRecommendations(null);
              setIsLoading(false);
              setHasResults(false);
            }}
          />
        )}
      </main>
    </div>
  );
}
