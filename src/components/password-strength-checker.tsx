'use client';

/**
 * Password Strength Checker Component
 * Displays password strength feedback
 */

import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';

interface PasswordStrengthCheckerProps {
  password: string;
  onStrengthChange?: (strength: string, score: number) => void;
}

export function PasswordStrengthChecker({
  password,
  onStrengthChange,
}: PasswordStrengthCheckerProps) {
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong' | 'very_strong' | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!password || password.length === 0) {
      setStrength(null);
      setScore(0);
      setFeedback([]);
      return;
    }

    const checkStrength = async () => {
      setIsChecking(true);
      try {
        const response = await authService.checkPasswordStrength(password);
        if (response.success && response.data) {
          setStrength(response.data.strength);
          setScore(response.data.score);
          setFeedback(response.data.feedback || []);
          onStrengthChange?.(response.data.strength, response.data.score);
        }
      } catch (error) {
        console.error('Error checking password strength:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Debounce the check
    const timeoutId = setTimeout(checkStrength, 500);
    return () => clearTimeout(timeoutId);
  }, [password, onStrengthChange]);

  if (!password || password.length === 0) {
    return null;
  }

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-blue-500';
      case 'very_strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'weak':
        return 'Débil';
      case 'medium':
        return 'Media';
      case 'strong':
        return 'Fuerte';
      case 'very_strong':
        return 'Muy Fuerte';
      default:
        return 'Verificando...';
    }
  };

  const getStrengthWidth = () => {
    switch (strength) {
      case 'weak':
        return '25%';
      case 'medium':
        return '50%';
      case 'strong':
        return '75%';
      case 'very_strong':
        return '100%';
      default:
        return '0%';
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: getStrengthWidth() }}
          />
        </div>
        <span className={`text-sm font-medium ${strength ? 'text-gray-700' : 'text-gray-400'}`}>
          {isChecking ? 'Verificando...' : getStrengthText()}
        </span>
      </div>
      {feedback.length > 0 && (
        <ul className="text-xs text-gray-600 space-y-1">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-start gap-1">
              <span className="text-gray-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
