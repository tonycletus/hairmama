import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Sparkles, CheckCircle, ArrowRight, TrendingUp, Calendar, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const GoalSetting = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Support
          </Button>
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Target className="h-3 w-3 mr-1" />
              Goal Setting
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">Setting Achievable Hair Goals</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn how to set realistic, measurable hair goals and track your progress with Hairmama's AI-powered goal management system.
            </p>
          </div>
        </div>

        {/* Why Goal Setting Matters */}
        <Card className="mb-8 glass-card border-border/30">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Why Setting Hair Goals Matters</h2>
              <p className="text-muted-foreground mb-6">
                Clear, achievable goals are the roadmap to your hair transformation. They keep you motivated, focused, and help you measure progress. Hairmama's AI technology makes goal setting and tracking easier than ever.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="glass-card p-4 rounded-lg border-border/30">
                  <TrendingUp className="h-6 w-6 text-accent mx-auto mb-2" />
                  <p className="font-semibold text-foreground">Stay Motivated</p>
                  <p className="text-muted-foreground">Clear goals keep you focused on your hair journey</p>
                </div>
                <div className="glass-card p-4 rounded-lg border-border/30">
                  <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-foreground">Track Progress</p>
                  <p className="text-muted-foreground">Measure improvements with AI-powered analysis</p>
                </div>
                <div className="glass-card p-4 rounded-lg border-border/30">
                  <Award className="h-6 w-6 text-success mx-auto mb-2" />
                  <p className="font-semibold text-foreground">Celebrate Wins</p>
                  <p className="text-muted-foreground">Acknowledge milestones and achievements</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMART Goal Framework */}
        <Card className="mb-8 glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              The SMART Goal Framework
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Use the SMART framework to create goals that are Specific, Measurable, Achievable, Relevant, and Time-bound. This approach ensures your hair goals are realistic and trackable.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Specific</h3>
                <p className="text-muted-foreground mb-3">
                  Define exactly what you want to achieve. Instead of "I want healthier hair," say "I want to reduce split ends by 50% in 3 months."
                </p>
                <div className="bg-secondary/30 p-4 rounded-lg border border-secondary/20">
                  <p className="text-sm text-secondary-foreground">
                    <strong>Hairmama Tip:</strong> Our AI can help you identify specific hair concerns and set targeted goals based on your unique hair characteristics.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-accent pl-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Measurable</h3>
                <p className="text-muted-foreground mb-3">
                  Include numbers and metrics to track progress. "I want my hair to grow 2 inches in 6 months" is measurable.
                </p>
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent-foreground">
                    <strong>Hairmama Tip:</strong> Our progress tracking system can measure hair length, density, and health metrics over time.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-success pl-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Achievable</h3>
                <p className="text-muted-foreground mb-3">
                  Set goals that are challenging but realistic. Consider your hair type, lifestyle, and current condition.
                </p>
                <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                  <p className="text-sm text-accent-foreground">
                    <strong>Hairmama Tip:</strong> Our AI considers your hair's natural growth rate and characteristics when suggesting achievable goals.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-warning pl-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Relevant</h3>
                <p className="text-muted-foreground mb-3">
                  Ensure your goals align with your overall hair care vision and lifestyle. They should matter to you personally.
                </p>
                <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                  <p className="text-sm text-warning-foreground">
                    <strong>Hairmama Tip:</strong> Our goal-setting system helps you prioritize goals based on your hair's most pressing needs.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-destructive pl-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Time-bound</h3>
                <p className="text-muted-foreground mb-3">
                  Set deadlines for your goals. This creates urgency and helps you stay accountable to your hair care routine.
                </p>
                <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                  <p className="text-sm text-accent-foreground">
                    <strong>Hairmama Tip:</strong> Our system sends reminders and tracks progress toward your time-bound goals.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Hair Goals */}
        <Card className="mb-8 glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" />
              Popular Hair Goals & How to Achieve Them
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Here are some common hair goals and how Hairmama's AI technology can help you achieve them effectively.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Hair Growth Goals</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Set realistic growth targets (0.5-1 inch per month)</li>
                  <li>• Focus on scalp health and nutrition</li>
                  <li>• Minimize damage and breakage</li>
                  <li>• Track progress with regular photos</li>
                </ul>
                <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <p className="text-sm text-accent-foreground">
                    <strong>AI Insight:</strong> Our system can track hair length changes and suggest growth-optimizing routines.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Damage Repair Goals</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Identify specific damage types</li>
                  <li>• Set repair timelines (3-6 months typical)</li>
                  <li>• Focus on protein and moisture balance</li>
                  <li>• Avoid further damage</li>
                </ul>
                <div className="bg-success/10 p-3 rounded-lg border border-success/20">
                  <p className="text-sm text-accent-foreground">
                    <strong>AI Insight:</strong> Our analysis can detect damage patterns and recommend targeted repair strategies.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Texture & Style Goals</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Define desired texture changes</li>
                  <li>• Consider natural hair characteristics</li>
                  <li>• Set realistic styling expectations</li>
                  <li>• Focus on enhancing natural beauty</li>
                </ul>
                <div className="bg-accent/10 p-3 rounded-lg">
                  <p className="text-sm text-accent-foreground">
                    <strong>AI Insight:</strong> We can analyze your hair's natural texture and suggest enhancement techniques.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Scalp Health Goals</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Address specific scalp concerns</li>
                  <li>• Set improvement timelines</li>
                  <li>• Focus on cleansing and nourishment</li>
                  <li>• Monitor scalp condition changes</li>
                </ul>
                <div className="bg-warning/10 p-3 rounded-lg">
                  <p className="text-sm text-warning-foreground">
                    <strong>AI Insight:</strong> Our system can track scalp health indicators and suggest targeted treatments.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goal Setting Process */}
        <Card className="mb-8 glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-success" />
              Your Goal Setting Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Follow this step-by-step process to create effective hair goals with Hairmama's AI assistance.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 glass-card rounded-lg border-border/30">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Assess Your Current Hair</h4>
                  <p className="text-muted-foreground mb-3">
                    Start with a comprehensive hair assessment using Hairmama's AI analysis. This gives you a baseline understanding of your hair's current condition, type, and characteristics.
                  </p>
                  <Button 
                    onClick={() => navigate('/auth')}
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Start Hair Assessment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 glass-card rounded-lg border-border/30">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Identify Your Priorities</h4>
                  <p className="text-muted-foreground mb-3">
                    Based on your assessment, identify the most important areas for improvement. Focus on 2-3 primary goals rather than trying to change everything at once.
                  </p>
                  <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
                    <p className="text-sm text-accent-foreground">
                      <strong>Tip:</strong> Our AI can help prioritize goals based on your hair's most pressing needs and your lifestyle.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 glass-card rounded-lg border-border/30">
                <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-success font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Set SMART Goals</h4>
                  <p className="text-muted-foreground mb-3">
                    Transform your priorities into specific, measurable, achievable, relevant, and time-bound goals. Use our goal-setting tools to create structured objectives.
                  </p>
                  <div className="bg-success/10 p-3 rounded-lg border border-success/20">
                    <p className="text-sm text-accent-foreground">
                      <strong>Example:</strong> "Reduce split ends by 40% within 4 months through weekly deep conditioning and monthly trims."
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 glass-card rounded-lg border-border/30">
                <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-warning font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Create Your Action Plan</h4>
                  <p className="text-muted-foreground mb-3">
                    Develop a detailed plan with specific steps, timelines, and milestones. Our AI can suggest personalized routines and products to help you achieve your goals.
                  </p>
                  <div className="bg-warning/10 p-3 rounded-lg border border-warning/20">
                    <p className="text-sm text-warning-foreground">
                      <strong>AI Advantage:</strong> Get customized routines that adapt to your progress and changing needs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 glass-card rounded-lg border-border/30">
                <div className="w-8 h-8 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-destructive font-bold text-sm">5</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Track & Adjust</h4>
                  <p className="text-muted-foreground mb-3">
                    Regularly monitor your progress using Hairmama's tracking tools. Celebrate milestones and adjust your goals as needed based on your results.
                  </p>
                  <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                    <p className="text-sm text-accent-foreground">
                      <strong>Progress Tracking:</strong> Our AI analyzes your photos and provides detailed progress reports with actionable insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goal Tracking Tips */}
        <Card className="mb-8 glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="h-6 w-6 text-warning" />
              Goal Tracking & Motivation Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Stay motivated and on track with these proven strategies for achieving your hair goals.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Stay Motivated</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Celebrate small wins and milestones</li>
                  <li>• Visualize your end goal regularly</li>
                  <li>• Join hair care communities for support</li>
                  <li>• Remind yourself why your goals matter</li>
                  <li>• Use progress photos to see improvements</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Overcome Setbacks</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Don't let one bad hair day derail you</li>
                  <li>• Adjust goals if they're too ambitious</li>
                  <li>• Focus on progress, not perfection</li>
                  <li>• Learn from setbacks and adapt</li>
                  <li>• Remember that hair growth takes time</li>
                </ul>
              </div>
            </div>

            <div className="glass-card p-6 rounded-lg border-border/30">
              <h3 className="text-lg font-semibold text-foreground mb-3">The Hairmama Motivation System</h3>
              <p className="text-muted-foreground mb-4">
                Our AI-powered platform provides continuous motivation through progress tracking, milestone celebrations, and personalized encouragement. Stay engaged with your hair journey through our comprehensive tracking system.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
              >
                Start Your Goal Journey
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="glass-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Set Your Hair Goals?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of users who are achieving their hair dreams with Hairmama's AI-powered goal setting and tracking system.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-background text-foreground hover:bg-muted"
                size="lg"
              >
                Start Free Hair Assessment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalSetting;
