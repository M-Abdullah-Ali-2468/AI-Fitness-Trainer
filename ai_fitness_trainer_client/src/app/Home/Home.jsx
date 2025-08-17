import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Zap,
  Target,
  TrendingUp,
  Brain,
  Star,
  ArrowRight,
  Check,
  User,
  Activity,
} from "lucide-react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote:
        "Sigma's AI completely transformed my fitness journey. The personalized plans adapt perfectly to my progress.",
      name: "Alex Chen",
      avatar: "AC",
    },
    {
      quote:
        "Finally, a fitness app that understands my busy schedule and creates workouts that actually work.",
      name: "Sarah Johnson",
      avatar: "SJ",
    },
    {
      quote:
        "The AI nutrition guidance helped me reach my goals 3x faster than any other program I've tried.",
      name: "Mike Rodriguez",
      avatar: "MR",
    },
  ];

  const features = [
    {
      icon: <Brain className="feature-icon" />,
      title: "AI-Powered Plans",
      description:
        "Smart algorithms create personalized workouts and nutrition plans tailored to your unique goals and preferences.",
    },
    {
      icon: <TrendingUp className="feature-icon" />,
      title: "Progress Tracking",
      description:
        "Advanced analytics track your performance, adapt your routine, and celebrate your achievements in real-time.",
    },
    {
      icon: <Target className="feature-icon" />,
      title: "Goal-Based Training",
      description:
        "Whether it's weight loss, muscle gain, or endurance, our AI adapts your program for optimal results.",
    },
    {
      icon: <Zap className="feature-icon" />,
      title: "Instant Adaptation",
      description:
        "Dynamic workouts that evolve with your fitness level, ensuring continuous progress and motivation.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign Up & Onboard",
      description:
        "Provide your fitness background, goals, and preferences. Takes less than 2 minutes.",
    },
    {
      number: "02",
      title: "AI Personalizes Your Plan",
      description:
        "Our advanced AI analyzes your data and creates a completely customized fitness and nutrition program.",
    },
    {
      number: "03",
      title: "Start Training & Tracking",
      description:
        "Follow your daily workouts, log meals, and watch as the AI adapts to your progress.",
    },
    {
      number: "04",
      title: "Achieve Your Goals",
      description:
        "Stay motivated with real-time feedback and continuous plan optimization for maximum results.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(
        (prev) => (prev + 1) % testimonials.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Show loading while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="home-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Your AI-Powered Personal Fitness Trainer
            </h1>
            <p className="hero-subtitle">
              Personalized fitness plans, nutrition guidance, and progress
              tracking powered by advanced artificial intelligence—all at your
              fingertips.
            </p>
            <div className="hero-buttons">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button className="cta-primary">
                      Get Started
                      <ArrowRight className="button-icon" />
                    </button>
                  </SignInButton>
                  <button
                    className="cta-secondary"
                    onClick={() =>
                      document
                        .querySelector(".features-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Learn More
                    <ChevronRight className="button-icon" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/generate-program">
                    <button className="cta-primary">
                      Generate Program
                      <Activity className="button-icon" />
                    </button>
                  </Link>
                  <button
                    className="cta-secondary"
                    onClick={() =>
                      document
                        .querySelector(".features-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Learn More
                    <ChevronRight className="button-icon" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="hero-visual">
            <div className="ai-avatar">
              <div className="avatar-circle">
                <Brain className="avatar-icon" />
              </div>
              <div className="pulse-ring ring1"></div>
              <div className="pulse-ring ring2"></div>
              <div className="pulse-ring ring3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section (Signed In Only) */}
      {isSignedIn && (
        <section className="user-dashboard-section">
          <div className="section-container">
            <div className="dashboard-welcome">
              <div className="welcome-content">
                <div className="welcome-text">
                  <h2 className="welcome-title">
                    Welcome back, {user?.firstName || "Champion"}!
                  </h2>
                  <p className="welcome-subtitle">
                    Your AI plan is ready for today. Let’s continue your fitness
                    journey and make progress towards your goals.
                  </p>
                </div>
                <div className="welcome-avatar">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={`${user.firstName}'s avatar`}
                      className="user-avatar-image"
                    />
                  ) : (
                    <div className="user-avatar-placeholder">
                      <User className="user-icon" />
                    </div>
                  )}
                </div>
              </div>
              <div className="dashboard-actions">
                <Link to="/profile">
                  <button className="dashboard-btn primary">
                    <Activity className="btn-icon" />
                    Open Dashboard
                  </button>
                </Link>
                <Link to="/profile">
                  <button className="dashboard-btn secondary">
                    <Target className="btn-icon" />
                    View Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Powered by Next-Gen AI Technology</h2>
            <p className="section-subtitle">
              Experience the future of personalized fitness
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">How Sigma Works</h2>
            <p className="section-subtitle">
              Your journey to peak fitness in four simple steps
            </p>
          </div>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="step-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Trusted by Thousands</h2>
            <p className="section-subtitle">Real results from real users</p>
          </div>
          <div className="testimonials-container">
            <div className="testimonial-carousel">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`testimonial-card ${
                    i === currentTestimonial ? "active" : ""
                  }`}
                >
                  <div className="testimonial-content">
                    <div className="stars">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="star-icon filled" />
                      ))}
                    </div>
                    <blockquote className="testimonial-quote">
                      "{t.quote}"
                    </blockquote>
                    <div className="testimonial-author">
                      <div className="author-avatar">{t.avatar}</div>
                      <span className="author-name">{t.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${
                    i === currentTestimonial ? "active" : ""
                  }`}
                  onClick={() => setCurrentTestimonial(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            {!isSignedIn ? (
              <>
                <h2 className="cta-title">
                  Start Your Personalized Fitness Journey
                </h2>
                <p className="cta-subtitle">
                  Join thousands of users who've transformed their lives with
                  AI-powered fitness coaching.
                </p>
                <div className="cta-buttons">
                  <SignInButton mode="modal">
                    <button className="cta-primary large">
                      Get Started Free
                      <Check className="button-icon" />
                    </button>
                  </SignInButton>
                </div>
                <p className="privacy-note">
                  Your data is safe. No spam, cancel anytime.
                </p>
              </>
            ) : (
              <>
                <h2 className="cta-title">
                  Keep Progressing with Your AI Plan
                </h2>
                <p className="cta-subtitle">
                  Your personalized fitness journey continues. Every day is a
                  step closer to your goals.
                </p>
                <div className="cta-buttons">
                  <Link to="/generate-program">
                    <button className="cta-primary large">
                      Try Ai Planner
                      <Activity className="button-icon" />
                    </button>
                  </Link>
                </div>
                <p className="privacy-note">
                  Ready to crush today's workout? Your AI trainer is waiting.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
