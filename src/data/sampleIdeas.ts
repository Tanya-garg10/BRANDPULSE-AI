export interface SampleIdea {
  name: string;
  roughIdea: string;
  targetAudience: string;
  industry: string;
  marketLocation: string;
  constraints: string;
}

// Single streamlined benchmark reference concept
export const BENCHMARK_IDEA: SampleIdea = {
  name: 'TeamMatch',
  roughIdea: 'An AI platform that pairs collegiate hackers based on complementary skill gaps and work styles, replacing chaotic Discord mixers with high-signal synergy matching.',
  targetAudience: 'Student engineers, designers, and collegiate hackers participating in hackathons',
  industry: 'Developer Community & Educational Technology',
  marketLocation: 'Collegiate & Virtual Hackathon Circuit',
  constraints: 'Strictly avoid corporate recruiter speak or superficial swipe mechanics; maintain high-signal hacker authenticity.'
};

export const SAMPLE_IDEAS: SampleIdea[] = [BENCHMARK_IDEA];
