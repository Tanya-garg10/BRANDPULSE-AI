import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Check,
  Edit3,
  FileText,
  RotateCcw
} from 'lucide-react';
import { BrandProject, BrandBrief, InterviewQnA } from '../../types/brand';
import { fetchNextInterviewQuestion, generateBrandBrief } from '../../services/api';
import { ChromeOrb } from '../ChromeOrb';
import { EditorialAnnotation } from '../EditorialAnnotation';

interface DiscoverStageProps {
  project: BrandProject;
  onUpdateProject: (updated: BrandProject) => void;
  onContinue: () => void;
}

export const DiscoverStage: React.FC<DiscoverStageProps> = ({
  project,
  onUpdateProject,
  onContinue,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string;
    options: string[];
    reasoning: string;
  } | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [customAnswer, setCustomAnswer] = useState<string>('');
  const [loadingQuestion, setLoadingQuestion] = useState<boolean>(false);
  const [loadingBrief, setLoadingBrief] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditingBrief, setIsEditingBrief] = useState<boolean>(false);
  const [editedBrief, setEditedBrief] = useState<BrandBrief | null>(project.discovery.brandBrief);

  const interview = project.discovery.interview;
  const isInterviewComplete = interview.length >= 4;
  const brandBrief = project.discovery.brandBrief;

  useEffect(() => {
    if (interview.length < 4 && !currentQuestion && !loadingQuestion) {
      loadQuestion(interview.length);
    }
  }, [interview.length]);

  const loadQuestion = async (index: number) => {
    setLoadingQuestion(true);
    setErrorMessage(null);
    try {
      const data = await fetchNextInterviewQuestion(project, interview, index);
      setCurrentQuestion(data);
      setSelectedOption('');
      setCustomAnswer('');
    } catch (err: any) {
      console.error('Error fetching question:', err);
      setErrorMessage(err.message || 'Failed to generate interview query');
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleAnswerSubmit = async () => {
    const finalAnswer = customAnswer.trim() || selectedOption;
    if (!finalAnswer || !currentQuestion) return;

    const newQnA: InterviewQnA = {
      id: `q-${Date.now()}`,
      question: currentQuestion.question,
      options: currentQuestion.options,
      answer: finalAnswer,
      reasoning: currentQuestion.reasoning,
    };

    const updatedInterview = [...interview, newQnA];
    const updatedDiscovery = {
      ...project.discovery,
      interview: updatedInterview,
      currentQuestionIndex: updatedInterview.length,
    };

    if (updatedInterview.length >= 4) {
      setLoadingBrief(true);
      try {
        const brief = await generateBrandBrief(project, updatedInterview);
        const updatedProject: BrandProject = {
          ...project,
          discovery: {
            ...updatedDiscovery,
            brandBrief: brief,
          },
          completedStages: Array.from(new Set([...project.completedStages, 'discover'])),
        };
        onUpdateProject(updatedProject);
        setEditedBrief(brief);
      } catch (err: any) {
        console.error('Error synthesizing brief:', err);
        setErrorMessage(err.message || 'Failed to generate Brand Brief');
      } finally {
        setLoadingBrief(false);
      }
    } else {
      onUpdateProject({
        ...project,
        discovery: updatedDiscovery,
      });
      loadQuestion(updatedInterview.length);
    }
  };

  const handleSaveBrief = () => {
    if (!editedBrief) return;
    onUpdateProject({
      ...project,
      discovery: {
        ...project.discovery,
        brandBrief: editedBrief,
      },
      completedStages: Array.from(new Set([...project.completedStages, 'discover'])),
    });
    setIsEditingBrief(false);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Header Stamp */}
      <div className="border-b border-[#D9D9D2] pb-6">
        <div className="flex items-center justify-between font-tech-mono text-[10px] uppercase tracking-widest text-[#111111]/50 mb-2">
          <div className="flex items-center gap-2">
            <ChromeOrb size={14} isThinking={loadingQuestion || loadingBrief} />
            <span className="text-[#3157FF] font-semibold">01 / DISCOVER</span>
          </div>
          <span>SPECIFICATION // SOCRATIC_INTERROGATION</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
              SURFACE THE CONTRARIAN TRUTH
            </h1>
            <p className="font-editorial text-sm sm:text-base text-[#111111]/75 mt-1 italic max-w-2xl">
              An adaptive interrogation to surface the unstated problem, authentic audience reality, and competitive friction before building the brand mark.
            </p>
          </div>

          {brandBrief && (
            <button
              onClick={onContinue}
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#3157FF] text-white px-5 py-2.5 text-xs font-tech-mono uppercase font-semibold tracking-wider transition-colors shrink-0"
            >
              <span>Stage 02: Position</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 border border-[#FF6B5F] bg-[#FF6B5F]/10 text-xs font-tech-mono text-[#111111] flex items-center justify-between">
          <span>[DIAGNOSTIC ADVISORY]: {errorMessage}</span>
          <button
            onClick={() => {
              setErrorMessage(null);
              loadQuestion(interview.length);
            }}
            className="underline text-[#3157FF] hover:text-[#111111] uppercase font-bold ml-4"
          >
            Retry Query
          </button>
        </div>
      )}

      {/* Brand Brief Sheet */}
      {brandBrief && (
        <div className="border border-[#D9D9D2] bg-white p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between border-b border-[#D9D9D2] pb-4">
            <div>
              <div className="font-tech-mono text-[10px] text-[#3157FF] uppercase tracking-widest font-semibold">
                DOCUMENT // SYNTHESIS COMPLETE
              </div>
              <h3 className="font-display font-bold text-xl uppercase text-[#111111] mt-0.5">
                Strategic Brand Brief
              </h3>
            </div>
            <button
              onClick={() => setIsEditingBrief(!isEditingBrief)}
              className="font-tech-mono text-[11px] text-[#111111]/60 hover:text-[#3157FF] uppercase tracking-wider transition-colors font-medium"
            >
              {isEditingBrief ? '[CANCEL EDIT]' : '[EDIT BRIEF]'}
            </button>
          </div>

          {isEditingBrief && editedBrief ? (
            <div className="space-y-4 font-tech-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-[#111111]/50 mb-1">Target Audience:</label>
                <input
                  type="text"
                  value={editedBrief.targetAudience}
                  onChange={(e) => setEditedBrief({ ...editedBrief, targetAudience: e.target.value })}
                  className="w-full p-2.5 border border-[#D9D9D2] bg-[#F7F6F2]/40"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#111111]/50 mb-1">Core Problem:</label>
                <textarea
                  rows={2}
                  value={editedBrief.problem}
                  onChange={(e) => setEditedBrief({ ...editedBrief, problem: e.target.value })}
                  className="w-full p-2.5 border border-[#D9D9D2] bg-[#F7F6F2]/40"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#111111]/50 mb-1">Contrarian Insight:</label>
                <textarea
                  rows={2}
                  value={editedBrief.initialInsight}
                  onChange={(e) => setEditedBrief({ ...editedBrief, initialInsight: e.target.value })}
                  className="w-full p-2.5 border border-[#D9D9D2] bg-[#F7F6F2]/40"
                />
              </div>
              <button
                onClick={handleSaveBrief}
                className="px-4 py-2 bg-[#111111] text-white text-xs uppercase font-semibold"
              >
                Save Brief Amendments
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
              <div className="space-y-4">
                <div>
                  <span className="font-tech-mono text-[10px] uppercase text-[#111111]/45 tracking-wider block mb-1">
                    TARGET AUDIENCE TRUTH:
                  </span>
                  <p className="font-medium text-[#111111] leading-relaxed">
                    {brandBrief.targetAudience}
                  </p>
                </div>
                <div>
                  <span className="font-tech-mono text-[10px] uppercase text-[#111111]/45 tracking-wider block mb-1">
                    ACUTE UNMET FRICTION:
                  </span>
                  <p className="text-[#111111]/85 leading-relaxed">
                    {brandBrief.problem}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t md:border-t-0 md:border-l border-[#D9D9D2] pt-4 md:pt-0 md:pl-8">
                <div>
                  <span className="font-tech-mono text-[10px] uppercase text-[#3157FF] tracking-wider block mb-1 font-semibold">
                    CONTRARIAN INSIGHT:
                  </span>
                  <p className="font-editorial text-sm italic text-[#111111] leading-relaxed">
                    “{brandBrief.initialInsight}”
                  </p>
                </div>
                <div>
                  <span className="font-tech-mono text-[10px] uppercase text-[#111111]/45 tracking-wider block mb-1">
                    EXPECTED OUTCOME / PROMISE:
                  </span>
                  <p className="text-[#111111]/85 leading-relaxed">
                    {brandBrief.userNeed || 'Defensible execution outcome'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Editorial Observation */}
          <EditorialAnnotation
            timestamp="10:04"
            observation="The target audience is clearly isolated from corporate proxies. Recommend anchoring positioning around verified capability rather than general networking."
            actionText="CONTINUE TO POSITIONING →"
            onAction={onContinue}
          />
        </div>
      )}

      {/* Socratic Interview Progress & Questions */}
      {!isInterviewComplete && (
        <div className="border border-[#D9D9D2] bg-white p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between border-b border-[#D9D9D2] pb-4">
            <div className="font-tech-mono text-[10px] text-[#111111]/50 uppercase tracking-widest">
              QUERY {interview.length + 1} OF 4
            </div>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 w-6 transition-colors ${
                    step < interview.length
                      ? 'bg-[#3157FF]'
                      : step === interview.length
                      ? 'bg-[#111111]'
                      : 'bg-[#D9D9D2]'
                  }`}
                />
              ))}
            </div>
          </div>

          {loadingQuestion ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <ChromeOrb size={32} isThinking={true} />
              <div className="font-tech-mono text-xs text-[#111111]/60 uppercase tracking-widest">
                Formulating adaptive query...
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-editorial text-xl sm:text-2xl text-[#111111] italic leading-snug">
                  "{currentQuestion.question}"
                </h3>
                <p className="font-tech-mono text-[11px] text-[#111111]/50 mt-1">
                  STRATEGIC RATIONALE: {currentQuestion.reasoning}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedOption(opt);
                      setCustomAnswer('');
                    }}
                    className={`w-full text-left p-3.5 border transition-all text-xs font-sans ${
                      selectedOption === opt
                        ? 'border-[#3157FF] bg-white text-[#111111] font-medium shadow-[0_1px_4px_rgba(49,87,255,0.08)]'
                        : 'border-[#D9D9D2] bg-[#F7F6F2]/40 hover:bg-white text-[#111111]/80 hover:border-[#111111]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-tech-mono text-[10px] text-[#111111]/40 uppercase mt-0.5">
                        0{idx + 1}
                      </span>
                      <span>{opt}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Answer input */}
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Or provide a specific nuance..."
                  value={customAnswer}
                  onChange={(e) => {
                    setCustomAnswer(e.target.value);
                    if (e.target.value) setSelectedOption('');
                  }}
                  className="w-full p-3 border border-[#D9D9D2] bg-[#F7F6F2]/30 text-xs font-editorial text-[#111111] outline-none focus:border-[#3157FF]"
                />
              </div>

              {/* Submit answer */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleAnswerSubmit}
                  disabled={!selectedOption && !customAnswer.trim()}
                  className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#3157FF] text-white px-6 py-2.5 text-xs font-tech-mono uppercase font-semibold tracking-wider transition-colors disabled:opacity-40"
                >
                  <span>Submit Observation</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs font-editorial text-[#111111]/70 italic">
                Ready to generate adaptive interrogation query {interview.length + 1} of 4.
              </p>
              <button
                onClick={() => loadQuestion(interview.length)}
                className="px-5 py-2.5 bg-[#111111] hover:bg-[#3157FF] text-white text-xs font-tech-mono uppercase tracking-wider font-semibold transition-colors"
              >
                Formulate Socratic Query →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Completed Q&A Log */}
      {interview.length > 0 && (
        <div className="border-t border-[#D9D9D2] pt-6 space-y-4">
          <div className="font-tech-mono text-[10px] text-[#111111]/45 uppercase tracking-widest">
            INTERVIEW TRANSCRIPT ARCHIVE ({interview.length})
          </div>
          <div className="space-y-3">
            {interview.map((qna, idx) => (
              <div key={idx} className="p-4 border border-[#D9D9D2] bg-white text-xs space-y-1">
                <div className="font-tech-mono text-[10px] text-[#3157FF] font-semibold">
                  Q0{idx + 1}: {qna.question}
                </div>
                <div className="font-editorial text-xs text-[#111111] italic">
                  → {qna.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
