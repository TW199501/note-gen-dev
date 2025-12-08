'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('组件错误:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-3 border rounded-md bg-muted/10">
          <h3 className="text-sm font-medium mb-2">组件错误</h3>
          <p className="text-xs text-muted-foreground mb-2">
            此组件加载失败，但不影响其他功能
          </p>
          {this.state.error && (
            <p className="text-xs bg-muted p-2 rounded mb-2 overflow-auto max-h-[60px]">
              {this.state.error.message}
            </p>
          )}
          <Button 
            onClick={() => this.setState({ hasError: false, error: null })} 
            variant="outline" 
            size="sm"
          >
            重试
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
