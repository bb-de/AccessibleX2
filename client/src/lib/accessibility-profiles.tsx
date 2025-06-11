import { Eye, Brain, Accessibility, MousePointer2, Focus, BookOpen, Zap, ScreenShare } from 'lucide-react';
import { AccessibilityProfileId } from '@/contexts/AccessibilityContext';

export const accessibilityProfiles = [
  {
    id: 'visionImpaired' as AccessibilityProfileId,
    title: 'Vision Impaired',
    icon: <Eye className="w-6 h-6 text-primary mx-auto" />,
    description: 'For users with vision impairments, enhances contrast and increases text size.',
  },
  {
    id: 'cognitiveDisability' as AccessibilityProfileId,
    title: 'Cognitive Disability',
    icon: <Brain className="w-6 h-6 text-primary mx-auto" />,
    description: 'For users with cognitive disabilities, simplifies content and improves readability.',
  },
  {
    id: 'senior' as AccessibilityProfileId,
    title: 'Senior',
    icon: <Accessibility className="w-6 h-6 text-primary mx-auto" />,
    description: 'For senior users, increases text size and contrast.',
  },
  {
    id: 'motorImpaired' as AccessibilityProfileId,
    title: 'Motor Impaired',
    icon: <MousePointer2 className="w-6 h-6 text-primary mx-auto" />,
    description: 'For users with motor disabilities, enhances keyboard navigation and cursor visibility.',
  },
  {
    id: 'adhdFriendly' as AccessibilityProfileId,
    title: 'ADHD Friendly',
    icon: <Focus className="w-6 h-6 text-primary mx-auto" />,
    description: 'For users with ADHD, reduces distractions and adds reading tools.',
  },
  {
    id: 'dyslexiaFriendly' as AccessibilityProfileId,
    title: 'Dyslexia Friendly',
    icon: <BookOpen className="w-6 h-6 text-primary mx-auto" />,
    description: 'For users with dyslexia, uses specialized fonts and improves text readability.',
  },
  {
    id: 'efficiencyMode' as AccessibilityProfileId,
    title: 'Efficiency Mode',
    icon: <Zap className="w-6 h-6 text-primary mx-auto" />,
    description: 'Optimized for faster loading and minimal distractions.',
  },
  {
    id: 'screenreaderMode' as AccessibilityProfileId,
    title: 'Screenreader Mode',
    icon: <ScreenShare className="w-6 h-6 text-primary mx-auto" />,
    description: 'Enhanced for screen readers with improved navigation options.',
  },
];
