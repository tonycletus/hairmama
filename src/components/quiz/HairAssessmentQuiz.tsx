import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHairAssessment } from "@/hooks/useHairAssessment";
import { useToast } from "@/hooks/use-toast";

const HairAssessmentQuiz = () => {
  const navigate = useNavigate();
  const { createAssessment } = useHairAssessment();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const questions = [
    {
      id: 'hairType',
      title: 'What is your hair type?',
      type: 'radio',
      options: [
        { value: 'straight', label: 'Straight' },
        { value: 'wavy', label: 'Wavy' },
        { value: 'curly', label: 'Curly' },
        { value: 'coily', label: 'Coily/Kinky' }
      ]
    },
    {
      id: 'hairConcerns',
      title: 'What are your main hair concerns?',
      type: 'checkbox',
      options: [
        { value: 'hair_loss', label: 'Hair Loss/Thinning' },
        { value: 'dryness', label: 'Dryness' },
        { value: 'breakage', label: 'Breakage' },
        { value: 'dullness', label: 'Lack of Shine' },
        { value: 'slow_growth', label: 'Slow Growth' },
        { value: 'dandruff', label: 'Dandruff/Scalp Issues' }
      ]
    },
    {
      id: 'hairGoals',
      title: 'What are your hair goals?',
      type: 'checkbox',
      options: [
        { value: 'growth', label: 'Faster Growth' },
        { value: 'thickness', label: 'Increased Thickness' },
        { value: 'shine', label: 'More Shine' },
        { value: 'strength', label: 'Stronger Hair' },
        { value: 'manageability', label: 'Better Manageability' },
        { value: 'overall_health', label: 'Overall Health' }
      ]
    },
    {
      id: 'currentRoutine',
      title: 'How would you describe your current hair care routine?',
      type: 'radio',
      options: [
        { value: 'minimal', label: 'Minimal (shampoo only)' },
        { value: 'basic', label: 'Basic (shampoo + conditioner)' },
        { value: 'moderate', label: 'Moderate (multiple products)' },
        { value: 'extensive', label: 'Extensive (many steps/products)' }
      ]
    },
    {
      id: 'lifestyleFactors',
      title: 'Which lifestyle factors affect your hair?',
      type: 'checkbox',
      options: [
        { value: 'stress', label: 'High Stress Levels' },
        { value: 'poor_diet', label: 'Poor Diet' },
        { value: 'lack_sleep', label: 'Lack of Sleep' },
        { value: 'pollution', label: 'Environmental Pollution' },
        { value: 'heat_styling', label: 'Frequent Heat Styling' },
        { value: 'chemical_treatments', label: 'Chemical Treatments' }
      ]
    },
    {
      id: 'dietRestrictions',
      title: 'Do you have any dietary restrictions?',
      type: 'checkbox',
      options: [
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'gluten_free', label: 'Gluten-Free' },
        { value: 'dairy_free', label: 'Dairy-Free' },
        { value: 'keto', label: 'Keto' },
        { value: 'none', label: 'No Restrictions' }
      ]
    },
    {
      id: 'supplementUsage',
      title: 'Do you currently take hair supplements?',
      type: 'radio',
      options: [
        { value: 'none', label: 'No supplements' },
        { value: 'hair_specific', label: 'Hair-specific supplements' },
        { value: 'general_vitamins', label: 'General vitamins' },
        { value: 'prescription', label: 'Prescription treatments' }
      ]
    },
    {
      id: 'exerciseFrequency',
      title: 'How often do you exercise?',
      type: 'radio',
      options: [
        { value: 'rarely', label: 'Rarely' },
        { value: 'weekly', label: '1-2 times per week' },
        { value: 'few_times_week', label: '3-4 times per week' },
        { value: 'daily', label: '5+ times per week' }
      ]
    },
    {
      id: 'sleepHours',
      title: 'How many hours do you sleep per night?',
      type: 'slider',
      min: 4,
      max: 12,
      step: 1,
      unit: 'hours'
    },
    {
      id: 'stressLevel',
      title: 'Rate your stress level (1-10)',
      type: 'slider',
      min: 1,
      max: 10,
      step: 1,
      unit: ''
    }
  ];

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    try {
      const assessmentData = {
        hair_type: answers.hairType || 'normal',
        hair_concerns: answers.hairConcerns || [],
        hair_goals: answers.hairGoals || [],
        current_routine: answers.currentRoutine || '',
        lifestyle_factors: answers.lifestyleFactors || [],
        diet_restrictions: answers.dietRestrictions || [],
        supplement_usage: answers.supplementUsage || 'none',
        exercise_frequency: answers.exerciseFrequency || 'rarely',
        sleep_hours: answers.sleepHours?.[0] || 7,
        stress_level: answers.stressLevel?.[0] || 5,
        health_score: 0,
      };

      const { error } = await createAssessment(assessmentData);
      
      if (error) {
        console.error('Assessment error details:', error);
        
        // Check if it's an authentication error
        if (error.message?.includes('JWT') || error.message?.includes('auth') || error.message?.includes('authenticated')) {
          toast({
            title: "Authentication Required",
            description: "Please check your email and confirm your account before saving your assessment.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to save assessment. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Assessment completed!",
          description: "Your personalized dashboard is ready.",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Assessment error:', error);
      toast({
        title: "Error",
        description: "Failed to complete assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = answers[currentQ.id] !== undefined;

  const renderQuestion = () => {
    switch (currentQ.type) {
      case 'radio':
        return (
          <RadioGroup 
            value={answers[currentQ.id] || ''} 
            onValueChange={(value) => handleAnswer(currentQ.id, value)}
          >
            <div className="space-y-3">
              {currentQ.options?.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-foreground">{option.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-3">
            {currentQ.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={(answers[currentQ.id] || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const current = answers[currentQ.id] || [];
                    if (checked) {
                      handleAnswer(currentQ.id, [...current, option.value]);
                    } else {
                      handleAnswer(currentQ.id, current.filter((v: string) => v !== option.value));
                    }
                  }}
                />
                <Label htmlFor={option.value} className="text-foreground">{option.label}</Label>
              </div>
            ))}
          </div>
        );
      
      case 'slider':
        return (
          <div className="space-y-6">
            <Slider
              value={answers[currentQ.id] || [currentQ.min || 0]}
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
              min={currentQ.min}
              max={currentQ.max}
              step={currentQ.step}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-2xl font-bold text-primary">
                {answers[currentQ.id]?.[0] || currentQ.min} {currentQ.unit}
              </span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Hair Health Assessment</h1>
            <p className="text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="glass-card border-border/30">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{currentQ.title}</CardTitle>
            <CardDescription>
              {currentQ.type === 'checkbox' ? 'Select all that apply' : 'Choose the best option'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderQuestion()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="ghost" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          {isLastQuestion ? (
            <Button 
              onClick={handleFinish}
              disabled={!canProceed}
              className="flex items-center space-x-2"
            >
              <span>Complete Assessment</span>
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HairAssessmentQuiz;