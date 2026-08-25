import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center min-h-screen px-4">
          <h1 className="text-3xl font-bold text-base-content">
            Something went wrong
          </h1>
          <p className="text-base-content/60 max-w-sm">
            An unexpected error occurred. Please refresh the page and try
            again.
          </p>
          <button
            className="btn btn-primary mt-2"
            onClick={() => window.location.assign("/")}
          >
            Go to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
