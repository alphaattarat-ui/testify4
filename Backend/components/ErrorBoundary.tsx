import React, { Component, ReactNode } from 'react';

// Define the shape of the component's props
interface ErrorBoundaryProps {
  children: ReactNode;
}

// Define the shape of the component's state
interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * Must be a class component.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Initialize state
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  // This static method is called after an error has been thrown by a descendant component.
  // It should return an object to update state.
  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  // This method is called after an error has been thrown.
  // We use this to log the error information.
  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  public render() {
    // If an error occurred, render a fallback UI
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-100 border border-red-400 rounded-lg text-red-700 max-w-lg mx-auto mt-10">
          <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
          <p>We are sorry for the inconvenience. Please try refreshing the page.</p>
        </div>
      );
    }

    // Otherwise, render the children component tree
    return this.props.children;
  }
}
// Note: This component is exported via a named export (`export class ErrorBoundary...`),
// which correctly matches the named import in your page file.
